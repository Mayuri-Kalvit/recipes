import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Recipe, RecipeFrontmatter } from '@/types/recipe';

const recipesDirectory = path.join(process.cwd(), 'content/recipes');

export async function getAllRecipes(): Promise<RecipeFrontmatter[]> {
    const localFileNames = fs.existsSync(recipesDirectory) ? fs.readdirSync(recipesDirectory) : [];

    // Get local recipes
    const localRecipes: RecipeFrontmatter[] = localFileNames
        .filter((fileName) => fileName.endsWith('.mdx'))
        .map((fileName) => {
            const fullPath = path.join(recipesDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                ...(data as RecipeFrontmatter),
                slug: data.slug || fileName.replace(/\.mdx$/, ''),
                meal_types: data.meal_types || [],
                image_url: data.image_url || undefined,
            };
        });

    // GitHub Fallback for new recipes NOT in local filesystem
    let githubRecipes: RecipeFrontmatter[] = [];
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

    if (GITHUB_TOKEN && GITHUB_REPO) {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_REPO}/contents/content/recipes?ref=${GITHUB_BRANCH}`,
                {
                    headers: {
                        'Authorization': `Bearer ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                    },
                    next: { revalidate: 0 }
                }
            );

            if (response.ok) {
                const files = await response.json();
                if (Array.isArray(files)) {
                    const mdxFiles = files.filter(f => f.name.endsWith('.mdx'));

                    // Find files that aren't local
                    const missingFiles = mdxFiles.filter(f => !localFileNames.includes(f.name));

                    if (missingFiles.length > 0) {
                        const fetched = await Promise.all(missingFiles.map(async (f) => {
                            const detailRes = await fetch(f.download_url, {
                                next: { revalidate: 0 }
                            });
                            if (!detailRes.ok) return null;
                            const content = await detailRes.text();
                            const { data } = matter(content);
                            return {
                                ...(data as RecipeFrontmatter),
                                slug: data.slug || f.name.replace(/\.mdx$/, ''),
                                meal_types: data.meal_types || [],
                                image_url: data.image_url || undefined,
                            } as RecipeFrontmatter;
                        }));
                        githubRecipes = fetched.filter(Boolean) as RecipeFrontmatter[];
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching recipes from GitHub:', error);
        }
    }

    // Merge and deduplicate by slug
    const allRecipesData: RecipeFrontmatter[] = [...localRecipes];
    githubRecipes.forEach(gr => {
        if (!allRecipesData.find(lr => lr.slug === gr.slug)) {
            allRecipesData.push(gr);
        }
    });

    // Sort recipes by date if available, otherwise by title
    return allRecipesData.sort((a, b) => {
        if (a.date && b.date) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.title.localeCompare(b.title);
    });
}

export async function getProteinSources(): Promise<string[]> {
    const recipes = await getAllRecipes();
    const sources = new Set(
        recipes
            .map(r => r.protein_source)
            .filter(Boolean)
            .map(s => s.trim().charAt(0).toUpperCase() + s.trim().slice(1)) // Simple title casing
    );
    return Array.from(sources).sort();
}

/**
 * Fetches pending submissions from GitHub content/submissions directory
 */
export async function getPendingSubmissions(): Promise<RecipeFrontmatter[]> {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

    if (!GITHUB_TOKEN || !GITHUB_REPO) {
        console.warn('GITHUB_TOKEN or GITHUB_REPO not configured. Cannot fetch submissions.');
        return [];
    }

    try {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/content/submissions?ref=${GITHUB_BRANCH}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            next: { revalidate: 0 } // Always fresh
        });

        if (response.status === 404) return [];
        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

        const files = await response.json() as any[];
        const mdxFiles = files.filter(f => f.name.endsWith('.mdx'));

        const submissions = await Promise.all(mdxFiles.map(async (file) => {
            const contentResponse = await fetch(file.download_url);
            const content = await contentResponse.text();
            const { data, content: mdxBody } = matter(content);

            return {
                title: data.title || '',
                protein_source: data.protein_source || '',
                calories: data.calories || 0,
                protein_grams: data.protein_grams || 0,
                time_minutes: data.time_minutes || 0,
                servings: data.servings || 1,
                image_url: data.image_url,
                slug: data.slug || file.name.replace('.mdx', ''),
                content: mdxBody,
                tags: Array.isArray(data.tags) ? data.tags : [],
                meal_types: Array.isArray(data.meal_types) ? data.meal_types : [],
                date: data.date || '',
                author: data.author || '',
                author_note: data.author_note || '',
                path: file.path // Store path for approval/rejection actions
            } as RecipeFrontmatter & { path: string };
        }));

        return submissions;
    } catch (error) {
        console.error('Error fetching submissions from GitHub:', error);
        return [];
    }
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
    try {
        const fullPath = path.join(recipesDirectory, `${slug}.mdx`);
        let fileContents: string;

        if (fs.existsSync(fullPath)) {
            fileContents = fs.readFileSync(fullPath, 'utf8');
        } else {
            // Fallback to GitHub API if local file doesn't exist yet (e.g. during build delay)
            const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
            const GITHUB_REPO = process.env.GITHUB_REPO;
            const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

            if (!GITHUB_TOKEN || !GITHUB_REPO) {
                console.warn('GitHub credentials missing for fallback fetch');
                return null;
            }

            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_REPO}/contents/content/recipes/${slug}.mdx?ref=${GITHUB_BRANCH}`,
                {
                    headers: {
                        'Authorization': `Bearer ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3.raw',
                    },
                    next: { revalidate: 0 } // Don't cache this fallback
                }
            );

            if (!response.ok) return null;
            fileContents = await response.text();
        }

        const { data, content } = matter(fileContents);

        return {
            ...(data as RecipeFrontmatter),
            slug,
            content,
        };
    } catch (error) {
        console.error(`Error fetching recipe ${slug}:`, error);
        return null;
    }
}

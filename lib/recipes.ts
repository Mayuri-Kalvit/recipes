import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Recipe, RecipeFrontmatter } from '@/types/recipe';

const recipesDirectory = path.join(process.cwd(), 'content/recipes');

export async function getAllRecipes(): Promise<RecipeFrontmatter[]> {
    if (!fs.existsSync(recipesDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(recipesDirectory);
    const allRecipesData = fileNames
        .filter((fileName) => fileName.endsWith('.mdx'))
        .map((fileName) => {
            const fullPath = path.join(recipesDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                ...(data as RecipeFrontmatter),
                slug: data.slug || fileName.replace(/\.mdx$/, ''),
                meal_types: data.meal_types || [],
                image_url: data.image_url || null,
            };
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
    const sources = new Set(recipes.map(r => r.protein_source).filter(Boolean));
    return Array.from(sources).sort();
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
    try {
        const fullPath = path.join(recipesDirectory, `${slug}.mdx`);
        if (!fs.existsSync(fullPath)) return null;

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            ...(data as RecipeFrontmatter),
            slug,
            content,
        };
    } catch (error) {
        return null;
    }
}

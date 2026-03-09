"use server";

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { ProteinSource } from '@/types/recipe';
import { isAdmin, login, logout } from '@/lib/auth';
import { commitToGithub, deleteFromGithub } from '@/lib/github';

export async function handleLogin(password: string) {
    const success = await login(password);
    if (success) {
        revalidatePath('/');
        return { success: true };
    }
    return { success: false };
}

export async function handleLogout() {
    await logout();
    revalidatePath('/');
}

async function handleImageUpload(image: File | null, slug: string): Promise<string | null> {
    if (!image || image.size === 0) {
        return null;
    }

    try {
        const extension = image.name.split('.').pop() || 'jpg';
        const fileName = `${slug}-${Date.now()}.${extension}`;

        // Use Vercel Blob instead of local fs
        const blob = await put(`recipes/${fileName}`, image, {
            access: 'public',
        });

        return blob.url;
    } catch (error) {
        console.error('[UPLOAD] CRITICAL ERROR:', error);
        return null;
    }
}

export async function saveRecipe(formData: FormData, existingSlug?: string) {
    if (!await isAdmin()) {
        return { success: false, error: 'Unauthorized: Admin access required.' };
    }
    try {
        const title = formData.get('title') as string;
        if (!title) throw new Error('Title is required');

        const slug = existingSlug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

        const proteinSelect = formData.get('protein_source_select') as string;
        const proteinCustom = formData.get('protein_source_custom') as string;
        const protein_source = proteinSelect === 'other' ? proteinCustom : proteinSelect;

        const calories = parseInt(formData.get('calories') as string) || 0;
        const protein_grams = parseInt(formData.get('protein_grams') as string) || 0;
        const time_minutes = parseInt(formData.get('time_minutes') as string) || 0;
        const servings = parseInt(formData.get('servings') as string) || 1;
        const tagsString = formData.get('tags') as string || '';
        const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);

        const meal_types = formData.getAll('meal_types') as string[];
        const ingredients = formData.get('ingredients') as string;
        const instructions = formData.get('instructions') as string;

        // Image handling
        const imageFile = formData.get('image') as File | null;
        let image_url = formData.get('existing_image_url') as string | null;

        if (imageFile && imageFile.size > 0) {
            console.log(`[SAVE] Uploading new image for ${slug}...`);
            const uploadedUrl = await handleImageUpload(imageFile, slug);
            if (uploadedUrl) {
                console.log(`[SAVE] Image uploaded successfully: ${uploadedUrl}`);
                image_url = uploadedUrl;
            } else {
                console.error('[SAVE] Image upload failed');
            }
        } else {
            console.log('[SAVE] No new image file provided, using existing or null');
        }

        const author = formData.get('author') as string || '';
        const author_note = formData.get('author_note') as string || '';

        const content = `
## Ingredients
${ingredients}

## Instructions
${instructions}
`;

        const date = formData.get('date') as string || new Date().toISOString().split('T')[0];

        const mdxContent = `---
title: "${title}"
slug: "${slug}"
protein_source: "${protein_source}"
calories: ${calories}
protein_grams: ${protein_grams}
time_minutes: ${time_minutes}
servings: ${servings}
tags: ${JSON.stringify(tags)}
meal_types: ${JSON.stringify(meal_types)}
image_url: ${image_url ? `"${image_url}"` : "null"}
date: "${date}"
author: "${author}"
author_note: "${author_note}"
---
${content}
`;

        // Use GitHub API instead of local fs
        const githubPath = `content/recipes/${slug}.mdx`;
        await commitToGithub(githubPath, mdxContent, `Add/Update recipe: ${title}`);

        revalidatePath('/');
        revalidatePath(`/recipes/${slug}`);
        return { success: true, slug };
    } catch (error) {
        console.error('Save Recipe Failure:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred while saving.'
        };
    }
}

export async function submitRecipe(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        if (!title) throw new Error('Title is required');

        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

        const proteinSelect = formData.get('protein_source_select') as string;
        const proteinCustom = formData.get('protein_source_custom') as string;
        const protein_source = proteinSelect === 'other' ? proteinCustom : proteinSelect;

        const calories = parseInt(formData.get('calories') as string) || 0;
        const protein_grams = parseInt(formData.get('protein_grams') as string) || 0;
        const meal_types = formData.getAll('meal_types') as string[];
        const ingredients = formData.get('ingredients') as string;
        const instructions = formData.get('instructions') as string;
        const author = formData.get('author') as string || 'Community Member';
        const author_note = formData.get('author_note') as string || '';

        // Image handling for submission
        const imageFile = formData.get('image') as File | null;
        let image_url = null;

        if (imageFile && imageFile.size > 0) {
            const uploadedUrl = await handleImageUpload(imageFile, `submission-${slug}`);
            if (uploadedUrl) {
                image_url = uploadedUrl;
            }
        }

        const content = `
## Ingredients
${ingredients}

## Instructions
${instructions}
`;

        const date = new Date().toISOString().split('T')[0];

        const mdxContent = `---
title: "${title}"
slug: "${slug}"
protein_source: "${protein_source}"
calories: ${calories}
protein_grams: ${protein_grams}
time_minutes: 0
servings: 1
tags: []
meal_types: ${JSON.stringify(meal_types)}
image_url: ${image_url ? `"${image_url}"` : "null"}
date: "${date}"
author: "${author}"
author_note: "${author_note}"
---
${content}
`;

        const githubPath = `content/submissions/${slug}-${Date.now()}.mdx`;
        await commitToGithub(githubPath, mdxContent, `User Submission: ${title}`);

        return { success: true };
    } catch (error) {
        console.error('Submit Recipe Failure:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to submit recipe.'
        };
    }
}

export async function approveSubmission(submissionPath: string, recipeData: any) {
    console.log(`[APPROVE] Starting approval for: ${recipeData.title} at ${submissionPath}`);
    if (!await isAdmin()) {
        console.warn('[APPROVE] Unauthorized attempt.');
        return { success: false, error: 'Unauthorized.' };
    }

    try {
        const slug = recipeData.slug;
        console.log(`[APPROVE] Committing to content/recipes/${slug}.mdx`);
        const mdxContent = `---
title: "${recipeData.title}"
slug: "${slug}"
protein_source: "${recipeData.protein_source}"
calories: ${recipeData.calories}
protein_grams: ${recipeData.protein_grams}
time_minutes: ${recipeData.time_minutes || 0}
servings: ${recipeData.servings || 1}
tags: ${JSON.stringify(recipeData.tags || [])}
meal_types: ${JSON.stringify(recipeData.meal_types || [])}
image_url: ${recipeData.image_url ? `"${recipeData.image_url}"` : "null"}
date: "${new Date().toISOString().split('T')[0]}"
author: "${recipeData.author || ''}"
author_note: "${recipeData.author_note || ''}"
---
## Ingredients
${recipeData.content.split(/## Instructions/i)[0].replace(/## Ingredients/i, '').trim()}

## Instructions
${recipeData.content.split(/## Instructions/i)[1]?.trim() || 'Instructions not provided.'}
`;

        await commitToGithub(`content/recipes/${slug}.mdx`, mdxContent, `Approve submission: ${recipeData.title}`);
        console.log(`[APPROVE] Deleting submission from ${submissionPath}`);
        await deleteFromGithub(submissionPath, `Internal: Move approved submission`);

        console.log('[APPROVE] Revalidating paths...');
        revalidatePath('/');
        revalidatePath('/admin/suggestions');
        console.log('[APPROVE] Success!');
        return { success: true };
    } catch (error) {
        console.error('[APPROVE] failure:', error);
        return { success: false, error: 'Failed to approve.' };
    }
}

export async function rejectSubmission(submissionPath: string) {
    console.log(`[REJECT] Deleting submission at ${submissionPath}`);
    if (!await isAdmin()) {
        console.warn('[REJECT] Unauthorized attempt.');
        return { success: false, error: 'Unauthorized.' };
    }

    try {
        await deleteFromGithub(submissionPath, `Reject submission`);
        console.log('[REJECT] Revalidating path...');
        revalidatePath('/admin/suggestions');
        console.log('[REJECT] Success!');
        return { success: true };
    } catch (error) {
        console.error('[REJECT] failure:', error);
        return { success: false, error: 'Failed to delete submission.' };
    }
}

export async function deleteRecipe(slug: string) {
    if (!await isAdmin()) {
        return { success: false, error: 'Unauthorized: Admin access required.' };
    }

    try {
        // Use GitHub API instead of local fs
        const githubPath = `content/recipes/${slug}.mdx`;
        await deleteFromGithub(githubPath, `Delete recipe: ${slug}`);

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Delete Recipe Failure:', error);
        return { success: false, error: 'Failed to delete recipe.' };
    }
}

export async function calculateNutrition(formData: FormData) {
    const weight = Number(formData.get('weight'));
    const height = Number(formData.get('height'));
    const age = Number(formData.get('age'));
    const sex = formData.get('sex') as 'male' | 'female';
    const activityLevel = formData.get('activityLevel') as 'sedentary' | 'light' | 'moderate' | 'very-active';
    const strengthTraining = formData.get('strengthTraining') === 'true';

    // BMR using Mifflin-St Jeor
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (sex === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    // Activity multipliers
    const multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'very-active': 1.725
    };
    const tdee = bmr * multipliers[activityLevel];

    // Protein target
    const protein_target_g = strengthTraining ? weight * 1.2 : weight;

    // Daily calorie targets
    const maintenance_calories = tdee;
    const muscle_gain_calories = tdee + 250;

    // Fat loss with floor
    const minCalories = sex === 'male' ? 1500 : 1200;
    const fat_loss_calories = Math.max(minCalories, tdee - 500);

    return {
        success: true,
        results: {
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            protein_target_g: Math.round(protein_target_g),
            maintenance_calories: Math.round(maintenance_calories),
            fat_loss_calories: Math.round(fat_loss_calories),
            muscle_gain_calories: Math.round(muscle_gain_calories)
        }
    };
}

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
            const uploadedUrl = await handleImageUpload(imageFile, slug);
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

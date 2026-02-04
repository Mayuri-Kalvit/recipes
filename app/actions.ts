"use server";

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { ProteinSource } from '@/types/recipe';
import { isAdmin, login, logout } from '@/lib/auth';

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

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/recipes');

async function handleImageUpload(image: File | null, slug: string): Promise<string | null> {
    if (!image || image.size === 0) {
        console.log('No image provided or image is empty.');
        return null;
    }

    try {
        const extension = image.name.split('.').pop() || 'jpg';
        const fileName = `${slug}-${Date.now()}.${extension}`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        console.log(`[UPLOAD] Starting upload of ${image.name} (${image.size} bytes)`);
        console.log(`[UPLOAD] Destination: ${filePath}`);

        // Ensure directory exists
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        console.log(`[UPLOAD] Directory verified: ${UPLOAD_DIR}`);

        // Convert and write
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(new Uint8Array(arrayBuffer));
        await fs.writeFile(filePath, buffer);
        console.log(`[UPLOAD] File written successfully.`);

        // Double check existence
        const stats = await fs.stat(filePath);
        console.log(`[UPLOAD] Verified on disk: ${stats.size} bytes`);

        return `/uploads/recipes/${fileName}`;
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

        const filePath = path.join(process.cwd(), 'content/recipes', `${slug}.mdx`);
        await fs.writeFile(filePath, mdxContent, 'utf8');

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
        const filePath = path.join(process.cwd(), 'content/recipes', `${slug}.mdx`);

        // Delete the recipes file
        await fs.unlink(filePath);

        // Optional: We could also delete associated images if we tracked them better,
        // but for now let's just clean the MDX.

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Delete Recipe Failure:', error);
        return { success: false, error: 'Failed to delete recipe.' };
    }
}

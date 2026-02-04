"use client";

import { useState } from 'react';
import { saveRecipe } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types/recipe';
import { Camera, X } from 'lucide-react';

interface RecipeFormProps {
    recipe?: Recipe;
}

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const PROTEIN_SOURCES = ['Chicken', 'Beef', 'Tofu', 'Salmon', 'Pork', 'Turkey', 'Beans'];

export default function RecipeForm({ recipe }: RecipeFormProps) {
    const [isPending, setIsPending] = useState(false);
    const [showCustomProtein, setShowCustomProtein] = useState(
        recipe ? !PROTEIN_SOURCES.includes(recipe.protein_source) : false
    );
    const [error, setError] = useState<string | null>(null);
    const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>(recipe?.meal_types || []);
    const [imagePreview, setImagePreview] = useState<string | null>(recipe?.image_url || null);
    const router = useRouter();

    // Parse content to separate ingredients and instructions if editing
    const initialIngredients = recipe?.content.split('## Instructions')[0].replace('## Ingredients', '').trim() || '';
    const initialInstructions = recipe?.content.split('## Instructions')[1]?.trim() || '';

    async function formAction(formData: FormData) {
        console.log('[CLIENT] Form action started');
        setIsPending(true);
        setError(null);

        // Add multiselect meal types to formData
        formData.delete('meal_types');
        selectedMealTypes.forEach(type => formData.append('meal_types', type));

        try {
            console.log('[CLIENT] Calling saveRecipe server action...');
            const result = await saveRecipe(formData, recipe?.slug);
            console.log('[CLIENT] saveRecipe result:', result);

            if (result.success) {
                router.push(`/recipes/${result.slug}`);
                router.refresh();
            } else {
                setError(result.error || 'Failed to save recipe.');
                setIsPending(false);
            }
        } catch (err) {
            console.error('[CLIENT] Network/Server Error:', err);
            setError('A network error occurred. Please try again.');
            setIsPending(false);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleMealType = (type: string) => {
        setSelectedMealTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    return (
        <form action={formAction} className="space-y-16 max-w-3xl mx-auto py-12">
            {error && (
                <div className="p-4 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100 font-light italic">
                    {error}
                </div>
            )}

            {/* Hidden Fields for Edit Mode */}
            {recipe && <input type="hidden" name="date" value={recipe.date} />}
            <input type="hidden" name="existing_image_url" value={recipe?.image_url || ''} />

            <div className="space-y-12">
                {/* Image Upload */}
                <section className="space-y-4">
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block mb-4">Recipe Image</label>
                    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group">
                        {imagePreview && (
                            <div className="absolute inset-0 z-10">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setImagePreview(null); }}
                                    className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors">
                            <Camera size={32} className="text-zinc-300 dark:text-zinc-700 mb-2" />
                            <span className="text-xs text-zinc-400">Click to upload image</span>
                            <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                </section>

                {/* Title */}
                <section className="space-y-4">
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Title</label>
                    <input
                        name="title"
                        required
                        defaultValue={recipe?.title}
                        placeholder="Name of your creation..."
                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-4 focus:border-zinc-900 dark:focus:border-zinc-100 text-3xl font-serif italic outline-none transition-colors"
                    />
                </section>

                {/* Categories & Protein */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Protein Source</label>
                        <div className="space-y-4">
                            <select
                                name="protein_source_select"
                                required
                                defaultValue={recipe ? (PROTEIN_SOURCES.includes(recipe.protein_source) ? recipe.protein_source : 'other') : ''}
                                onChange={(e) => setShowCustomProtein(e.target.value === 'other')}
                                className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 focus:border-zinc-900 dark:focus:border-zinc-100 text-sm outline-none appearance-none transition-colors cursor-pointer"
                            >
                                <option value="" disabled>Select protein...</option>
                                {PROTEIN_SOURCES.map(src => (
                                    <option key={src} value={src}>{src}</option>
                                ))}
                                <option value="other">Other...</option>
                            </select>

                            {showCustomProtein && (
                                <input
                                    name="protein_source_custom"
                                    required
                                    defaultValue={!PROTEIN_SOURCES.includes(recipe?.protein_source || '') ? recipe?.protein_source : ''}
                                    placeholder="E.g. Shrimp, Lentils..."
                                    className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 focus:border-zinc-900 dark:focus:border-zinc-100 text-sm outline-none transition-colors"
                                />
                            )}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Meal Types</label>
                        <div className="flex flex-wrap gap-2">
                            {MEAL_TYPES.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => toggleMealType(type)}
                                    className={`text-[10px] px-3 py-1.5 rounded-full border transition-all uppercase tracking-widest ${selectedMealTypes.includes(type) ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900' : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Nutritional Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Calories</label>
                        <input name="calories" type="number" defaultValue={recipe?.calories} placeholder="0" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 text-sm outline-none" />
                    </section>
                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Protein (g)</label>
                        <input name="protein_grams" type="number" defaultValue={recipe?.protein_grams} placeholder="0" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 text-sm outline-none" />
                    </section>
                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Time (min)</label>
                        <input name="time_minutes" type="number" defaultValue={recipe?.time_minutes} placeholder="0" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 text-sm outline-none" />
                    </section>
                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Servings</label>
                        <input name="servings" type="number" defaultValue={recipe?.servings} placeholder="1" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 text-sm outline-none" />
                    </section>
                </div>

                {/* Content Sections */}
                <div className="space-y-12">
                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Ingredients</label>
                        <textarea
                            name="ingredients"
                            required
                            rows={6}
                            defaultValue={initialIngredients}
                            placeholder="- 2 cups...&#10;- 1 tbsp..."
                            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 focus:border-zinc-300 dark:focus:border-zinc-700 text-sm font-light outline-none transition-all"
                        />
                    </section>

                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Instructions</label>
                        <textarea
                            name="instructions"
                            required
                            rows={8}
                            defaultValue={initialInstructions}
                            placeholder="1. Preheat...&#10;2. Mix..."
                            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 focus:border-zinc-300 dark:focus:border-zinc-700 text-sm font-light outline-none transition-all"
                        />
                    </section>

                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Additional Tags (comma separated)</label>
                        <input
                            name="tags"
                            defaultValue={recipe?.tags.join(', ')}
                            placeholder="keto, spicy, quick..."
                            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 text-sm outline-none"
                        />
                    </section>
                </div>
            </div>

            <div className="pt-12">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-sm font-medium hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : (recipe ? 'Update Recipe' : 'Publish Recipe')}
                </button>
            </div>
        </form>
    );
}

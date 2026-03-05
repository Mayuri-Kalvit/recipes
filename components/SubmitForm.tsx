"use client";

import { useState } from 'react';
import { Camera, Send, CheckCircle2 } from 'lucide-react';
import { submitRecipe } from '@/app/actions';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const PROTEIN_SOURCES = ['Chicken', 'Beef', 'Tofu', 'Salmon', 'Pork', 'Turkey', 'Beans'];

export default function SubmitForm() {
    const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
    const [showCustomProtein, setShowCustomProtein] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [authorNote, setAuthorNote] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        // Add multiselect meal types to formData
        formData.delete('meal_types');
        selectedMealTypes.forEach(type => formData.append('meal_types', type));

        try {
            const result = await submitRecipe(formData);
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.error || 'Failed to submit recipe.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsPending(false);
        }
    }

    const toggleMealType = (type: string) => {
        setSelectedMealTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    if (success) {
        return (
            <div className="py-20 text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle2 size={64} className="text-zinc-900 dark:text-zinc-100 animate-in zoom-in duration-500" />
                </div>
                <h2 className="text-3xl font-serif italic text-zinc-900 dark:text-zinc-100">Thank you!</h2>
                <p className="text-zinc-500 font-light max-w-sm mx-auto">
                    Your recipe has been submitted for review. If it fits the collection, I'll publish it soon.
                </p>
                <div className="pt-8">
                    <button
                        type="button"
                        onClick={() => setSuccess(false)}
                        className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                        Submit another recipe
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-16 max-w-3xl mx-auto py-12">
            <div className="space-y-12">
                {/* Photo Upload */}
                <section className="space-y-4">
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Recipe Photo</label>
                    <div className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center overflow-hidden group hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors">
                        <input name="image" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageChange} />

                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white text-[10px] uppercase tracking-widest font-medium">
                                        Change Photo
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-4 pointer-events-none">
                                <div className="p-4 rounded-full bg-white dark:bg-zinc-800 shadow-sm">
                                    <Camera size={24} className="text-zinc-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-light text-zinc-500">Click to upload your dish</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Title */}
                <section className="space-y-4">
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Recipe Title</label>
                    <input
                        name="title"
                        required
                        placeholder="Name of your favorite dish..."
                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-4 focus:border-zinc-900 dark:focus:border-zinc-100 text-3xl font-serif italic outline-none transition-colors"
                    />
                </section>

                {/* Author Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Your Name</label>
                        <input
                            name="author"
                            required
                            placeholder="How should you be credited?"
                            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 focus:border-zinc-900 dark:focus:border-zinc-100 text-sm outline-none transition-colors"
                        />
                    </section>

                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Personal Note</label>
                            <span className="text-[10px] text-zinc-300">{authorNote.length}/100</span>
                        </div>
                        <input
                            name="author_note"
                            required
                            maxLength={100}
                            value={authorNote}
                            onChange={(e) => setAuthorNote(e.target.value)}
                            placeholder="What do you love about this dish?"
                            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 focus:border-zinc-900 dark:focus:border-zinc-100 text-sm outline-none transition-colors"
                        />
                    </section>
                </div>

                {/* Categories & Protein */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Protein Source</label>
                        <div className="space-y-4">
                            <select
                                name="protein_source_select"
                                required
                                onChange={(e) => setShowCustomProtein(e.target.value === 'other')}
                                className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 focus:border-zinc-900 dark:focus:border-zinc-100 text-sm outline-none appearance-none transition-colors cursor-pointer"
                            >
                                <option value="" disabled selected>Select protein...</option>
                                {PROTEIN_SOURCES.map(src => (
                                    <option key={src} value={src}>{src}</option>
                                ))}
                                <option value="other">Other...</option>
                            </select>

                            {showCustomProtein && (
                                <input
                                    name="protein_source_custom"
                                    required
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

                {/* Stats */}
                <div className="grid grid-cols-2 gap-8">
                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Calories (Approx)</label>
                        <input name="calories" type="number" placeholder="450" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 text-sm outline-none" />
                    </section>
                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Protein Grams</label>
                        <input name="protein_grams" type="number" placeholder="30" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 text-sm outline-none" />
                    </section>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    <section className="space-y-4">
                        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 block">Ingredients</label>
                        <textarea
                            name="ingredients"
                            required
                            rows={6}
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
                            placeholder="1. Preheat...&#10;2. Mix..."
                            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 focus:border-zinc-300 dark:focus:border-zinc-700 text-sm font-light outline-none transition-all"
                        />
                    </section>
                </div>
            </div>

            <div className="pt-12 text-center space-y-6">
                {error && (
                    <p className="text-xs text-red-500 italic mb-4">{error}</p>
                )}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-sm font-medium hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Send size={16} />
                    {isPending ? 'Submitting...' : 'Submit for Review'}
                </button>
            </div>
        </form>
    );
}

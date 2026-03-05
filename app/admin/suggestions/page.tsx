import { getPendingSubmissions } from "@/lib/recipes";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Check, X, Clock, Flame, Dumbbell } from "lucide-react";
import { approveSubmission, rejectSubmission } from "@/app/actions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function SuggestionsPage() {
    if (!await isAdmin()) {
        redirect('/admin');
    }

    const submissions = await getPendingSubmissions();

    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            <div className="mb-16 text-center">
                <h1 className="text-4xl font-light text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">Recipe Suggestions</h1>
                <p className="text-zinc-500 font-light flex items-center justify-center gap-2 italic font-serif">
                    Review and curate community contributions
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold rounded-full not-italic">
                        {submissions.length}
                    </span>
                </p>
            </div>

            {submissions.length === 0 ? (
                <div className="py-32 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-3xl">
                    <p className="text-zinc-400 font-light italic">No pending submissions at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-12">
                    {submissions.map((recipe: any) => (
                        <div key={recipe.path} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-8 sm:p-12">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                    <div className="flex-1 space-y-6">
                                        <div className="space-y-2 text-center md:text-left">
                                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">{recipe.protein_source}</span>
                                                {recipe.meal_types?.map((type: string) => (
                                                    <span key={type} className="text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 border border-zinc-100 dark:border-zinc-800 rounded text-zinc-500 italic">{type}</span>
                                                ))}
                                            </div>
                                            <h2 className="text-3xl font-serif italic text-zinc-900 dark:text-zinc-100 leading-tight">
                                                {recipe.title}
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-zinc-50 dark:border-zinc-900">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Cals</p>
                                                <p className="text-zinc-900 dark:text-zinc-100 font-light">{recipe.calories}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Protein</p>
                                                <p className="text-zinc-900 dark:text-zinc-100 font-light">{recipe.protein_grams}g</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Time</p>
                                                <p className="text-zinc-900 dark:text-zinc-100 font-light">—</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Author</p>
                                                <p className="text-zinc-900 dark:text-zinc-100 font-light">Community</p>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-[10px] uppercase tracking-widest text-zinc-400 mb-3">Ingredients</h3>
                                                <div className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed whitespace-pre-wrap">
                                                    {recipe.content.split('## Instructions')[0].replace('## Ingredients', '').trim()}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-[10px] uppercase tracking-widest text-zinc-400 mb-3">Instructions</h3>
                                                <div className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed whitespace-pre-wrap italic">
                                                    {recipe.content.split('## Instructions')[1]?.trim() || 'No instructions provided.'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto flex flex-row md:flex-col gap-3 pt-4 border-t md:border-t-0 md:border-l border-zinc-50 dark:border-zinc-900 md:pl-8">
                                        <form action={approveSubmission.bind(null, recipe.path, recipe)} className="flex-1 md:w-32">
                                            <button className="w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-[10px] font-medium uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-sm">
                                                <Check size={14} /> Approve
                                            </button>
                                        </form>
                                        <form action={rejectSubmission.bind(null, recipe.path)} className="flex-1 md:w-32">
                                            <button className="w-full py-3 border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-full text-[10px] font-medium uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2">
                                                <X size={14} /> Reject
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

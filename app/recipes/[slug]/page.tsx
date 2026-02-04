import { getRecipeBySlug, getAllRecipes } from "@/lib/recipes";
import { notFound, redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Clock, Flame, Dumbbell, Users, ChevronLeft, Trash2, Edit3 } from "lucide-react";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import { isAdmin } from "@/lib/auth";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const recipes = await getAllRecipes();
    return recipes.map((recipe) => ({
        slug: recipe.slug,
    }));
}

export default async function RecipePage({ params }: PageProps) {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);
    const isUserAdmin = await isAdmin();

    if (!recipe) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm uppercase tracking-widest">Back</span>
                </Link>

                {isUserAdmin && (
                    <div className="flex items-center gap-6">
                        <Link
                            href={`/recipes/${slug}/edit`}
                            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        >
                            <Edit3 size={14} />
                            Edit
                        </Link>
                        <DeleteButton slug={slug} />
                    </div>
                )}
            </div>

            <div className="space-y-12 mb-20">
                {recipe.image_url && (
                    <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
                        <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="max-w-2xl mx-auto space-y-10">
                    <div className="text-center space-y-4">
                        <div className="flex flex-wrap justify-center gap-3">
                            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">{recipe.protein_source}</span>
                            {recipe.meal_types?.map(type => (
                                <span key={type} className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100 px-2 border border-zinc-200 dark:border-zinc-800 rounded-sm italic">{type}</span>
                            ))}
                        </div>

                        <h1 className="text-5xl font-serif italic text-zinc-900 dark:text-zinc-100 leading-tight">
                            {recipe.title}
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-zinc-100 dark:border-zinc-900">
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Calories</p>
                            <p className="text-lg font-light text-zinc-900 dark:text-zinc-100">{recipe.calories}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Protein</p>
                            <p className="text-lg font-light text-zinc-900 dark:text-zinc-100">{recipe.protein_grams}g</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Time</p>
                            <p className="text-lg font-light text-zinc-900 dark:text-zinc-100">{recipe.time_minutes}m</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Servings</p>
                            <p className="text-lg font-light text-zinc-900 dark:text-zinc-100">{recipe.servings}</p>
                        </div>
                    </div>

                    <div className="prose prose-zinc dark:prose-invert max-w-none prose-h2:font-serif prose-h2:italic prose-h2:font-medium prose-h2:text-2xl prose-h2:placeholder-zinc-900 dark:prose-h2:text-zinc-100 prose-p:font-light prose-li:font-light">
                        <MDXRemote source={recipe.content} />
                    </div>

                    {recipe.tags.length > 0 && (
                        <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-wrap gap-2">
                            {recipe.tags.map(tag => (
                                <span key={tag} className="text-[10px] uppercase tracking-widest text-zinc-400">#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

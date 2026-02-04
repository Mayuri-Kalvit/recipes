import Link from 'next/link';
import { Clock, Flame, Dumbbell, Tag } from 'lucide-react';
import { RecipeFrontmatter } from '@/types/recipe';

interface RecipeCardProps {
    recipe: RecipeFrontmatter;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <Link
            href={`/recipes/${recipe.slug}`}
            className="group block transition-all"
        >
            <div className="mb-4 aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden relative border border-zinc-100 dark:border-zinc-900">
                {recipe.image_url ? (
                    <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-800 font-bold text-4xl uppercase tracking-widest italic opacity-20">
                        {recipe.protein_source}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                    <span>{recipe.protein_source} • {recipe.time_minutes} min</span>
                    <span>{recipe.calories} cals</span>
                </div>
                <h3 className="text-xl font-serif font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-800">
                    {recipe.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light italic">
                    {recipe.protein_grams}g protein
                </p>
            </div>
        </Link>
    );
}

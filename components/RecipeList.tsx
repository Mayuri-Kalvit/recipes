"use client";

import { useState, useMemo } from 'react';
import { RecipeFrontmatter } from '@/types/recipe';
import RecipeCard from '@/components/RecipeCard';
import FilterBar from '@/components/FilterBar';
import { ChefHat } from 'lucide-react';

interface RecipeListProps {
    initialRecipes: RecipeFrontmatter[];
    proteinSources: string[];
}

export default function RecipeList({ initialRecipes, proteinSources }: RecipeListProps) {
    const [search, setSearch] = useState('');
    const [protein, setProtein] = useState('');
    const [minCals, setMinCals] = useState('');
    const [maxCals, setMaxCals] = useState('');
    const [mealTypes, setMealTypes] = useState<string[]>([]);
    const [sort, setSort] = useState('newest');

    const filteredRecipes = useMemo(() => {
        let result = initialRecipes.filter((recipe) => {
            const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
            const matchesProtein = protein === '' || recipe.protein_source === protein;
            const matchesMinCals = minCals === '' || recipe.calories >= parseInt(minCals);
            const matchesMaxCals = maxCals === '' || recipe.calories <= parseInt(maxCals);
            const matchesMealTypes = mealTypes.length === 0 || mealTypes.some(type => recipe.meal_types?.includes(type));

            return matchesSearch && matchesProtein && matchesMinCals && matchesMaxCals && matchesMealTypes;
        });

        result.sort((a, b) => {
            if (sort === 'calories-low') return a.calories - b.calories;
            if (sort === 'calories-high') return b.calories - a.calories;
            if (sort === 'newest') {
                return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
            }
            return 0;
        });

        return result;
    }, [initialRecipes, search, protein, minCals, maxCals, mealTypes, sort]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-16 gap-y-12">
            <aside className="lg:col-span-1">
                <FilterBar
                    search={search} setSearch={setSearch}
                    protein={protein} setProtein={setProtein}
                    minCals={minCals} setMinCals={setMinCals}
                    maxCals={maxCals} setMaxCals={setMaxCals}
                    sort={sort} setSort={setSort}
                    proteinSources={proteinSources}
                    mealTypes={mealTypes}
                    setMealTypes={setMealTypes}
                />
            </aside>

            <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div>
                            <h1 className="text-2xl font-light text-zinc-900 dark:text-zinc-100 mb-1">Cookbook</h1>
                            <p className="text-xs text-zinc-400 font-light tracking-wide uppercase">{filteredRecipes.length} Entries</p>
                        </div>          </div>
                </div>

                {filteredRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredRecipes.map((recipe) => (
                            <RecipeCard key={recipe.slug} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-zinc-100 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                        <ChefHat size={48} className="text-zinc-300 dark:text-zinc-700 mb-4" />
                        <p className="text-zinc-500 font-medium">No recipes match your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}

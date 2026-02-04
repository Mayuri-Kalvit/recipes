"use client";

import { Search, ChevronDown, Filter, X } from 'lucide-react';
import { ProteinSource } from '@/types/recipe';

interface FilterBarProps {
    search: string;
    setSearch: (val: string) => void;
    protein: string;
    setProtein: (val: string) => void;
    minCals: string;
    setMinCals: (val: string) => void;
    maxCals: string;
    setMaxCals: (val: string) => void;
    sort: string;
    setSort: (val: string) => void;
    proteinSources: string[];
    mealTypes: string[];
    setMealTypes: (val: string[]) => void;
}

export default function FilterBar({
    search, setSearch,
    protein, setProtein,
    minCals, setMinCals,
    maxCals, setMaxCals,
    sort, setSort,
    proteinSources,
    mealTypes,
    setMealTypes
}: FilterBarProps) {
    const clearFilters = () => {
        setSearch('');
        setProtein('');
        setMinCals('');
        setMaxCals('');
        setSort('newest');
        setMealTypes([]);
    };

    const toggleMealType = (type: string) => {
        setMealTypes(mealTypes.includes(type) ? mealTypes.filter(t => t !== type) : [...mealTypes, type]);
    };

    return (
        <div className="p-0 border-none bg-transparent sticky top-28 space-y-10">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
                    Filter
                </h2>
                <button
                    onClick={clearFilters}
                    className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors underline underline-offset-4"
                >
                    Reset
                </button>
            </div>

            <div className="space-y-8">
                {/* Search */}
                <div>
                    <input
                        type="text"
                        placeholder="Search title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 focus:border-zinc-900 dark:focus:border-zinc-100 text-sm placeholder:text-zinc-300 dark:placeholder:text-zinc-700 transition-colors outline-none"
                    />
                </div>

                {/* Protein Filter */}
                <div>
                    <label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 block mb-3">Protein</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setProtein('')}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${protein === '' ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900' : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}
                        >
                            All
                        </button>
                        {proteinSources.map((src) => (
                            <button
                                key={src}
                                onClick={() => setProtein(src)}
                                className={`text-[10px] px-3 py-1.5 rounded-full border transition-all uppercase tracking-widest ${protein === src ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900' : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'}`}
                            >
                                {src}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Meal Types */}
                <div>
                    <label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 block mb-3">Meal Types</label>
                    <div className="flex flex-wrap gap-2">
                        {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((type) => (
                            <button
                                key={type}
                                onClick={() => toggleMealType(type)}
                                className={`text-[10px] px-3 py-1.5 rounded-full border transition-all uppercase tracking-widest ${mealTypes.includes(type) ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900' : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calories Range */}
                <div>
                    <label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 block mb-3">Calories</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minCals}
                            onChange={(e) => setMinCals(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-1 text-sm focus:border-zinc-900 dark:focus:border-zinc-100 outline-none"
                        />
                        <span className="text-zinc-200 dark:text-zinc-800">—</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxCals}
                            onChange={(e) => setMaxCals(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-1 text-sm focus:border-zinc-900 dark:focus:border-zinc-100 outline-none"
                        />
                    </div>
                </div>

                {/* Sort */}
                <div>
                    <label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 block mb-3">Sort</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 text-sm focus:border-zinc-900 dark:focus:border-zinc-100 outline-none appearance-none cursor-pointer"
                    >
                        <option value="newest">Recent</option>
                        <option value="calories-low">Lowest Cal</option>
                        <option value="calories-high">Highest Cal</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

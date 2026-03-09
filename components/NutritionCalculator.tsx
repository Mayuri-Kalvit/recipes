"use client";

import { useState, useEffect } from 'react';
import { calculateNutrition } from '@/app/actions';
import { Activity, Dumbbell, Target, Info, Flame, Scale, ChevronRight } from 'lucide-react';

export default function NutritionCalculator() {
    const [results, setResults] = useState<any>(null);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('mayri_nutrition_results');
        if (saved) {
            setResults(JSON.parse(saved));
        }
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        const formData = new FormData(e.currentTarget);
        const res = await calculateNutrition(formData);
        if (res.success) {
            setResults(res.results);
            localStorage.setItem('mayri_nutrition_results', JSON.stringify(res.results));
        }
        setIsPending(false);
    }

    return (
        <div className="space-y-16">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 bg-white dark:bg-zinc-900/50 p-8 md:p-12 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                {/* Weight */}
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Weight (kg)</label>
                    <input
                        type="number"
                        name="weight"
                        required
                        placeholder="70"
                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-1 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-xl font-light"
                    />
                </div>

                {/* Height */}
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Height (cm)</label>
                    <input
                        type="number"
                        name="height"
                        required
                        placeholder="170"
                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-1 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-xl font-light"
                    />
                </div>

                {/* Age */}
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Age</label>
                    <input
                        type="number"
                        name="age"
                        required
                        placeholder="25"
                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-1 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-xl font-light"
                    />
                </div>

                {/* Sex */}
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Sex</label>
                    <div className="flex gap-4">
                        <label className="flex-1 cursor-pointer">
                            <input type="radio" name="sex" value="female" defaultChecked className="hidden peer" />
                            <div className="py-3 text-center rounded-xl border border-zinc-100 dark:border-zinc-800 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all text-xs uppercase tracking-widest font-medium">Female</div>
                        </label>
                        <label className="flex-1 cursor-pointer">
                            <input type="radio" name="sex" value="male" className="hidden peer" />
                            <div className="py-3 text-center rounded-xl border border-zinc-100 dark:border-zinc-800 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all text-xs uppercase tracking-widest font-medium">Male</div>
                        </label>
                    </div>
                </div>

                {/* Activity Level */}
                <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Weekly Activity Level</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { id: 'sedentary', label: 'Sedentary', desc: 'Office job, little exercise' },
                            { id: 'light', label: 'Light', desc: '1-3 days exercise' },
                            { id: 'moderate', label: 'Moderate', desc: '4-5 days exercise' },
                            { id: 'very-active', label: 'Very Active', desc: '6-7 days exercise' }
                        ].map((level) => (
                            <label key={level.id} className="cursor-pointer group">
                                <input type="radio" name="activityLevel" value={level.id} defaultChecked={level.id === 'sedentary'} className="hidden peer" />
                                <div className="h-full p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 peer-checked:border-zinc-900 dark:peer-checked:border-zinc-100 peer-checked:bg-zinc-50 dark:peer-checked:bg-zinc-900 flex flex-col items-center text-center transition-all">
                                    <span className="text-[10px] uppercase tracking-widest font-bold mb-1 opacity-50 group-hover:opacity-100 transition-opacity">{level.label}</span>
                                    <span className="text-[8px] text-zinc-400 leading-tight">{level.desc}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Strength Training */}
                <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Strength Training</label>
                    <div className="flex gap-4">
                        <label className="flex-1 cursor-pointer">
                            <input type="radio" name="strengthTraining" value="false" defaultChecked className="hidden peer" />
                            <div className="py-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all flex flex-col items-center">
                                <span className="text-xs uppercase tracking-widest font-medium">No</span>
                            </div>
                        </label>
                        <label className="flex-1 cursor-pointer">
                            <input type="radio" name="strengthTraining" value="true" className="hidden peer" />
                            <div className="py-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all flex flex-col items-center">
                                <span className="text-xs uppercase tracking-widest font-medium">Yes</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="md:col-span-2 pt-6">
                    <button
                        disabled={isPending}
                        className="w-full py-6 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isPending ? 'Calculating...' : 'Generate My Nutrition Plan'}
                    </button>
                </div>
            </form>

            {/* Results Display */}
            {results && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-serif italic mb-2">Your Results</h2>
                        <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800 mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Daily Protein */}
                        <div className="p-10 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 text-center shadow-sm">
                            <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
                                <Dumbbell size={20} />
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-medium">Daily Protein</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-5xl font-serif italic">{results.protein_target_g}</span>
                                <span className="text-xs text-zinc-400 uppercase tracking-widest">g</span>
                            </div>
                            <p className="mt-4 text-[9px] text-zinc-400 font-light leading-relaxed uppercase tracking-widest">Target for muscle retention & satiety</p>
                        </div>

                        {/* BMR */}
                        <div className="p-10 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 text-center shadow-sm">
                            <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
                                <Scale size={20} />
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-medium">Base Metabolism</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-5xl font-serif italic">{results.bmr}</span>
                                <span className="text-xs text-zinc-400 uppercase tracking-widest">kcal</span>
                            </div>
                            <p className="mt-4 text-[9px] text-zinc-400 font-light leading-relaxed uppercase tracking-widest">Calories burned at complete rest</p>
                        </div>

                        {/* TDEE */}
                        <div className="p-10 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 text-center shadow-sm">
                            <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
                                <Flame size={20} />
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-medium">Daily Expenditure</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-5xl font-serif italic">{results.tdee}</span>
                                <span className="text-xs text-zinc-400 uppercase tracking-widest">kcal</span>
                            </div>
                            <p className="mt-4 text-[9px] text-zinc-400 font-light leading-relaxed uppercase tracking-widest">Total daily calorie burn</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Fat Loss', value: results.fat_loss_calories, icon: <ChevronRight size={14} /> },
                                { label: 'Maintenance', value: results.maintenance_calories, icon: <ChevronRight size={14} /> },
                                { label: 'Muscle Gain', value: results.muscle_gain_calories, icon: <ChevronRight size={14} /> }
                            ].map((target) => (
                                <div key={target.label} className="group p-8 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{target.label}</span>
                                        <span className="text-zinc-200 dark:text-zinc-800">{target.icon}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-serif italic text-zinc-900 dark:text-zinc-100">{target.value}</span>
                                        <span className="text-[8px] text-zinc-400 uppercase tracking-widest">kcal/day</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-zinc-950 dark:bg-white rounded-3xl text-zinc-100 dark:text-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-transparent dark:from-zinc-100 dark:to-transparent opacity-20" />
                        <div className="relative z-10">
                            <h3 className="text-lg font-serif italic">Ready to cook?</h3>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-light opacity-60">Filtered results await in your recipe vault</p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="relative z-10 px-8 py-3 bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-all shadow-xl"
                        >
                            Explore Recipes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

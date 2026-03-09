"use client";

import { useState, useEffect } from 'react';
import { calculateNutrition } from '@/app/actions';
import { Activity, Dumbbell, Target, Info, Flame, Scale, ChevronRight, Calculator, ShieldCheck } from 'lucide-react';

export default function NutritionCalculator() {
    const [results, setResults] = useState<any>(null);
    const [isPending, setIsPending] = useState(false);
    const [goal, setGoal] = useState<'maintain' | 'lose_fat' | 'gain'>('maintain');

    useEffect(() => {
        const saved = localStorage.getItem('mayri_nutrition_results_advanced');
        if (saved) {
            const parsed = JSON.parse(saved);
            setResults(parsed);
            if (parsed.goal) setGoal(parsed.goal);
        }
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        const formData = new FormData(e.currentTarget);
        const res = await calculateNutrition(formData);
        if (res.success) {
            const resultsWithGoal = { ...res.results, goal: formData.get('goal') };
            setResults(resultsWithGoal);
            localStorage.setItem('mayri_nutrition_results_advanced', JSON.stringify(resultsWithGoal));
        }
        setIsPending(false);
    }

    return (
        <div className="space-y-16">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900/50 p-8 md:p-12 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                    {/* Weight */}
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            required
                            step="0.1"
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
                                <div className="py-3 text-center rounded-xl border border-zinc-100 dark:border-zinc-800 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all text-[10px] uppercase tracking-widest font-medium">Female</div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                                <input type="radio" name="sex" value="male" className="hidden peer" />
                                <div className="py-3 text-center rounded-xl border border-zinc-100 dark:border-zinc-800 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all text-[10px] uppercase tracking-widest font-medium">Male</div>
                            </label>
                        </div>
                    </div>

                    {/* Body Fat (Optional) */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">
                            Body Fat % <span className="text-[8px] opacity-60">(Optional)</span>
                        </label>
                        <input
                            type="number"
                            name="bodyFat"
                            step="0.1"
                            placeholder="Optional"
                            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-1 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-xl font-light"
                        />
                        <p className="text-[8px] text-zinc-400 font-light italic">Enables Katch-McArdle formula for lean mass precision.</p>
                    </div>

                    {/* Activity Level */}
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Activity Level</label>
                        <select
                            name="activityLevel"
                            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-1 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm font-light appearance-none cursor-pointer"
                        >
                            <option value="sedentary">Sedentary (Office job, little exercise)</option>
                            <option value="light">Light (1-3 days exercise)</option>
                            <option value="moderate">Moderate (4-5 days exercise)</option>
                            <option value="very-active">Very Active (6-7 days exercise)</option>
                            <option value="extra-active">Extra Active (Physical job + training)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 border-t border-zinc-50 dark:border-zinc-900">
                    {/* Goal Section */}
                    <div className="space-y-6">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Primary Goal</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'lose_fat', label: 'Lose Fat' },
                                { id: 'maintain', label: 'Maintain' },
                                { id: 'gain', label: 'Muscle Gain' }
                            ].map((g) => (
                                <label key={g.id} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="goal"
                                        value={g.id}
                                        checked={goal === g.id}
                                        onChange={() => setGoal(g.id as any)}
                                        className="hidden peer"
                                    />
                                    <div className="py-4 text-center rounded-2xl border border-zinc-100 dark:border-zinc-800 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all text-[10px] uppercase tracking-widest font-medium">
                                        {g.label}
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Deficit / Surplus Options */}
                        {goal === 'lose_fat' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold block mb-2">Select Deficit Intensity</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { id: '10', label: '10%' },
                                        { id: '15', label: '15%' },
                                        { id: '20', label: '20%' },
                                        { id: '500', label: '500 kcal' }
                                    ].map((d) => (
                                        <label key={d.id} className="cursor-pointer">
                                            <input type="radio" name="deficitType" value={d.id} defaultChecked={d.id === '15'} className="hidden peer" />
                                            <div className="py-2 text-[9px] text-center rounded-lg border border-zinc-200 dark:border-zinc-700 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all font-bold">
                                                {d.label}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {goal === 'gain' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold block mb-2">Select Surplus Intensity</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: '5', label: 'Lean (5%)' },
                                        { id: '10', label: 'Standard (10%)' },
                                        { id: '15', label: 'Aggressive (15%)' }
                                    ].map((s) => (
                                        <label key={s.id} className="cursor-pointer">
                                            <input type="radio" name="surplusType" value={s.id} defaultChecked={s.id === '10'} className="hidden peer" />
                                            <div className="py-2 text-[9px] text-center rounded-lg border border-zinc-200 dark:border-zinc-700 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all font-bold">
                                                {s.label}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Training Section */}
                    <div className="space-y-6">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Training Habits</label>
                        <div className="p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-xs uppercase tracking-widest font-bold">Strength Training</h4>
                                    <p className="text-[9px] text-zinc-400 font-light leading-relaxed">Regular resistance or weight lifting</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="strengthTraining" value="true" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-zinc-100 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        disabled={isPending}
                        className="w-full py-6 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-zinc-200 dark:shadow-none"
                    >
                        {isPending ? 'Optimizing Plan...' : 'Generate New Nutrition Targets'}
                    </button>
                </div>
            </form>

            {/* Results Display */}
            {results && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12 pb-20">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400">Personal Evaluation</p>
                        <h2 className="text-4xl font-serif italic">Your Nutrition Roadmap</h2>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-100 dark:border-zinc-800">
                            <ShieldCheck size={12} className="text-emerald-500" />
                            <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-500">Method: {results.formula_method}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Main Target Calories */}
                        <div className="p-12 bg-zinc-950 dark:bg-white rounded-[3rem] text-white dark:text-zinc-950 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-transparent dark:from-zinc-200 dark:to-transparent opacity-20" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-10 h-10 border border-white/20 dark:border-black/10 rounded-full flex items-center justify-center">
                                        <Target size={18} />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">Daily Calorie Target</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl font-serif italic tracking-tighter">{results.goal_calories}</span>
                                    <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-40">kcal</span>
                                </div>
                                <div className="mt-12 h-px bg-white/10 dark:bg-black/5" />
                                <div className="mt-8 flex justify-between items-center">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Maintenance Level</p>
                                        <p className="text-lg font-serif italic">{results.maintenance_calories} <span className="text-[10px] font-sans font-normal opacity-50 ml-1">kcal</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">BMR</p>
                                        <p className="text-lg font-serif italic">{results.bmr} <span className="text-[10px] font-sans font-normal opacity-50 ml-1">kcal</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Protein Targets */}
                        <div className="p-12 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-950 rounded-full flex items-center justify-center text-zinc-400">
                                    <Dumbbell size={18} />
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Protein Optimization</span>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mb-4">Daily Range</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-serif italic text-zinc-900 dark:text-zinc-100 tracking-tighter">{results.protein_range_g}</span>
                                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400">grams</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900">
                                    <div className="flex items-start gap-4">
                                        <Info size={14} className="text-zinc-400 mt-1 flex-shrink-0" />
                                        <p className="text-[11px] leading-relaxed text-zinc-500 font-light italic">
                                            {results.explanation_notes}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-zinc-50 dark:bg-zinc-900/30 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-2">
                            <h4 className="text-lg font-serif italic">Consistency First.</h4>
                            <p className="text-[11px] text-zinc-500 font-light leading-relaxed">
                                While these numbers are mathematically precise, the best diet is the one you can sustain. These targets are designed to optimize your {results.goal?.replace('_', ' ')} goals while protecting your metabolic health.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-10 py-4 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-all shadow-xl"
                            >
                                Shop Recipes for {results.goal_calories} kcal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

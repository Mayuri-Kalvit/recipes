"use client";

import { useState, useEffect } from 'react';
import { calculateNutrition } from '@/app/actions';
import {
    Activity, Dumbbell, Target, Info, Flame, Scale, ChevronRight,
    Calculator, ShieldCheck, ArrowRight, CheckCircle2, ListChecks,
    Sparkles, UtensilsCrossed
} from 'lucide-react';

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

    const getRecommendation = () => {
        if (!results) return null;
        if (results.goal === 'lose_fat') {
            return "Focus on 'Volume Eating'—high-protein, high-fiber meals that keep you full while staying under your target. Prioritize your protein range first to protect your muscles while losing fat.";
        } else if (results.goal === 'gain') {
            return "Consistency is key for muscle synthesis. Use your surplus to fuel heavy lifting sessions. If you find you're gaining weight too fast, drop to a 'Standard' 10% surplus.";
        }
        return "You're in the 'Sweet Spot'. Use this phase to explore new recipes and establish a sustainable eating rhythm that you can maintain long-term.";
    };

    return (
        <div className="space-y-24">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900/50 p-8 md:p-12 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Weight (kg)</label>
                        <input type="number" name="weight" required step="0.1" placeholder="70" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-1 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-xl font-light" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Height (cm)</label>
                        <input type="number" name="height" required placeholder="170" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-1 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-xl font-light" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Age</label>
                        <input type="number" name="age" required placeholder="25" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-1 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-xl font-light" />
                    </div>
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
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">
                            Body Fat % <span className="text-[8px] opacity-60">(Optional)</span>
                        </label>
                        <input type="number" name="bodyFat" step="0.1" placeholder="Optional" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-1 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-xl font-light" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Activity Level</label>
                        <select name="activityLevel" className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-1 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm font-light appearance-none cursor-pointer">
                            <option value="sedentary">Sedentary (Office job, little exercise)</option>
                            <option value="light">Light (1-3 days exercise)</option>
                            <option value="moderate">Moderate (4-5 days exercise)</option>
                            <option value="very-active">Very Active (6-7 days exercise)</option>
                            <option value="extra-active">Extra Active (Physical job + training)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-zinc-50 dark:border-zinc-900">
                    <div className="space-y-6">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Primary Goal</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['lose_fat', 'maintain', 'gain'].map((g) => (
                                <label key={g} className="cursor-pointer">
                                    <input type="radio" name="goal" value={g} checked={goal === g} onChange={() => setGoal(g as any)} className="hidden peer" />
                                    <div className="py-4 text-center rounded-2xl border border-zinc-100 dark:border-zinc-800 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all text-[10px] uppercase tracking-widest font-medium">
                                        {g.replace('_', ' ')}
                                    </div>
                                </label>
                            ))}
                        </div>
                        {goal === 'lose_fat' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold block mb-2">Deficit Intensity</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['10', '15', '20', '500'].map((d) => (
                                        <label key={d} className="cursor-pointer">
                                            <input type="radio" name="deficitType" value={d} defaultChecked={d === '15'} className="hidden peer" />
                                            <div className="py-2 text-[9px] text-center rounded-lg border border-zinc-200 dark:border-zinc-700 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all font-bold">{d === '500' ? '500' : `${d}%`}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                        {goal === 'gain' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold block mb-2">Surplus Intensity</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[{ id: '5', l: 'Lean' }, { id: '10', l: 'Standard' }, { id: '15', l: 'Aggressive' }].map((s) => (
                                        <label key={s.id} className="cursor-pointer">
                                            <input type="radio" name="surplusType" value={s.id} defaultChecked={s.id === '10'} className="hidden peer" />
                                            <div className="py-2 text-[9px] text-center rounded-lg border border-zinc-200 dark:border-zinc-700 peer-checked:bg-zinc-900 peer-checked:text-white dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900 transition-all font-bold">{s.l}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-6">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium ml-1">Training Habits</label>
                        <div className="p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 h-[calc(100%-2rem)] flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="text-xs uppercase tracking-widest font-bold">Strength Training</h4>
                                <p className="text-[9px] text-zinc-400 font-light leading-relaxed">Required for muscle precision.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="strengthTraining" value="true" className="sr-only peer" />
                                <div className="w-11 h-6 bg-zinc-100 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <button disabled={isPending} className="w-full py-6 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-zinc-100 dark:shadow-none">
                        {isPending ? 'Optimizing roadmap...' : 'Generate My Personal Nutrition Plan'}
                    </button>
                </div>
            </form>

            {/* Results Section */}
            {results && (
                <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 space-y-24">
                    {/* Primary Highlight */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-100 dark:border-zinc-800 mb-4">
                            <ShieldCheck size={12} className="text-emerald-500" />
                            <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-500">Precision Analysis: {results.formula_method}</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif italic text-zinc-900 dark:text-zinc-100">Your Daily Targets</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Calories Card */}
                        <div className="p-12 md:p-16 bg-zinc-950 dark:bg-white rounded-[4rem] text-white dark:text-zinc-950 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-transparent dark:from-zinc-200 dark:to-transparent opacity-30" />
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Target Calories</p>
                                    <h3 className="text-xl font-serif italic mb-8">Fuel for {results.goal?.replace('_', ' ')}</h3>
                                </div>
                                <div className="flex items-baseline gap-4 mb-12">
                                    <span className="text-8xl md:text-9xl font-serif italic tracking-tighter leading-none">{results.goal_calories}</span>
                                    <span className="text-base uppercase tracking-widest opacity-40 font-bold">kcal</span>
                                </div>
                                <div className="pt-8 border-t border-white/10 dark:border-black/5 flex items-center justify-between">
                                    <p className="text-[9px] uppercase tracking-[0.2em] font-light leading-relaxed max-w-[180px]">
                                        Calculated for {results.goal?.replace('_', ' ')} including safety floors.
                                    </p>
                                    <Target className="opacity-20" size={40} strokeWidth={1} />
                                </div>
                            </div>
                        </div>

                        {/* Protein & Recommendation Card */}
                        <div className="space-y-8">
                            <div className="p-12 md:p-16 bg-white dark:bg-zinc-900 rounded-[4rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mb-4">Protein Foundation</p>
                                <div className="flex items-baseline gap-4 mb-8">
                                    <span className="text-6xl md:text-7xl font-serif italic text-zinc-900 dark:text-zinc-100 tracking-tighter">{results.protein_range_g}</span>
                                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400">grams</span>
                                </div>
                                <div className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-900">
                                    <div className="flex items-start gap-4">
                                        <Info size={16} className="text-zinc-400 mt-1 flex-shrink-0" />
                                        <p className="text-sm leading-relaxed text-zinc-500 font-light italic">
                                            {results.explanation_notes}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                                <div className="flex items-center gap-3 mb-6">
                                    <Sparkles size={18} className="text-emerald-500" />
                                    <h4 className="text-xs uppercase tracking-[0.2em] font-bold">My Personal Tip</h4>
                                </div>
                                <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-light italic">
                                    "{getRecommendation()}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps Roadmap */}
                    <div className="space-y-12">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                                <ListChecks size={24} />
                            </div>
                            <h3 className="text-3xl font-serif italic">Your Roadmap To Success</h3>
                            <p className="text-zinc-400 text-sm font-light max-w-sm">Precision is the strategy, but consistency is the victory.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    step: '01',
                                    title: 'Prioritize Protein',
                                    desc: `Hit your ${results.protein_target_g}g daily goal first. It manages hunger and keeps your metabolism fire-hot.`,
                                    icon: <Dumbbell size={20} />
                                },
                                {
                                    step: '02',
                                    title: 'Budget Your Energy',
                                    desc: `Stay within your ${results.goal_calories} kcal budget. Think of it as a financial plan for your body.`,
                                    icon: <Flame size={20} />
                                },
                                {
                                    step: '03',
                                    title: 'Review & Refine',
                                    desc: 'Trust the process for 2–3 weeks. If weigh-ins don\'t move, adjust your activity or deficit by 5%.',
                                    icon: <Activity size={20} />
                                }
                            ].map((step) => (
                                <div key={step.step} className="p-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[3rem] shadow-sm group hover:border-zinc-900 dark:hover:border-zinc-100 transition-all">
                                    <span className="text-4xl font-serif italic text-zinc-100 dark:text-zinc-800 group-hover:text-zinc-200 dark:group-hover:text-zinc-700 transition-colors">{step.step}</span>
                                    <div className="w-10 h-10 mt-6 mb-6 rounded-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
                                        {step.icon}
                                    </div>
                                    <h4 className="text-base font-serif italic mb-3">{step.title}</h4>
                                    <p className="text-xs text-zinc-500 font-light leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metabolic Profile */}
                    <div className="p-12 md:p-20 bg-zinc-50 dark:bg-zinc-900/30 rounded-[4rem] border border-zinc-100 dark:border-zinc-800/50">
                        <div className="flex flex-col md:flex-row items-baseline justify-between gap-12 mb-16 border-b border-zinc-100 dark:border-zinc-800 pb-12">
                            <div className="space-y-2">
                                <h3 className="text-4xl font-serif italic">The Science.</h3>
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Metabolic Baseline Breakdown</p>
                            </div>
                            <div className="text-zinc-400 italic font-light text-sm max-w-sm">
                                "These numbers represent your body's energy requirements at rest and with activity. They are the engine under the hood."
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-4">Basal Metabolism (BMR)</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-serif italic text-zinc-900 dark:text-zinc-100">{results.bmr}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">kcal</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-4">Maintenance (TDEE)</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-serif italic text-zinc-900 dark:text-zinc-100">{results.maintenance_calories}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">kcal</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-4">Energy Offset</p>
                                <div className="flex items-baseline gap-2 text-emerald-500">
                                    <span className="text-4xl font-serif italic">{Math.abs(results.maintenance_calories - results.goal_calories)}</span>
                                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">kcal {results.goal === 'lose_fat' ? 'deficit' : results.goal === 'maintain' ? 'neutral' : 'surplus'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="p-12 md:p-20 bg-zinc-950 dark:bg-white rounded-[4rem] text-center text-white dark:text-zinc-950 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-transparent dark:from-zinc-200 dark:to-transparent opacity-20" />
                        <div className="relative z-10 space-y-10">
                            <UtensilsCrossed size={40} className="mx-auto text-zinc-500 opacity-60" />
                            <div className="space-y-4">
                                <h3 className="text-4xl md:text-5xl font-serif italic">Ready to cook?</h3>
                                <p className="text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto font-light leading-relaxed">
                                    Your targets are set. Now let's find the high-protein, energy-efficient meals that make this plan feel like a lifestyle, not a diet.
                                </p>
                            </div>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="inline-flex items-center gap-4 px-12 py-5 bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:scale-105 transition-all shadow-xl group/btn"
                            >
                                Browse My Recipe Vault <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

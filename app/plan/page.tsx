import Link from 'next/link';
import NutritionCalculator from '@/components/NutritionCalculator';

export default function PlanPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 sm:py-20 lg:px-8">
            <div className="max-w-2xl mb-20">
                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-6">Personalized Nutrition</p>
                <h1 className="text-5xl md:text-7xl font-serif italic text-zinc-900 dark:text-zinc-100 mb-10">Your Plan.</h1>
                <p className="text-xl font-light text-zinc-500 leading-relaxed italic border-l-4 border-zinc-100 dark:border-zinc-800 pl-8 py-4">
                    "Use this calculator to find your direct targets for fat loss, maintenance, or muscle gain. Precision is the key to consistency."
                </p>
            </div>

            <NutritionCalculator />

            <div className="mt-32 pt-12 border-t border-zinc-50 dark:border-zinc-900 text-center">
                <Link href="/" className="text-xs uppercase tracking-[0.3em] font-light text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    ← Back to Recipe Vault
                </Link>
            </div>
        </div>
    );
}

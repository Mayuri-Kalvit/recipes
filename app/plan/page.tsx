import Link from 'next/link';

export default function PlanPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-5xl font-serif italic text-zinc-900 dark:text-zinc-100 mb-12">Plan</h1>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-xl font-light text-zinc-500 leading-relaxed italic border-l-4 border-zinc-100 dark:border-zinc-800 pl-8 py-4">
                    "I will give the entire detailed description of the functionality here soon."
                </p>
                <div className="mt-12 p-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 text-center">
                    <p className="text-zinc-400 font-light italic">
                        Something exciting is being planned for your meal journeys.
                    </p>
                </div>
            </div>

            <div className="mt-24 pt-12 border-t border-zinc-50 dark:border-zinc-900">
                <Link href="/" className="text-sm uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    ← Back to Catalog
                </Link>
            </div>
        </div>
    );
}

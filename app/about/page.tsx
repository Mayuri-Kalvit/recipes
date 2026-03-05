import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-5xl font-serif italic text-zinc-900 dark:text-zinc-100 mb-12">About</h1>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-xl font-light text-zinc-500 leading-relaxed italic border-l-4 border-zinc-100 dark:border-zinc-800 pl-8 py-4">
                    "This section will soon contain the story and philosophy behind Mayri's Recipes."
                </p>
                <div className="mt-12 space-y-6 text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                    <p>
                        Mayri's Recipes is a curated collection of high-protein, minimal-ingredient meals designed for a balanced and healthy lifestyle.
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

import Link from 'next/link';
import EmailCollector from '@/components/EmailCollector';
import { ExternalLink, ArrowRight } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 sm:py-20 lg:px-8">
            {/* Header section */}
            <div className="text-center mb-20">
                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-6">The person behind the recipes</p>
                <h1 className="text-5xl md:text-7xl font-serif italic text-zinc-900 dark:text-zinc-100">Hi, I'm Mayuri.</h1>
            </div>

            {/* Photos section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                <div className="space-y-4">
                    <div className="aspect-[3/4] rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-xl border border-zinc-100 dark:border-zinc-900">
                        <img src="/images/about/before.jpg" alt="Before" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 text-center italic">Before</p>
                </div>
                <div className="space-y-4 md:mt-12">
                    <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-900 hover:scale-[1.02] transition-transform duration-500">
                        <img src="/images/about/after.jpg" alt="After" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-900 dark:text-zinc-100 text-center font-bold">After (–25kg)</p>
                </div>
            </div>

            {/* Story section */}
            <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
                <div className="space-y-8 text-xl font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
                    <p className="font-serif italic text-2xl text-zinc-900 dark:text-zinc-100 leading-snug">
                        "I love food a little too much to survive on sad salads."
                    </p>

                    <p>
                        For most of my life, losing weight sounded like it required three things: giving up everything fun, eating chicken and broccoli forever, and pretending I enjoyed it.
                    </p>

                    <p className="font-medium text-zinc-900 dark:text-zinc-100 italic">Spoiler: I didn’t.</p>

                    <p>
                        So instead of trying to become someone who magically loves bland food, I did something else — I started experimenting in the kitchen.
                    </p>

                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 md:p-12 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 my-12">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-6">The Mission</h3>
                        <p className="text-2xl font-serif italic text-zinc-900 dark:text-zinc-100 mb-0">
                            Make food that is high in protein, lower in calories, and actually exciting to eat.
                        </p>
                    </div>

                    <p>
                        Over time, those experiments turned into the meals I ate every single day… and somewhere along the way, I ended up losing 25 kg.
                    </p>

                    <p>
                        Not through some dramatic “new life, new me” moment — but through hundreds of small meals that didn’t feel like punishment.
                    </p>

                    <p>
                        This page is basically my personal recipe vault — the things I actually cooked while figuring out how to eat in a way that worked for my body.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-y border-zinc-100 dark:border-zinc-900">
                    <div>
                        <h3 className="text-xs uppercase tracking-widest font-bold mb-6">Expect things like:</h3>
                        <ul className="space-y-4 list-none p-0">
                            {[
                                "High-protein meals that don't taste like cardboard",
                                "Eggs used in ways that might surprise you",
                                "Cottage cheese & tofu sneaking into places you didn't expect",
                                "Protein shakes that taste like dessert",
                                "Meals that satisfy cravings without blowing up your calories"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-zinc-500 font-light italic">
                                    <span className="text-zinc-900 dark:text-zinc-100 mt-1">•</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col justify-center italic text-zinc-500 font-light">
                        <p className="leading-relaxed">
                            Not because this is some dramatic “transformation story,” but because I want to prove something:
                        </p>
                        <p className="text-xl text-zinc-900 dark:text-zinc-100 font-serif mt-4">
                            You don’t need perfect discipline. <br />
                            You need food that makes consistency easy.
                        </p>
                    </div>
                </div>

                <p className="text-center text-lg text-zinc-600 dark:text-zinc-400 font-light mt-12 pb-12">
                    Welcome to Mayuri’s Recipes — where healthy food is allowed to be a little chaotic, very protein-heavy, and actually fun to eat. 🍳💪
                </p>
            </div>

            {/* Email collector section */}
            <div className="mt-24 p-12 md:p-20 bg-zinc-950 dark:bg-white rounded-[3rem] text-center text-white dark:text-zinc-950 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-transparent dark:from-zinc-200 dark:to-transparent opacity-20" />
                <div className="relative z-10 space-y-8">
                    <h2 className="text-3xl md:text-5xl font-serif italic">Join the experiment.</h2>
                    <p className="text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto font-light">
                        Get my latest recipes and insights delivered directly to your inbox.
                    </p>
                    <EmailCollector />
                </div>
            </div>

            {/* Links section */}
            <div className="mt-32 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link
                    href="https://substack.com/@theslowexperiment"
                    target="_blank"
                    className="flex items-center justify-between p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl hover:border-zinc-900 dark:hover:border-zinc-100 transition-all group"
                >
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">Newsletter</p>
                        <h4 className="text-xl font-serif italic">My Substack</h4>
                    </div>
                    <ExternalLink size={20} className="text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                </Link>

                <Link
                    href="https://the-slow-experiment.dhruvkaluskar007.workers.dev/#posts"
                    target="_blank"
                    className="flex items-center justify-between p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl hover:border-zinc-900 dark:hover:border-zinc-100 transition-all group"
                >
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">Project</p>
                        <h4 className="text-xl font-serif italic">The Slow Experiment</h4>
                    </div>
                    <ArrowRight size={20} className="text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                </Link>
            </div>

            <div className="mt-32 pt-12 border-t border-zinc-100 dark:border-zinc-900 text-center">
                <Link href="/" className="text-xs uppercase tracking-[0.3em] font-light text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    ← Back to Recipe Vault
                </Link>
            </div>
        </div>
    );
}

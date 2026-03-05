import Link from 'next/link';
import { isAdmin } from '@/lib/auth';
import { handleLogout } from '@/app/actions';

export default async function Navbar() {
    const isUserAdmin = await isAdmin();

    return (
        <nav className="border-b border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 focus-visible:outline-none">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center gap-3 group">
                        <span className="text-2xl font-serif tracking-tight text-zinc-900 dark:text-zinc-100 italic group-hover:opacity-70 transition-opacity">
                            Mayri' Recipes
                        </span>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-12">
                        <Link
                            href="/about"
                            className="text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all font-light"
                        >
                            About
                        </Link>
                        <Link
                            href="/plan"
                            className="text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all font-light"
                        >
                            Plan
                        </Link>
                        <Link
                            href="/submit-recipe"
                            className="hidden sm:block px-6 py-2 border border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all"
                        >
                            Submit a Recipe
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

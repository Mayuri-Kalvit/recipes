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
                            Mayri's Recipes
                        </span>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-8">
                        <Link
                            href="/"
                            className="text-xs sm:text-sm uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        >
                            Catalog
                        </Link>

                        {isUserAdmin ? (
                            <div className="flex items-center gap-4 sm:gap-6 border-l border-zinc-100 dark:border-zinc-800 pl-4 sm:pl-6 ml-2">
                                <Link
                                    href="/add-recipe"
                                    className="px-4 py-1.5 sm:px-6 sm:py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-widest hover:scale-105 transition-all"
                                >
                                    Add Recipe
                                </Link>
                                <form action={handleLogout}>
                                    <button className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors">
                                        Logout
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <Link
                                href="/admin"
                                className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                Admin
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

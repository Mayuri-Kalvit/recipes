import Link from 'next/link';
import { isAdmin } from '@/lib/auth';
import { handleLogout } from '@/app/actions';

export default async function Footer() {
    const isUserAdmin = await isAdmin();

    return (
        <footer className="mt-32 border-t border-zinc-100 dark:border-zinc-900 py-16 px-4">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
                <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
                    <Link href="/" className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all font-light">
                        Catalog
                    </Link>
                    <Link href="/about" className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all font-light">
                        About
                    </Link>
                    <Link href="/plan" className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all font-light">
                        Plan
                    </Link>
                    <Link href="/submit-recipe" className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all font-semibold underline decoration-zinc-200 dark:decoration-zinc-800 underline-offset-4">
                        Submit Recipe
                    </Link>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-300 dark:text-zinc-800 font-light italic">
                        &copy; {new Date().getFullYear()} Mayri' Recipes
                    </p>

                    {/* Subtle Admin Access */}
                    <div className="mt-4 opacity-5 hover:opacity-100 transition-all duration-700">
                        {isUserAdmin ? (
                            <div className="flex items-center gap-6">
                                <Link href="/admin/suggestions" className="text-[9px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                                    Queue
                                </Link>
                                <Link href="/add-recipe" className="text-[9px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                                    New
                                </Link>
                                <form action={handleLogout}>
                                    <button className="text-[9px] uppercase tracking-widest text-zinc-400 hover:text-red-500">
                                        Exit
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <Link href="/admin" className="text-[7px] uppercase tracking-widest text-zinc-100 dark:text-zinc-900">
                                .
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}

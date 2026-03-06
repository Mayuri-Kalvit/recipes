import { isAdmin } from '@/lib/auth';
import { handleLogout } from '@/app/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminLoginForm from '@/components/AdminLoginForm';
import { ChefHat, MessageSquare, Plus, LogOut } from 'lucide-react';

export default async function AdminPage() {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
        return <AdminLoginForm />;
    }

    return (
        <div className="max-w-4xl mx-auto py-24 px-6">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-serif italic text-zinc-900 dark:text-zinc-100 mb-4">Admin Dashboard</h1>
                <p className="text-[10px] text-zinc-400 tracking-[0.4em] uppercase">Private Access • Mayri' Recipes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link
                    href="/admin/suggestions"
                    className="group p-10 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all text-center"
                >
                    <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <MessageSquare size={24} className="text-zinc-400 dark:text-zinc-600" />
                    </div>
                    <h2 className="text-xl font-serif italic mb-2">Review Suggestions</h2>
                    <p className="text-xs text-zinc-500 font-light tracking-wide">Approve or reject community recipes</p>
                </Link>

                <Link
                    href="/add-recipe"
                    className="group p-10 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all text-center"
                >
                    <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Plus size={24} className="text-zinc-400 dark:text-zinc-600" />
                    </div>
                    <h2 className="text-xl font-serif italic mb-2">Add New Recipe</h2>
                    <p className="text-xs text-zinc-500 font-light tracking-wide">Create a new recipe in the catalog</p>
                </Link>
            </div>

            <div className="mt-16 text-center">
                <form action={handleLogout}>
                    <button className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-medium text-zinc-400 hover:text-red-500 transition-colors">
                        <LogOut size={12} /> Secure Logout
                    </button>
                </form>
            </div>
        </div>
    );
}

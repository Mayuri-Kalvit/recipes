"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleLogin } from '@/app/actions';

export default function AdminLoginPage() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function onSubmit(formData: FormData) {
        setIsPending(true);
        setError(null);

        const password = formData.get('password') as string;
        const result = await handleLogin(password);

        if (result.success) {
            router.push('/');
            router.refresh();
        } else {
            setError('Invalid password. Please try again.');
            setIsPending(false);
        }
    }

    return (
        <div className="max-w-md mx-auto py-32 px-6">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-serif italic mb-4 text-zinc-900 dark:text-zinc-100">Admin Access</h1>
                <p className="text-[10px] text-zinc-400 tracking-[0.3em] uppercase">Mayri's Recipes</p>
            </div>

            <form action={onSubmit} className="space-y-10">
                {error && (
                    <div className="p-4 bg-red-50 text-red-500 text-xs rounded-lg border border-red-100 font-light italic text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 block ml-1">Secure Password</label>
                    <input
                        name="password"
                        type="password"
                        required
                        autoFocus
                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 px-1 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-lg"
                    />
                </div>

                <button
                    disabled={isPending}
                    className="w-full py-5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                    {isPending ? 'Verifying...' : 'Unlock Dashboard'}
                </button>

                <div className="text-center pt-8">
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                        Return to Site
                    </button>
                </div>
            </form>
        </div>
    );
}

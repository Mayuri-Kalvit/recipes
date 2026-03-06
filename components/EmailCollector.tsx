"use client";

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function EmailCollector() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulating API call
        console.log('Collecting email:', email);
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
                <input
                    type="email"
                    required
                    placeholder="Join my mailing list"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all placeholder:text-zinc-400 placeholder:font-light"
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="absolute right-2 top-2 p-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full hover:scale-105 transition-transform disabled:opacity-50"
                >
                    {status === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : status === 'success' ? (
                        <span className="text-[10px] font-bold px-1">✓</span>
                    ) : (
                        <Send size={18} />
                    )}
                </button>
            </form>
            {status === 'success' && (
                <p className="text-center text-[10px] uppercase tracking-widest text-emerald-500 mt-4 animate-pulse">
                    Thanks for joining!
                </p>
            )}
        </div>
    );
}

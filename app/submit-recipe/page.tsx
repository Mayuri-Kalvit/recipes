import SubmitForm from "@/components/SubmitForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SubmitRecipePage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm uppercase tracking-widest font-light">Back to Catalog</span>
                </Link>
            </div>

            <div className="mb-12 text-center">
                <h1 className="text-4xl font-light text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">Submit a Recipe</h1>
                <p className="text-zinc-500 font-light text-lg">
                    Have a favorite minimalist recipe? Share it with the community.
                </p>
            </div>

            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 sm:p-12 shadow-sm">
                <SubmitForm />
            </div>
        </div>
    );
}

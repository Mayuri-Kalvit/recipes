"use client";

import { Trash2 } from "lucide-react";
import { deleteRecipe } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteButtonProps {
    slug: string;
}

export default function DeleteButton({ slug }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    async function handleAction() {
        if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteRecipe(slug);
            if (result.success) {
                router.push('/');
                router.refresh();
            } else {
                alert(result.error || 'Failed to delete recipe.');
                setIsDeleting(false);
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
            setIsDeleting(false);
        }
    }

    return (
        <button
            onClick={handleAction}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
        >
            <Trash2 size={14} />
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    );
}

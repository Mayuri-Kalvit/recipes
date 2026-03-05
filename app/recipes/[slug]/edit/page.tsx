import { getRecipeBySlug } from "@/lib/recipes";
import { notFound, redirect } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";
import { isAdmin } from "@/lib/auth";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function EditRecipePage({ params }: PageProps) {
    if (!await isAdmin()) {
        redirect('/admin');
    }

    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-light text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">Edit Recipe</h1>
                <p className="text-zinc-500 font-light italic font-serif">
                    Refining {recipe.title}
                </p>
            </div>

            <RecipeForm recipe={recipe} />
        </div>
    );
}

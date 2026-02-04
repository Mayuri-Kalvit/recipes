import RecipeForm from "@/components/RecipeForm";

export default function AddRecipePage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-light text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">Add Recipe</h1>
                <p className="text-zinc-500 font-light">
                    Contribute a new minimalist recipe to the collection.
                </p>
            </div>

            <RecipeForm />
        </div>
    );
}

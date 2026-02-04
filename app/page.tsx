import Image from "next/image";
import { getAllRecipes, getProteinSources } from "@/lib/recipes";
import RecipeList from "@/components/RecipeList";

export default async function Home() {
  const [recipes, proteinSources] = await Promise.all([
    getAllRecipes(),
    getProteinSources()
  ]);

  return (
    <div className="space-y-16">
      <section className="py-20 flex flex-col items-center text-center">
        <h2 className="text-5xl font-light text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
          Simple food for <span className="font-serif italic font-normal">better living.</span>
        </h2>
        <p className="text-zinc-500 max-w-xl text-lg font-light leading-relaxed">
          A collection of recipes focused on high protein and minimal ingredients.
        </p>
      </section>

      <RecipeList initialRecipes={recipes} proteinSources={proteinSources} />
    </div>
  );
}

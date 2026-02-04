export type ProteinSource = string;

export interface RecipeFrontmatter {
    title: string;
    slug: string;
    protein_source: ProteinSource;
    calories: number;
    protein_grams: number;
    time_minutes: number;
    servings: number;
    tags: string[];
    meal_types: string[];
    image_url?: string;
    date?: string;
}

export interface Recipe extends RecipeFrontmatter {
    content: string;
}

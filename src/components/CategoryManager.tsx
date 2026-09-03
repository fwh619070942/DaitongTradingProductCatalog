import { FormEvent, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Product } from "../types/catalog";

type CategoryManagerProps = {
  categories: string[];
  products: Product[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
};

export function CategoryManager({
  categories,
  products,
  onAddCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [categoryName, setCategoryName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddCategory(categoryName);
    setCategoryName("");
  }

  return (
    <section className="glass-effect rounded-lg p-4 shadow-glass">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-bagel text-2xl text-slate-950">Categories</h2>
          <p className="text-sm text-slate-600">{categories.length} active collections</p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
          <label className="sr-only" htmlFor="categoryName">
            Category name
          </label>
          <input
            id="categoryName"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="New category"
            className="min-h-11 flex-1 rounded-lg border border-white/40 bg-white/70 px-3 text-sm text-slate-900 outline-none transition focus:border-accent-blue"
          />
          <button
            type="submit"
            className="gentle-animation inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent-blue px-4 text-sm font-semibold text-white shadow-lift"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add
          </button>
        </form>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => {
          const productCount = products.filter((product) => product.category === category).length;

          return (
            <span
              key={category}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/40 bg-white/65 px-3 text-sm font-semibold text-slate-700"
            >
              {category}
              <span className="rounded-full bg-slate-950 px-2 py-0.5 text-xs text-white">{productCount}</span>
              <button
                type="button"
                onClick={() => onDeleteCategory(category)}
                className="rounded-lg p-1 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                aria-label={`Delete ${category}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </span>
          );
        })}
      </div>
    </section>
  );
}

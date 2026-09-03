import { Check, Edit3, Plus, Trash2 } from "lucide-react";
import type { Product } from "../types/catalog";
import { ImageWithFallback } from "./ImageWithFallback";

type ProductCardProps = {
  product: Product;
  isSelected: boolean;
  isAdmin: boolean;
  onToggleInquiry: (productId: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
};

export function ProductCard({
  product,
  isSelected,
  isAdmin,
  onToggleInquiry,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const primaryImage = product.images[0] ?? "";

  return (
    <article className="glass-effect group flex h-full flex-col overflow-hidden rounded-lg shadow-glass gentle-animation">
      <div className="relative aspect-[4/3] overflow-hidden bg-white/50">
        <ImageWithFallback
          src={primaryImage}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <span className="absolute left-3 top-3 rounded-lg bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-purple shadow-sm backdrop-blur">
          {product.category}
        </span>

        {isAdmin && (
          <div className="absolute right-3 top-3 flex gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:text-accent-blue"
              aria-label={`Edit ${product.title}`}
              title="Edit"
            >
              <Edit3 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(product.id)}
              className="grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:text-red-600"
              aria-label={`Delete ${product.title}`}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{product.sku}</div>
          <h3 className="text-lg font-bold leading-tight text-slate-950">{product.title}</h3>
        </div>
        <p className="line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{product.description}</p>
        <button
          type="button"
          onClick={() => onToggleInquiry(product.id)}
          className={`gentle-animation mt-auto flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold ${
            isSelected
              ? "bg-accent-emerald text-white shadow-lift"
              : "bg-slate-950 text-white shadow-sm hover:bg-accent-blue"
          }`}
        >
          {isSelected ? <Check className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
          {isSelected ? "In Inquiry" : "Add to Inquiry"}
        </button>
      </div>
    </article>
  );
}

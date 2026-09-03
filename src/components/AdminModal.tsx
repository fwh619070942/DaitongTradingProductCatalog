import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Check, Plus, Trash2, Upload, X } from "lucide-react";
import type { Product, ProductDraft } from "../types/catalog";
import { normalizeImagePath } from "../lib/images";
import { ImageWithFallback } from "./ImageWithFallback";

type AdminModalProps = {
  isOpen: boolean;
  categories: string[];
  product?: Product | null;
  onClose: () => void;
  onSave: (draft: ProductDraft, productId?: string) => void;
};

const EMPTY_DRAFT: ProductDraft = {
  title: "",
  category: "",
  description: "",
  sku: "",
  images: [],
};

export function AdminModal({ isOpen, categories, product, onClose, onSave }: AdminModalProps) {
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_DRAFT);
  const [pathValue, setPathValue] = useState("");
  const [imageMode, setImageMode] = useState<"append" | "replace">("append");

  const dialogTitle = useMemo(() => (product ? "Edit Product" : "Add Product"), [product]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDraft(
      product
        ? {
            title: product.title,
            category: product.category,
            description: product.description,
            sku: product.sku,
            images: product.images,
          }
        : {
            ...EMPTY_DRAFT,
            category: categories[0] ?? "",
          },
    );
    setPathValue("");
    setImageMode("append");
  }, [categories, isOpen, product]);

  if (!isOpen) {
    return null;
  }

  function updateDraft(field: keyof ProductDraft, value: string | string[]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function applyImage(nextImage: string) {
    if (!nextImage) {
      return;
    }

    setDraft((current) => ({
      ...current,
      images:
        imageMode === "replace" && current.images.length > 0
          ? [nextImage, ...current.images.slice(1)]
          : [...current.images, nextImage],
    }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        applyImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function handleAddPath() {
    applyImage(normalizeImagePath(pathValue));
    setPathValue("");
  }

  function removeImage(imageIndex: number) {
    setDraft((current) => ({
      ...current,
      images: current.images.filter((_, index) => index !== imageIndex),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSave(
      {
        ...draft,
        title: draft.title.trim(),
        sku: draft.sku.trim(),
        description: draft.description.trim(),
      },
      product?.id,
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
        className="glass-effect max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg p-5 shadow-glass"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="product-dialog-title" className="font-bagel text-3xl text-slate-950">
            {dialogTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg bg-white/70 text-slate-600 transition hover:text-slate-950"
            aria-label="Close product dialog"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              Product title
              <input
                required
                value={draft.title}
                onChange={(event) => updateDraft("title", event.target.value)}
                className="min-h-11 w-full rounded-lg border border-white/40 bg-white/75 px-3 text-sm text-slate-900 outline-none transition focus:border-accent-blue"
              />
            </label>

            <label className="space-y-2 text-sm font-semibold text-slate-700">
              SKU
              <input
                required
                value={draft.sku}
                onChange={(event) => updateDraft("sku", event.target.value)}
                className="min-h-11 w-full rounded-lg border border-white/40 bg-white/75 px-3 text-sm text-slate-900 outline-none transition focus:border-accent-blue"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Category
            <select
              required
              value={draft.category}
              onChange={(event) => updateDraft("category", event.target.value)}
              className="min-h-11 w-full rounded-lg border border-white/40 bg-white/75 px-3 text-sm text-slate-900 outline-none transition focus:border-accent-blue"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Description
            <textarea
              required
              value={draft.description}
              onChange={(event) => updateDraft("description", event.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-white/40 bg-white/75 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-accent-blue"
            />
          </label>

          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-800">Images</h3>
              <div className="inline-flex rounded-lg border border-white/40 bg-white/65 p-1">
                <button
                  type="button"
                  onClick={() => setImageMode("append")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                    imageMode === "append" ? "bg-slate-950 text-white" : "text-slate-600"
                  }`}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("replace")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                    imageMode === "replace" ? "bg-slate-950 text-white" : "text-slate-600"
                  }`}
                >
                  Replace first
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-accent-blue/40 bg-white/65 px-4 text-sm font-bold text-accent-blue transition hover:bg-white">
                <Upload className="h-5 w-5" aria-hidden="true" />
                Upload image
                <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
              </label>

              <div className="flex min-h-12 min-w-0 overflow-hidden rounded-lg border border-white/40 bg-white/75">
                <label className="sr-only" htmlFor="imagePath">
                  Image path
                </label>
                <input
                  id="imagePath"
                  value={pathValue}
                  onChange={(event) => setPathValue(event.target.value)}
                  placeholder="hat-7.jpg or /images/hat-7.jpg"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddPath}
                  className="grid w-12 place-items-center bg-slate-950 text-white transition hover:bg-accent-blue"
                  aria-label="Add image path"
                  title="Add path"
                >
                  <Plus className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {draft.images.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/50 bg-white/45 p-4 text-sm text-slate-500">
                  No image selected
                </div>
              ) : (
                draft.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white/60">
                    <ImageWithFallback src={image} alt={`${draft.title || "Product"} ${index + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-slate-600 shadow-sm transition hover:text-red-600"
                      aria-label="Delete product image"
                      title="Delete image"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-lg border border-white/40 bg-white/65 px-5 text-sm font-bold text-slate-700 transition hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gentle-animation inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent-emerald px-5 text-sm font-bold text-white shadow-lift"
            >
              <Check className="h-5 w-5" aria-hidden="true" />
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

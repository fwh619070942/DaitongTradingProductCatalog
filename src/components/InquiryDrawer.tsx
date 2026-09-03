import { FormEvent, useState } from "react";
import { Send, Trash2, X } from "lucide-react";
import type { InquiryFormValues, Product } from "../types/catalog";
import { ImageWithFallback } from "./ImageWithFallback";

type InquiryDrawerProps = {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
  onSubmitInquiry: (values: InquiryFormValues) => Promise<void>;
};

const EMPTY_FORM: InquiryFormValues = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

export function InquiryDrawer({
  isOpen,
  products,
  onClose,
  onRemoveProduct,
  onSubmitInquiry,
}: InquiryDrawerProps) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmitInquiry(values);
      setValues(EMPTY_FORM);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm">
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col bg-white/85 shadow-glass backdrop-blur-xl">
        <div className="border-b border-white/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bagel text-3xl text-slate-950">Inquiry Bag</h2>
              <p className="text-sm text-slate-600">
                {products.length} selected {products.length === 1 ? "product" : "products"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-lg bg-white/80 text-slate-600 transition hover:text-slate-950"
              aria-label="Close inquiry bag"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white/65 p-5 text-sm text-slate-500">
                No products selected
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="glass-effect grid grid-cols-[72px_minmax(0,1fr)_40px] gap-3 rounded-lg p-3">
                  <div className="aspect-square overflow-hidden rounded-lg bg-white/60">
                    <ImageWithFallback src={product.images[0] ?? ""} alt={product.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-slate-950">{product.title}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{product.sku}</p>
                    <p className="mt-2 text-xs text-slate-600">{product.category}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveProduct(product.id)}
                    className="grid h-10 w-10 place-items-center rounded-lg bg-white/70 text-slate-500 transition hover:text-red-600"
                    aria-label={`Remove ${product.title}`}
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                Name
                <input
                  required
                  value={values.name}
                  onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
                  className="min-h-11 w-full rounded-lg border border-white/40 bg-white/80 px-3 text-sm text-slate-900 outline-none transition focus:border-accent-blue"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-slate-700">
                Email
                <input
                  required
                  type="email"
                  value={values.email}
                  onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
                  className="min-h-11 w-full rounded-lg border border-white/40 bg-white/80 px-3 text-sm text-slate-900 outline-none transition focus:border-accent-blue"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm font-semibold text-slate-700">
              Phone Number
              <input
                value={values.phone}
                onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))}
                className="min-h-11 w-full rounded-lg border border-white/40 bg-white/80 px-3 text-sm text-slate-900 outline-none transition focus:border-accent-blue"
              />
            </label>

            <label className="space-y-2 text-sm font-semibold text-slate-700">
              Custom Requirements / Notes
              <textarea
                value={values.notes}
                onChange={(event) => setValues((current) => ({ ...current, notes: event.target.value }))}
                rows={4}
                className="w-full resize-none rounded-lg border border-white/40 bg-white/80 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-accent-blue"
              />
            </label>

            <button
              type="submit"
              disabled={products.length === 0 || isSubmitting}
              className="gentle-animation flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white shadow-lift disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Send className="h-5 w-5" aria-hidden="true" />
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}

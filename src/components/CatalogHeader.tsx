import { Search, ShoppingBag } from "lucide-react";

type CatalogHeaderProps = {
  searchTerm: string;
  inquiryCount: number;
  isAdmin: boolean;
  onSearchChange: (value: string) => void;
  onOpenInquiry: () => void;
  onToggleAdmin: () => void;
};

export function CatalogHeader({
  searchTerm,
  inquiryCount,
  isAdmin,
  onSearchChange,
  onOpenInquiry,
  onToggleAdmin,
}: CatalogHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/30 bg-white/65 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-bagel text-3xl text-slate-950">Daitong Product Catalog</h1>
          <button
            type="button"
            onClick={onToggleAdmin}
            className={`gentle-animation rounded-lg border px-3 py-2 text-sm font-semibold shadow-sm ${
              isAdmin
                ? "border-accent-purple/40 bg-accent-purple text-white"
                : "border-white/40 bg-white/60 text-slate-700 hover:text-accent-blue"
            }`}
          >
            {isAdmin ? "Admin Mode" : "Visitor Mode"}
          </button>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[560px]">
          <label className="glass-effect flex min-h-11 flex-1 items-center gap-2 rounded-lg px-3">
            <Search className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
            <span className="sr-only">Search products</span>
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, SKU, or description"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
            />
          </label>

          <button
            type="button"
            onClick={onOpenInquiry}
            className="gentle-animation flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-lift"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span>Inquiry Bag</span>
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-2 text-xs font-bold text-slate-950">
              {inquiryCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

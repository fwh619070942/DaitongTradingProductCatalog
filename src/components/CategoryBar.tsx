type CategoryBarProps = {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
};

export function CategoryBar({ categories, activeCategory, onChange }: CategoryBarProps) {
  const allCategories = ["All", ...categories];

  return (
    <nav className="glass-effect flex gap-2 overflow-x-auto rounded-lg p-2" aria-label="Category filters">
      {allCategories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`gentle-animation min-h-10 shrink-0 rounded-lg border px-4 text-sm font-semibold ${
              isActive
                ? "border-transparent bg-gradient-to-r from-accent-blue via-accent-purple to-accent-emerald text-white shadow-lift"
                : "border-white/30 bg-white/55 text-slate-700 hover:border-accent-blue/40 hover:text-accent-blue"
            }`}
          >
            {category}
          </button>
        );
      })}
    </nav>
  );
}

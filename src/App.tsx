import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Toaster, toast } from "sonner";
import { AdminModal } from "./components/AdminModal";
import { CatalogHeader } from "./components/CatalogHeader";
import { CategoryBar } from "./components/CategoryBar";
import { CategoryManager } from "./components/CategoryManager";
import { InquiryDrawer } from "./components/InquiryDrawer";
import { ProductCard } from "./components/ProductCard";
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from "./data/mockData";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { InquiryFormValues, Product, ProductDraft } from "./types/catalog";

const ALL_CATEGORIES = "All";
const UNCATEGORIZED = "Uncategorized";
const CATALOG_DATA_VERSION = "full-catalog-web-432-v1";
const CATALOG_VERSION_KEY = "catalog-data-version";
const PRODUCT_STORAGE_KEY = "catalog-products-v3";
const CATEGORY_STORAGE_KEY = "catalog-categories-v3";

function hasStalePreviewCatalog() {
  const storedProducts = window.localStorage.getItem(PRODUCT_STORAGE_KEY);

  if (!storedProducts) {
    return false;
  }

  try {
    const parsedProducts = JSON.parse(storedProducts) as Product[];

    return (
      Array.isArray(parsedProducts) &&
      parsedProducts.length <= 6 &&
      parsedProducts.some((product) => product.images.some((image) => image.startsWith("/images/hat-")))
    );
  } catch {
    return true;
  }
}

export default function App() {
  const [products, setProducts] = useLocalStorage<Product[]>(PRODUCT_STORAGE_KEY, DEFAULT_PRODUCTS);
  const [categories, setCategories] = useLocalStorage<string[]>(CATEGORY_STORAGE_KEY, DEFAULT_CATEGORIES);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    const storedVersion = window.localStorage.getItem(CATALOG_VERSION_KEY);

    if (storedVersion !== CATALOG_DATA_VERSION || hasStalePreviewCatalog()) {
      setProducts(DEFAULT_PRODUCTS);
      setCategories(DEFAULT_CATEGORIES);
      setSelectedProductIds([]);
      setActiveCategory(ALL_CATEGORIES);
      window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      window.localStorage.setItem(CATALOG_VERSION_KEY, CATALOG_DATA_VERSION);
    }
  }, [setCategories, setProducts]);

  const visibleProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory === ALL_CATEGORIES || product.category === activeCategory;
      const matchesQuery =
        !query ||
        [product.title, product.sku, product.description, product.category].some((value) =>
          value.toLowerCase().includes(query),
        );

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, products, searchTerm]);

  const selectedProducts = useMemo(
    () => products.filter((product) => selectedProductIds.includes(product.id)),
    [products, selectedProductIds],
  );

  function handleToggleInquiry(productId: string) {
    setSelectedProductIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    );
  }

  function handleAddCategory(category: string) {
    const nextCategory = category.trim();

    if (!nextCategory) {
      toast.error("Category name is required.");
      return;
    }

    if (categories.some((existingCategory) => existingCategory.toLowerCase() === nextCategory.toLowerCase())) {
      toast.error("That category already exists.");
      return;
    }

    setCategories((current) => [...current, nextCategory]);
    toast.success("Category created.");
  }

  function handleDeleteCategory(category: string) {
    if (categories.length <= 1) {
      toast.error("Keep at least one category.");
      return;
    }

    const hasProducts = products.some((product) => product.category === category);
    const nextCategories = categories.filter((existingCategory) => existingCategory !== category);

    if (hasProducts) {
      const categoriesWithFallback = nextCategories.includes(UNCATEGORIZED)
        ? nextCategories
        : [...nextCategories, UNCATEGORIZED];

      setProducts((current) =>
        current.map((product) =>
          product.category === category ? { ...product, category: UNCATEGORIZED } : product,
        ),
      );
      setCategories(categoriesWithFallback);
      toast.success(`${category} removed. Products moved to ${UNCATEGORIZED}.`);
    } else {
      setCategories(nextCategories);
      toast.success("Category deleted.");
    }

    if (activeCategory === category) {
      setActiveCategory(ALL_CATEGORIES);
    }
  }

  function openAddProductModal() {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  }

  function openEditProductModal(product: Product) {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  }

  function handleSaveProduct(draft: ProductDraft, productId?: string) {
    if (!draft.title || !draft.sku || !draft.description || !draft.category) {
      toast.error("Complete the product fields before saving.");
      return;
    }

    if (productId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === productId
            ? {
                ...product,
                ...draft,
              }
            : product,
        ),
      );
      toast.success("Product updated.");
    } else {
      const now = new Date().toISOString();
      setProducts((current) => [
        {
          id: `product-${crypto.randomUUID()}`,
          ...draft,
          createdAt: now,
        },
        ...current,
      ]);
      toast.success("Product added.");
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  }

  function handleDeleteProduct(productId: string) {
    const product = products.find((item) => item.id === productId);
    setProducts((current) => current.filter((item) => item.id !== productId));
    setSelectedProductIds((current) => current.filter((id) => id !== productId));
    toast.success(`${product?.title ?? "Product"} deleted.`);
  }

  async function handleSubmitInquiry(values: InquiryFormValues) {
    const payload = {
      ...values,
      products: selectedProducts.map((product) => ({
        title: product.title,
        sku: product.sku,
        category: product.category,
      })),
      emailjs: {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "YOUR_EMAILJS_SERVICE_ID",
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "YOUR_EMAILJS_TEMPLATE_ID",
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "YOUR_EMAILJS_PUBLIC_KEY",
      },
    };

    if (import.meta.env.VITE_FORMSPREE_ENDPOINT) {
      const response = await fetch(import.meta.env.VITE_FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Inquiry submission failed.");
      }
    } else {
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      console.info("Inquiry payload ready for Formspree or EmailJS:", payload);
    }

    toast.success("Inquiry submitted.");
    setSelectedProductIds([]);
    setIsInquiryOpen(false);
  }

  return (
    <div className="min-h-screen bg-background bg-gradient-to-br from-accent-blue/10 via-accent-purple/5 to-accent-emerald/10 text-foreground">
      <CatalogHeader
        searchTerm={searchTerm}
        inquiryCount={selectedProductIds.length}
        isAdmin={isAdmin}
        onSearchChange={setSearchTerm}
        onOpenInquiry={() => setIsInquiryOpen(true)}
        onToggleAdmin={() => setIsAdmin((current) => !current)}
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <CategoryBar categories={categories} activeCategory={activeCategory} onChange={setActiveCategory} />

        {isAdmin && (
          <div className="space-y-4">
            <CategoryManager
              categories={categories}
              products={products}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openAddProductModal}
                className="gentle-animation inline-flex min-h-11 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white shadow-lift"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
                Add Product
              </button>
            </div>
          </div>
        )}

        {visibleProducts.length === 0 ? (
          <section className="glass-effect rounded-lg p-8 text-center shadow-glass">
            <h2 className="font-bagel text-3xl text-slate-950">No products found</h2>
            <p className="mt-2 text-sm text-slate-600">Try another search or category.</p>
          </section>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProductIds.includes(product.id)}
                isAdmin={isAdmin}
                onToggleInquiry={handleToggleInquiry}
                onEdit={openEditProductModal}
                onDelete={handleDeleteProduct}
              />
            ))}
          </section>
        )}
      </main>

      <AdminModal
        isOpen={isProductModalOpen}
        product={editingProduct}
        categories={categories}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />

      <InquiryDrawer
        isOpen={isInquiryOpen}
        products={selectedProducts}
        onClose={() => setIsInquiryOpen(false)}
        onRemoveProduct={(productId) => setSelectedProductIds((current) => current.filter((id) => id !== productId))}
        onSubmitInquiry={handleSubmitInquiry}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}

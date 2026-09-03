export type Product = {
  id: string;
  title: string;
  category: string;
  description: string;
  sku: string;
  images: string[];
  createdAt: string;
};

export type ProductDraft = {
  title: string;
  category: string;
  description: string;
  sku: string;
  images: string[];
};

export type InquiryFormValues = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  company: string;
};

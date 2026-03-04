export interface Product {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    description: string;
    features: string[];
    price: number;
    originalPrice?: number;
    currency: string;
    category: string;
    image: string;
    screenshots: string[];
    faqs: { question: string; answer: string }[];
    badge?: string;
    downloadUrl?: string;
}

// Products are now managed from Admin Panel → /admin/products
// This array is empty — add your real products from the admin dashboard!
export const products: Product[] = [];

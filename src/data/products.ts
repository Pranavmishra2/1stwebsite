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
}

export const products: Product[] = [
    {
        id: "1",
        slug: "ai-content-engine",
        name: "AI Content Engine",
        tagline: "Generate high-quality content 10x faster with AI",
        description:
            "AI Content Engine is a powerful tool that leverages cutting-edge language models to generate blog posts, social media content, product descriptions, and more. Built for creators, marketers, and entrepreneurs who need to scale their content production without sacrificing quality. Simply provide a topic or brief, and let the AI craft compelling, SEO-optimized content tailored to your brand voice.",
        features: [
            "Generate blog posts, tweets, LinkedIn posts & more",
            "SEO optimization built-in with keyword targeting",
            "Custom brand voice training",
            "Bulk content generation mode",
            "Export to Markdown, HTML, or plain text",
            "API access for integration with your workflows",
        ],
        price: 49,
        originalPrice: 79,
        currency: "USD",
        category: "AI Tools",
        image: "/products/content-engine.png",
        screenshots: [],
        badge: "Best Seller",
        faqs: [
            {
                question: "How many pieces of content can I generate?",
                answer: "The license includes unlimited generations. There are no usage caps.",
            },
            {
                question: "Does it support multiple languages?",
                answer: "Yes, it supports 25+ languages including Hindi, Spanish, French, German, and more.",
            },
            {
                question: "Can I customize the writing style?",
                answer: "Absolutely. You can train it on your existing content to match your brand voice perfectly.",
            },
            {
                question: "Is there a refund policy?",
                answer: "Yes, we offer a 30-day money-back guarantee if the product doesn't meet your expectations.",
            },
        ],
    },
    {
        id: "2",
        slug: "smart-automation-kit",
        name: "Smart Automation Kit",
        tagline: "Automate repetitive tasks and save 20+ hours per week",
        description:
            "The Smart Automation Kit is a collection of pre-built automation scripts and tools designed to eliminate repetitive tasks from your workflow. From email management to data scraping, social media scheduling to file organization — this kit has you covered. Built with Python and Node.js, every script is well-documented and easy to customize.",
        features: [
            "50+ ready-to-use automation scripts",
            "Email automation & smart filtering",
            "Social media auto-posting system",
            "Data scraping & cleaning tools",
            "File organization & backup automation",
            "Detailed documentation & video tutorials",
        ],
        price: 39,
        originalPrice: 59,
        currency: "USD",
        category: "Automation",
        image: "/products/automation-kit.png",
        screenshots: [],
        badge: "Popular",
        faqs: [
            {
                question: "Do I need coding knowledge?",
                answer: "Basic understanding helps, but each script comes with step-by-step setup instructions anyone can follow.",
            },
            {
                question: "What platforms are supported?",
                answer: "Scripts work on Windows, macOS, and Linux. Some social media scripts require API keys from the platforms.",
            },
            {
                question: "Will I get updates?",
                answer: "Yes, you get lifetime updates. New scripts are added monthly.",
            },
        ],
    },
    {
        id: "3",
        slug: "ai-image-toolkit",
        name: "AI Image Toolkit",
        tagline: "Professional image generation and editing powered by AI",
        description:
            "AI Image Toolkit is your all-in-one solution for creating stunning visuals using artificial intelligence. Generate product mockups, social media graphics, thumbnails, and artistic images in seconds. Features include background removal, image upscaling, style transfer, and batch processing. Perfect for designers, marketers, and content creators.",
        features: [
            "AI image generation from text prompts",
            "Automatic background removal",
            "4x image upscaling with quality preservation",
            "Style transfer between images",
            "Batch processing for bulk operations",
            "Commercial usage rights included",
        ],
        price: 59,
        originalPrice: 99,
        currency: "USD",
        category: "AI Tools",
        image: "/products/image-toolkit.png",
        screenshots: [],
        badge: "New",
        faqs: [
            {
                question: "Can I use generated images commercially?",
                answer: "Yes, all images generated with the toolkit come with full commercial usage rights.",
            },
            {
                question: "What image formats are supported?",
                answer: "PNG, JPG, WebP, and SVG. You can also export in various resolutions.",
            },
            {
                question: "Does it work offline?",
                answer: "The generation features require internet, but editing and processing tools work fully offline.",
            },
        ],
    },
    {
        id: "4",
        slug: "prompt-mastery-guide",
        name: "Prompt Mastery Guide",
        tagline: "Master the art of AI prompting for 10x better results",
        description:
            "Learn the science and art of crafting perfect prompts for ChatGPT, Midjourney, Claude, and other AI tools. This comprehensive guide includes 500+ proven prompt templates, advanced techniques, and real-world use cases across writing, coding, design, and business. Go from AI beginner to power user in days, not months.",
        features: [
            "500+ battle-tested prompt templates",
            "Covers ChatGPT, Midjourney, Claude, Gemini & more",
            "Advanced chain-of-thought techniques",
            "Industry-specific prompt libraries",
            "Regular updates with new AI models",
            "Private community access",
        ],
        price: 29,
        originalPrice: 49,
        currency: "USD",
        category: "Guides",
        image: "/products/prompt-guide.png",
        screenshots: [],
        faqs: [
            {
                question: "Is this suitable for beginners?",
                answer: "Absolutely. The guide starts from basics and progressively covers advanced techniques.",
            },
            {
                question: "How is this delivered?",
                answer: "You get instant access to a beautifully formatted PDF + online dashboard with all templates.",
            },
            {
                question: "Do you cover image generation prompts?",
                answer: "Yes, there are dedicated chapters for Midjourney, DALL-E, and Stable Diffusion prompting.",
            },
        ],
    },
];

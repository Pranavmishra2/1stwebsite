/**
 * Sanitize HTML to prevent XSS attacks.
 * Removes dangerous tags and attributes from user-provided HTML.
 */

const ALLOWED_TAGS = new Set([
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "span", "div", "br", "hr",
    "strong", "b", "em", "i", "u", "s", "strike",
    "ul", "ol", "li",
    "a", "img",
    "blockquote", "pre", "code",
    "table", "thead", "tbody", "tr", "th", "td",
    "sup", "sub", "mark",
]);

const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
    a: new Set(["href", "title", "target", "rel"]),
    img: new Set(["src", "alt", "width", "height"]),
    td: new Set(["colspan", "rowspan"]),
    th: new Set(["colspan", "rowspan"]),
};

const DANGEROUS_PATTERNS = [
    /javascript\s*:/gi,
    /on\w+\s*=/gi,
    /<script[\s>]/gi,
    /<\/script>/gi,
    /<iframe[\s>]/gi,
    /<\/iframe>/gi,
    /<object[\s>]/gi,
    /<embed[\s>]/gi,
    /<form[\s>]/gi,
    /data\s*:\s*text\/html/gi,
    /vbscript\s*:/gi,
    /expression\s*\(/gi,
];

export function sanitizeHTML(html: string): string {
    let clean = html;

    // Remove dangerous patterns
    for (const pattern of DANGEROUS_PATTERNS) {
        clean = clean.replace(pattern, "");
    }

    // Use DOMParser to sanitize (client-side)
    if (typeof window !== "undefined") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(clean, "text/html");

        function sanitizeNode(node: Node): void {
            const children = Array.from(node.childNodes);
            for (const child of children) {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    const el = child as Element;
                    const tagName = el.tagName.toLowerCase();

                    if (!ALLOWED_TAGS.has(tagName)) {
                        // Replace with text content only
                        const text = document.createTextNode(el.textContent || "");
                        node.replaceChild(text, child);
                        continue;
                    }

                    // Remove disallowed attributes
                    const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || new Set();
                    const attrs = Array.from(el.attributes);
                    for (const attr of attrs) {
                        if (!allowedAttrs.has(attr.name.toLowerCase())) {
                            el.removeAttribute(attr.name);
                        }
                    }

                    // Force safe link attributes
                    if (tagName === "a") {
                        el.setAttribute("rel", "noopener noreferrer");
                        const href = el.getAttribute("href") || "";
                        if (href.match(/^javascript:/i) || href.match(/^data:/i)) {
                            el.setAttribute("href", "#");
                        }
                    }

                    sanitizeNode(child);
                }
            }
        }

        sanitizeNode(doc.body);
        return doc.body.innerHTML;
    }

    return clean;
}

/**
 * Sanitize user input text (for form fields).
 * Escapes HTML entities to prevent injection.
 */
export function sanitizeText(input: string): string {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .trim();
}

/**
 * Validate and sanitize a URL string.
 */
export function sanitizeURL(url: string): string {
    try {
        const parsed = new URL(url);
        if (["http:", "https:"].includes(parsed.protocol)) {
            return parsed.toString();
        }
        return "";
    } catch {
        return "";
    }
}

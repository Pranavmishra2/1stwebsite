export const metadata = {
    title: "Terms and Conditions | LaunchPad",
    description: "Terms and Conditions for using LaunchPad products and services.",
};

export default function TermsConditions() {
    return (
        <div className="container-custom" style={{ padding: "100px 0 60px", maxWidth: 800 }}>
            <h1 className="text-4xl font-bold mb-6 gradient-text">Terms and Conditions</h1>
            <p className="text-slate-400 mb-8">Last updated: March 2026</p>

            <div className="prose prose-invert max-w-none text-slate-300">
                <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                    By accessing and using LaunchPad, you accept and agree to be bound by the terms and provision of this agreement.
                    In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Digital Products and Licenses</h2>
                <p className="mb-4">
                    All digital products, templates, and courses purchased on LaunchPad are subject to a personal/commercial use license.
                    You may use the products for your own projects, but you may not redistribute, resell, or claim the intellectual property as your own.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Refunds Policy</h2>
                <p className="mb-4">
                    Due to the nature of digital products, all sales are final. We generally do not offer refunds once a product is downloaded unless explicitly stated otherwise or the product is proven to be fundamentally defective.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Informational Purpose</h2>
                <p className="mb-4">
                    The content on this website, including blog posts and tutorials, is for informational and educational purposes only.
                    We do not guarantee specific results from the use of our tools or strategies.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">5. User Accounts</h2>
                <p className="mb-4">
                    To access certain areas of our site (such as 'My Purchases'), you may be required to register with an email address.
                    You agree to provide, maintain and update true, accurate, current and complete information about yourself.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Changes to Terms</h2>
                <p className="mb-4">
                    We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review these pages periodically.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">Contact</h2>
                <p className="mb-4">
                    For any questions regarding these Terms, please contact <a href="mailto:hello@launchpad.dev" className="text-purple-400">hello@launchpad.dev</a>.
                </p>
            </div>
        </div>
    );
}

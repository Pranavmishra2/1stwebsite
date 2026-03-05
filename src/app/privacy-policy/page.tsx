export const metadata = {
    title: "Privacy Policy | LaunchPad",
    description: "Privacy Policy for LaunchPad - Learn how we collect, use, and protect your data.",
};

export default function PrivacyPolicy() {
    return (
        <div className="container-custom" style={{ padding: "100px 0 60px", maxWidth: 800 }}>
            <h1 className="text-4xl font-bold mb-6 gradient-text">Privacy Policy</h1>
            <p className="text-slate-400 mb-8">Last updated: March 2026</p>

            <div className="prose prose-invert max-w-none text-slate-300">
                <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
                <p className="mb-4">
                    Welcome to LaunchPad. We respect your privacy and are committed to protecting your personal data.
                    This privacy policy will inform you about how we look after your personal data when you visit our website
                    and tell you about your privacy rights.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Data We Collect</h2>
                <p className="mb-4">
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                    <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                    <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                </ul>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">3. How We Use Your Data</h2>
                <p className="mb-4">
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., providing a digital product).</li>
                    <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
                    <li>To display personalized advertisements via Google AdSense.</li>
                </ul>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Third-Party Services & Cookies</h2>
                <p className="mb-4">
                    Our website uses cookies to distinguish you from other users. We use third-party services including Google AdSense to serve ads.
                    Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
                </p>
                <p className="mb-4">
                    Users may opt-out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-purple-400 hover:text-purple-300">Ads Settings</a>.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Data Security</h2>
                <p className="mb-4">
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Contact Us</h2>
                <p className="mb-4">
                    If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:hello@launchpad.dev" className="text-purple-400 font-semibold">hello@launchpad.dev</a>.
                </p>
            </div>
        </div>
    );
}

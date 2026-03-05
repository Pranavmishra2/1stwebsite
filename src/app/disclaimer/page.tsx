export const metadata = {
    title: "Disclaimer | LaunchPad",
    description: "Legal and financial disclaimers for LaunchPad.",
};

export default function Disclaimer() {
    return (
        <div className="container-custom" style={{ padding: "100px 0 60px", maxWidth: 800 }}>
            <h1 className="text-4xl font-bold mb-6 gradient-text">Disclaimer</h1>
            <p className="text-slate-400 mb-8">Last updated: March 2026</p>

            <div className="prose prose-invert max-w-none text-slate-300">
                <h2 className="text-xl font-bold text-white mt-8 mb-4">General Information</h2>
                <p className="mb-4">
                    All information provided on LaunchPad is for educational and informational purposes only. The information should not be taken as professional, financial, or legal advice.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">Earnings Disclaimer</h2>
                <p className="mb-4">
                    Any income or earnings statements, or examples of income or earnings, are only estimates of what we think you could earn. There is no assurance you'll do as well.
                    If you rely upon our figures, you must accept the risk of not doing as well. Success in any endeavor is based on many factors independent of our products or advice.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">Affiliate Disclaimer</h2>
                <p className="mb-4">
                    Certain links on this website may be affiliate links. This means that if you click on the link and purchase an item, we may receive an affiliate commission at no extra cost to you.
                    We only recommend products or services we believe will add value to our readers.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">External Links</h2>
                <p className="mb-4">
                    Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with LaunchPad.
                    Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                </p>
            </div>
        </div>
    );
}

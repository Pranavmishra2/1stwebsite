export const metadata = {
    title: "Contact Us | LaunchPad",
    description: "Get in touch with the LaunchPad team.",
};

export default function ContactUs() {
    return (
        <div className="container-custom" style={{ padding: "100px 0 60px", maxWidth: 600 }}>
            <h1 className="text-4xl font-bold mb-6 gradient-text text-center">Contact Us</h1>
            <p className="text-slate-400 mb-12 text-center text-lg">
                Have a question or need support? We&apos;d love to hear from you.
            </p>

            <div className="glass-card p-8">
                <form className="flex flex-col gap-6" action="mailto:hello@launchpad.dev" method="POST" encType="text/plain">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-y"
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="gradient-btn w-full mt-4 text-lg py-4">
                        Send Message
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-800 text-center">
                    <p className="text-slate-400 mb-2">Or email us directly at</p>
                    <a href="mailto:hello@launchpad.dev" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        hello@launchpad.dev
                    </a>
                </div>
            </div>
        </div>
    );
}

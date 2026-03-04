"use client";
import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings, SiteSettings } from "@/lib/settingsService";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getSiteSettings().then((s) => { setSettings(s); setLoading(false); });
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        await updateSiteSettings(settings);
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const update = (key: keyof SiteSettings, value: string) => {
        if (!settings) return;
        setSettings({ ...settings, [key]: value });
    };

    const updateSocial = (key: string, value: string) => {
        if (!settings) return;
        setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [key]: value } });
    };

    if (loading) return <div className="glass-card" style={{ padding: 48, textAlign: "center" }}><p className="gradient-text" style={{ fontWeight: 600 }}>Loading settings...</p></div>;

    return (
        <div className="page-transition">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>
                        Site <span className="gradient-text">Settings</span>
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Manage your website content and social links</p>
                </div>
                <button className="gradient-btn" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
                    {saved ? "✅ Saved!" : saving ? "Saving..." : "💾 Save Settings"}
                </button>
            </div>

            <div style={{ display: "grid", gap: 20 }}>
                {/* General */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#a855f7" }}>🏠 General</h3>
                    <div style={{ display: "grid", gap: 14 }}>
                        <Field label="Site Name" value={settings?.siteName || ""} onChange={(v) => update("siteName", v)} />
                        <Field label="Tagline" value={settings?.tagline || ""} onChange={(v) => update("tagline", v)} />
                        <Field label="Logo Text" value={settings?.logoText || ""} onChange={(v) => update("logoText", v)} placeholder="PK" />
                        <Field label="Contact Email" value={settings?.contactEmail || ""} onChange={(v) => update("contactEmail", v)} />
                    </div>
                </div>

                {/* Hero */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#22d3ee" }}>🚀 Hero Section</h3>
                    <div style={{ display: "grid", gap: 14 }}>
                        <Field label="Hero Title" value={settings?.heroTitle || ""} onChange={(v) => update("heroTitle", v)} />
                        <AreaField label="Hero Subtitle" value={settings?.heroSubtitle || ""} onChange={(v) => update("heroSubtitle", v)} rows={3} />
                    </div>
                </div>

                {/* About */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#34d399" }}>👤 About Section</h3>
                    <div style={{ display: "grid", gap: 14 }}>
                        <Field label="About Title" value={settings?.aboutTitle || ""} onChange={(v) => update("aboutTitle", v)} />
                        <AreaField label="About Description" value={settings?.aboutDescription || ""} onChange={(v) => update("aboutDescription", v)} rows={4} />
                    </div>
                </div>

                {/* Social Links */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#f472b6" }}>🔗 Social Links</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {["github", "twitter", "linkedin", "youtube", "instagram"].map((key) => (
                            <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={(settings?.socialLinks as Record<string, string>)?.[key] || ""} onChange={(v) => updateSocial(key, v)} placeholder={`https://${key}.com/your-profile`} />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#facc15" }}>📄 Footer</h3>
                    <Field label="Footer Copyright Text" value={settings?.footerText || ""} onChange={(v) => update("footerText", v)} />
                </div>
            </div>
        </div>
    );
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(99,102,241,0.15)", background: "rgba(15,15,20,0.6)", color: "#f1f5f9", fontSize: "0.88rem", outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" };

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return <div><label style={labelStyle}>{label}</label><input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} /></div>;
}
function AreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
    return <div><label style={labelStyle}>{label}</label><textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} style={{ ...inputStyle, resize: "vertical" as const }} /></div>;
}

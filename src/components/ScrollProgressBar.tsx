"use client";
import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(scrollPercent);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "3px",
                zIndex: 200,
                background: "transparent",
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #6366f1, #a855f7, #22d3ee)",
                    borderRadius: "0 2px 2px 0",
                    transition: "width 0.1s linear",
                    boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
                }}
            />
        </div>
    );
}

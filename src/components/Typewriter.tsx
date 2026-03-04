"use client";
import { useState, useEffect, useCallback } from "react";

interface TypewriterProps {
    texts: string[];
    speed?: number;
    deleteSpeed?: number;
    pauseTime?: number;
}

export default function Typewriter({ texts, speed = 80, deleteSpeed = 40, pauseTime = 2000 }: TypewriterProps) {
    const [displayText, setDisplayText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const tick = useCallback(() => {
        const currentText = texts[textIndex];

        if (!isDeleting) {
            setDisplayText(currentText.substring(0, displayText.length + 1));
            if (displayText.length === currentText.length) {
                setTimeout(() => setIsDeleting(true), pauseTime);
                return;
            }
        } else {
            setDisplayText(currentText.substring(0, displayText.length - 1));
            if (displayText.length === 0) {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
                return;
            }
        }
    }, [displayText, isDeleting, textIndex, texts, pauseTime]);

    useEffect(() => {
        const timeout = setTimeout(tick, isDeleting ? deleteSpeed : speed);
        return () => clearTimeout(timeout);
    }, [tick, isDeleting, deleteSpeed, speed]);

    return (
        <span>
            {displayText}
            <span
                style={{
                    display: "inline-block",
                    width: "2px",
                    height: "1em",
                    background: "linear-gradient(180deg, #6366f1, #a855f7)",
                    marginLeft: "4px",
                    verticalAlign: "text-bottom",
                    animation: "blink 1s step-end infinite",
                }}
            />
            <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
        </span>
    );
}

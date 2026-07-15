"use client";
import { useEffect, useState } from "react";

type Remaining = { days: number; hours: number; mins: number; secs: number; done: boolean };

function diff(target: number): Remaining {
  const ms = target - Date.now();
  if (ms <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true };
  const secs = Math.floor(ms / 1000);
  return {
    days: Math.floor(secs / 86400),
    hours: Math.floor((secs % 86400) / 3600),
    mins: Math.floor((secs % 3600) / 60),
    secs: secs % 60,
    done: false,
  };
}

/** Live countdown to the submission deadline. Renders nothing until mounted to
 *  avoid an SSR/CSR mismatch (the clock only exists in the browser). */
export default function Countdown({ deadline }: { deadline: string }) {
  const target = new Date(deadline).getTime();
  const [r, setR] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setR(diff(target));
    // rAF for the first paint (avoids a synchronous setState in the effect body
    // and an SSR/CSR hydration mismatch), then tick every second.
    const raf = requestAnimationFrame(tick);
    const t = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
    };
  }, [target]);

  const boxes: { num: number; label: string }[] = r
    ? [
        { num: r.days, label: "Days" },
        { num: r.hours, label: "Hours" },
        { num: r.mins, label: "Minutes" },
        { num: r.secs, label: "Seconds" },
      ]
    : [
        { num: 0, label: "Days" },
        { num: 0, label: "Hours" },
        { num: 0, label: "Minutes" },
        { num: 0, label: "Seconds" },
      ];

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {boxes.map((b) => (
          <div
            key={b.label}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 10,
              padding: "10px 18px",
              textAlign: "center",
              minWidth: 84,
              color: "#fff",
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
              {String(b.num).padStart(2, "0")}
            </div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, opacity: 0.8 }}>
              {b.label}
            </div>
          </div>
        ))}
      </div>
      {r?.done && (
        <div style={{ marginTop: 10, color: "#fff", fontWeight: 600, fontSize: 13 }}>
          The submission window has closed. Contact the editorial office for late-submission inquiries.
        </div>
      )}
    </div>
  );
}

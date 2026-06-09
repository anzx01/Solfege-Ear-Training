"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";

const WAITLIST_KEY = "solfege.pro.waitlist.v1";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type SubmitStatus = "idle" | "invalid" | "consent" | "sending" | "saved" | "failed";

function saveEmail(email: string) {
  try {
    const raw = window.localStorage.getItem(WAITLIST_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    const next = Array.from(new Set([...list, email]));
    window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(next));
  } catch {
    // The form still confirms locally if storage is unavailable.
  }
}

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  // 如果没有配置 Web3Forms key，禁用表单
  const isConfigured = Boolean(WEB3FORMS_ACCESS_KEY);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured) {
      setStatus("failed");
      return;
    }

    const form = event.currentTarget;
    const normalized = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setStatus("invalid");
      return;
    }

    if (!consent) {
      setStatus("consent");
      return;
    }

    // 蜜罐：真实用户不会勾选这个隐藏字段，被勾选则当作机器人静默丢弃。
    const botField = form.elements.namedItem("botcheck");
    if (botField instanceof HTMLInputElement && botField.checked) {
      setStatus("saved");
      return;
    }

    setStatus("sending");

    try {
      const payload = new FormData();
      payload.append("access_key", WEB3FORMS_ACCESS_KEY);
      payload.append("subject", "New Solfege Ear Trainer Pro waitlist signup");
      payload.append("from_name", "Solfege Ear Trainer");
      payload.append("email", normalized);
      payload.append("message", `New Pro waitlist signup: ${normalized}`);
      payload.append("source", typeof window !== "undefined" ? window.location.href : "Unknown page");
      payload.append("submitted_at", new Date().toISOString());

      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: payload
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Waitlist submission failed.");
      }

      saveEmail(normalized);
      setEmail("");
      setConsent(false);
      setStatus("saved");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <form className="waitlist-form" onSubmit={onSubmit}>
      <label htmlFor="waitlist-email">Email</label>
      <div className="inline-form-row">
        <input
          id="waitlist-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          name="email"
          disabled={status === "sending" || !isConfigured}
        />
        <button
          className="button primary"
          type="submit"
          disabled={status === "sending" || !consent || !isConfigured}
        >
          <Mail size={18} aria-hidden="true" />
          {status === "sending" ? "Sending" : "Join waitlist"}
        </button>
      </div>

      {/* 蜜罐字段：视觉隐藏，仅机器人会填写。 */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
      />

      <label className="consent-row">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          disabled={status === "sending" || !isConfigured}
        />
        <span>
          I agree that my email is sent through Web3Forms so the site owner can contact me about the
          Pro waitlist.
        </span>
      </label>

      <p className="form-status" aria-live="polite">
        {!isConfigured ? "Waitlist form is not configured." : null}
        {status === "invalid" ? "Enter a valid email address." : null}
        {status === "idle" && !consent ? "Please agree before joining the waitlist." : null}
        {status === "consent" ? "Please agree before joining the waitlist." : null}
        {status === "sending" ? "Sending your signup..." : null}
        {status === "saved" ? "You are on the Pro waitlist." : null}
        {status === "failed" ? "Could not send. Please try again." : null}
      </p>
    </form>
  );
}

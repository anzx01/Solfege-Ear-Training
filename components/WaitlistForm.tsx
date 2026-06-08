"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";

const WAITLIST_KEY = "solfege.pro.waitlist.v1";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "566f89c1-80c0-4fd7-97ea-f2c9aa4694fe";

type SubmitStatus = "idle" | "invalid" | "sending" | "saved" | "failed";

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
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setStatus("invalid");
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
          disabled={status === "sending"}
        />
        <button className="button primary" type="submit" disabled={status === "sending"}>
          <Mail size={18} aria-hidden="true" />
          {status === "sending" ? "Sending" : "Join waitlist"}
        </button>
      </div>
      <p className="form-status" aria-live="polite">
        {status === "invalid" ? "Enter a valid email address." : null}
        {status === "sending" ? "Sending your signup..." : null}
        {status === "saved" ? "You are on the Pro waitlist." : null}
        {status === "failed" ? "Could not send. Please try again." : null}
      </p>
    </form>
  );
}

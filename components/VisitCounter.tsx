"use client";

import { useEffect, useState } from "react";

const SESSION_KEY_PREFIX = "solfege-ear-trainer-visit-counted";

type VisitCounts = {
  date: string;
  today: number;
  total: number;
};

function getShanghaiDateKey() {
  return new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function getSessionKey() {
  return `${SESSION_KEY_PREFIX}:${getShanghaiDateKey()}`;
}

function hasCountedThisSession() {
  try {
    return window.sessionStorage.getItem(getSessionKey()) === "1";
  } catch {
    return false;
  }
}

function markCountedThisSession() {
  try {
    window.sessionStorage.setItem(getSessionKey(), "1");
  } catch {
    // Some privacy modes block storage. The counter can still display the latest value.
  }
}

async function readVisitCounts(response: Response): Promise<VisitCounts> {
  if (!response.ok) {
    throw new Error("Visit counter request failed");
  }

  const data: unknown = await response.json();
  if (
    typeof data !== "object" ||
    data === null ||
    !("today" in data) ||
    !("total" in data) ||
    !("date" in data) ||
    typeof data.today !== "number" ||
    typeof data.total !== "number" ||
    typeof data.date !== "string"
  ) {
    throw new Error("Visit counter response was malformed");
  }

  return {
    date: data.date,
    today: data.today,
    total: data.total
  };
}

export function VisitCounter() {
  const [counts, setCounts] = useState<VisitCounts | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const alreadyCounted = hasCountedThisSession();

    fetch("/api/visits", {
      method: alreadyCounted ? "GET" : "POST",
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    })
      .then(readVisitCounts)
      .then((nextCounts) => {
        if (!isMounted) {
          return;
        }

        if (!alreadyCounted) {
          markCountedThisSession();
        }

        setCounts(nextCounts);
        setIsAvailable(true);
      })
      .catch(() => {
        if (isMounted) {
          setIsAvailable(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAvailable || counts === null) {
    return null;
  }

  const formatter = new Intl.NumberFormat("en-US");

  return (
    <dl className="visit-counter" aria-label="Visit counts" aria-live="polite">
      <div>
        <dt>Today</dt>
        <dd>{formatter.format(counts.today)}</dd>
      </div>
      <div>
        <dt>Total</dt>
        <dd>{formatter.format(counts.total)}</dd>
      </div>
    </dl>
  );
}

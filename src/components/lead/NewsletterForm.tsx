"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-2 border-[#002D63] bg-white p-4 text-center">
        <p className="font-display font-bold text-[#002D63]">Te has suscrito correctamente.</p>
        <p className="mt-2 font-serif text-sm text-[#1a1a1a]">
          Recibirás nuestro resumen semanal del mercado industrial.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        required
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border-2 border-[#1a1a1a] px-4 py-3 font-serif text-sm focus:border-[#FF6B35] focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-[#FF6B35] px-5 py-3 font-sans text-sm font-bold text-white uppercase tracking-wide transition-colors hover:bg-[#002D63] disabled:opacity-50"
      >
        {status === "loading" ? "..." : "Suscribirse"}
      </button>
      {status === "error" && (
        <p className="font-sans text-xs text-[#FF6B35]">
          Error al suscribirse. Intenta de nuevo.
        </p>
      )}
    </form>
  );
}

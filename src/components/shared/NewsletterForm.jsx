"use client";

export default function NewsletterForm() {
  return (
    <form
      className="flex flex-col sm:flex-row w-full max-w-md gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Your email address"
        className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-3.5 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
      />
      <button
        type="submit"
        className="bg-[#D4AF37] text-[#111111] px-7 py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-white transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}

'use client';

export function NewsletterForm() {
  return (
    <form className="mx-auto mt-6 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="you@email.com"
        className="flex-1 rounded-lg border-0 bg-white/20 px-4 py-3 text-white
                   placeholder:text-white/60 backdrop-blur-sm focus:bg-white/30
                   focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Email for newsletter"
      />
      <button
        type="submit"
        className="rounded-lg bg-white px-6 py-3 font-medium text-brand-600
                   transition-colors hover:bg-white/90"
      >
        Subscribe
      </button>
    </form>
  );
}

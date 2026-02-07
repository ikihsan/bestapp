'use client';

import { useState } from 'react';
import { Send, Upload, Loader2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

const PRICING_OPTIONS = [
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
];

export default function SubmitToolPage() {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    category: '',
    tags: '',
    tagline: '',
    description: '',
    pricing: 'free',
    contactEmail: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/submit-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();
      setResult({
        success: res.ok,
        message: data.message || data.error || 'Something went wrong',
      });

      if (res.ok) {
        setFormData({
          name: '',
          website: '',
          category: '',
          tags: '',
          tagline: '',
          description: '',
          pricing: 'free',
          contactEmail: '',
        });
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className="mx-auto max-w-narrow px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="font-heading text-heading-1 font-bold text-on-surface">Submit a Tool</h1>
        <p className="mt-2 text-body text-on-surface-muted">
          Know a great AI tool? Submit it for review and help others discover it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-body-sm font-medium text-on-surface">
            Tool Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-body
                       text-on-surface placeholder:text-on-surface-muted focus:border-brand-500
                       focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="e.g. ChatGPT"
          />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-body-sm font-medium text-on-surface">
            Website URL *
          </label>
          <input
            id="website"
            name="website"
            type="url"
            required
            value={formData.website}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-body
                       text-on-surface placeholder:text-on-surface-muted focus:border-brand-500
                       focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="https://example.com"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-body-sm font-medium text-on-surface">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-body
                       text-on-surface focus:border-brand-500 focus:outline-none focus:ring-2
                       focus:ring-brand-500/20"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-body-sm font-medium text-on-surface">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-body
                       text-on-surface placeholder:text-on-surface-muted focus:border-brand-500
                       focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="chatbot, writing, marketing (comma-separated)"
          />
        </div>

        {/* Tagline */}
        <div>
          <label htmlFor="tagline" className="block text-body-sm font-medium text-on-surface">
            Tagline *
          </label>
          <input
            id="tagline"
            name="tagline"
            type="text"
            required
            value={formData.tagline}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-body
                       text-on-surface placeholder:text-on-surface-muted focus:border-brand-500
                       focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="A short one-liner about the tool"
            maxLength={200}
          />
          <p className="mt-1 text-caption text-on-surface-muted">
            {formData.tagline.length}/200 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-body-sm font-medium text-on-surface">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-body
                       text-on-surface placeholder:text-on-surface-muted focus:border-brand-500
                       focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-y"
            placeholder="Describe what the tool does, who it's for, and what makes it unique."
          />
        </div>

        {/* Pricing */}
        <div>
          <label htmlFor="pricing" className="block text-body-sm font-medium text-on-surface">
            Pricing *
          </label>
          <select
            id="pricing"
            name="pricing"
            value={formData.pricing}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-body
                       text-on-surface focus:border-brand-500 focus:outline-none focus:ring-2
                       focus:ring-brand-500/20"
          >
            {PRICING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Contact email */}
        <div>
          <label htmlFor="contactEmail" className="block text-body-sm font-medium text-on-surface">
            Contact Email (optional)
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-body
                       text-on-surface placeholder:text-on-surface-muted focus:border-brand-500
                       focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="your@email.com"
          />
          <p className="mt-1 text-caption text-on-surface-muted">
            We&apos;ll let you know when your tool is approved.
          </p>
        </div>

        {/* Screenshot Upload placeholder */}
        <div>
          <label
            htmlFor="screenshot-upload"
            className="block text-body-sm font-medium text-on-surface"
          >
            Screenshot (optional)
          </label>
          <div
            className="mt-1.5 flex items-center justify-center rounded-lg border-2 border-dashed border-border
                          bg-surface-raised p-8 text-center transition-colors hover:border-brand-300"
          >
            <div>
              <input
                id="screenshot-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
              />
              <Upload className="mx-auto h-8 w-8 text-on-surface-muted" />
              <p className="mt-2 text-body-sm text-on-surface-muted">
                Cloudinary upload widget will be integrated here
              </p>
              <p className="mt-1 text-caption text-on-surface-muted">PNG, JPG, or WebP up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Result message */}
        {result && (
          <div
            className={`rounded-lg p-4 text-body-sm ${
              result.success
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}
            role="alert"
          >
            {result.message}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5
                     font-medium text-on-brand transition-colors hover:bg-brand-600
                     disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Tool for Review
            </>
          )}
        </button>

        <p className="text-center text-caption text-on-surface-muted">
          By submitting, you agree to our review process. Submissions are typically reviewed within
          48 hours.
        </p>
      </form>
    </section>
  );
}

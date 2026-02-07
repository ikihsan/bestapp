'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Shield, CheckCircle, XCircle, Eye, Star, BarChart3, LogIn, Loader2 } from 'lucide-react';

interface PendingSubmission {
  id: string;
  payload: {
    name: string;
    website: string;
    tagline: string;
    categories: string[];
  };
  submitterEmail: string | null;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Mock submissions for demo
const MOCK_SUBMISSIONS: PendingSubmission[] = [
  {
    id: 'sub_001',
    payload: {
      name: 'CoolAI Writer',
      website: 'https://coolaiwriter.com',
      tagline: 'AI-powered creative writing assistant for fiction authors.',
      categories: ['writing'],
    },
    submitterEmail: 'user@example.com',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'pending',
  },
  {
    id: 'sub_002',
    payload: {
      name: 'PixelForge AI',
      website: 'https://pixelforge.ai',
      tagline: 'Generate game-ready pixel art with AI in seconds.',
      categories: ['image'],
    },
    submitterEmail: null,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'pending',
  },
  {
    id: 'sub_003',
    payload: {
      name: 'VoiceClone Pro',
      website: 'https://voiceclonepro.io',
      tagline: 'Professional voice cloning for podcasters and content creators.',
      categories: ['video'],
    },
    submitterEmail: 'creator@podcast.com',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    status: 'pending',
  },
];

export default function AdminPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [submissions, setSubmissions] = useState<PendingSubmission[]>(MOCK_SUBMISSIONS);
  const [activeTab, setActiveTab] = useState<'queue' | 'analytics'>('queue');

  // In production, check if user has admin role via Firestore

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-narrow px-4 py-20 text-center sm:px-6">
        <Shield className="mx-auto h-16 w-16 text-brand-500" />
        <h1 className="mt-4 font-heading text-heading-1 font-bold text-on-surface">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-body text-on-surface-muted">
          Sign in with an admin account to access the moderation dashboard.
        </p>
        <button
          onClick={signInWithGoogle}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3
                     font-medium text-on-brand transition-colors hover:bg-brand-600"
        >
          <LogIn className="h-5 w-5" />
          Sign in with Google
        </button>
      </section>
    );
  }

  const handleApprove = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved' as const } : s)),
    );
  };

  const handleReject = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' as const } : s)),
    );
  };

  const pending = submissions.filter((s) => s.status === 'pending');
  const reviewed = submissions.filter((s) => s.status !== 'pending');

  return (
    <section className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-brand-500" />
          <div>
            <h1 className="font-heading text-heading-2 font-bold text-on-surface">
              Admin Dashboard
            </h1>
            <p className="text-body-sm text-on-surface-muted">
              Welcome, {user.displayName || user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-lg bg-surface-raised p-1">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex-1 rounded-md px-4 py-2.5 text-body-sm font-medium transition-colors ${
            activeTab === 'queue'
              ? 'bg-surface text-on-surface shadow-card'
              : 'text-on-surface-muted hover:text-on-surface'
          }`}
        >
          Moderation Queue ({pending.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 rounded-md px-4 py-2.5 text-body-sm font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'bg-surface text-on-surface shadow-card'
              : 'text-on-surface-muted hover:text-on-surface'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Queue */}
      {activeTab === 'queue' && (
        <div className="mt-6 space-y-4">
          {pending.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface-raised p-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
              <p className="mt-3 text-body text-on-surface-muted">
                All caught up! No pending submissions.
              </p>
            </div>
          ) : (
            pending.map((sub) => (
              <div
                key={sub.id}
                className="rounded-xl border border-border bg-surface p-5 shadow-card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-heading-4 font-semibold text-on-surface">
                      {sub.payload.name}
                    </h3>
                    <p className="mt-1 text-body-sm text-on-surface-muted">{sub.payload.tagline}</p>
                    <div className="mt-2 flex items-center gap-3 text-caption text-on-surface-muted">
                      <a
                        href={sub.payload.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-500 hover:underline"
                      >
                        {sub.payload.website}
                      </a>
                      <span>•</span>
                      <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                      {sub.submitterEmail && (
                        <>
                          <span>•</span>
                          <span>{sub.submitterEmail}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(sub.id)}
                      className="rounded-lg bg-emerald-500 px-4 py-2 text-body-sm font-medium
                                 text-white transition-colors hover:bg-emerald-600"
                    >
                      <CheckCircle className="inline-block h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(sub.id)}
                      className="rounded-lg bg-red-500 px-4 py-2 text-body-sm font-medium
                                 text-white transition-colors hover:bg-red-600"
                    >
                      <XCircle className="inline-block h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {reviewed.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-heading-3 font-semibold text-on-surface">
                Recently Reviewed
              </h2>
              <div className="mt-4 space-y-2">
                {reviewed.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-raised p-4"
                  >
                    <span className="text-body-sm text-on-surface">{sub.payload.name}</span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-caption font-medium ${
                        sub.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Tools', value: '10', icon: Star },
            { label: 'Total Views', value: '303.2k', icon: Eye },
            { label: 'Submissions', value: '3', icon: BarChart3 },
            { label: 'Avg Rating', value: '4.55', icon: Star },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface p-5 shadow-card"
            >
              <div className="flex items-center gap-2 text-on-surface-muted">
                <stat.icon className="h-5 w-5" />
                <span className="text-body-sm">{stat.label}</span>
              </div>
              <div className="mt-2 text-heading-2 font-bold text-on-surface">{stat.value}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

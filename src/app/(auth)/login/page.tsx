'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError('Invalid email or password.');
      return;
    }

    router.push('/today');
    router.refresh();
  }

  return (
    <div className="ambient-drift" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 320,
        background: 'var(--cream)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-3)',
        padding: '28px 24px',
      }}>
        <h1 style={{
          fontSize: 15,
          fontStyle: 'italic',
          fontWeight: 400,
          color: 'var(--ink)',
          marginBottom: 32,
          textAlign: 'center',
        }}>
          second brain
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{
              border: '1px solid var(--line2)',
              borderRadius: 7,
              padding: '8px 12px',
              fontSize: 14,
              fontFamily: 'Newsreader, Georgia, serif',
              background: 'var(--cream)',
              color: 'var(--ink)',
              outline: 'none',
              width: '100%',
            }}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              border: '1px solid var(--line2)',
              borderRadius: 7,
              padding: '8px 12px',
              fontSize: 14,
              fontFamily: 'Newsreader, Georgia, serif',
              background: 'var(--cream)',
              color: 'var(--ink)',
              outline: 'none',
              width: '100%',
            }}
          />

          {error && (
            <p style={{
              fontSize: 12,
              fontStyle: 'italic',
              color: 'var(--red)',
              marginTop: 0,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              background: loading ? 'transparent' : 'var(--ink)',
              color: loading ? 'var(--ink4)' : 'var(--text-inverse)',
              border: loading ? '1px solid var(--line)' : 'none',
              borderRadius: 99,
              padding: '8px 24px',
              fontSize: 13,
              fontFamily: 'Newsreader, Georgia, serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 80ms ease',
            }}
          >
            {loading ? 'signing in...' : 'sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

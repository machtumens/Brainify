'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/today', label: 'today' },
  { href: '/goals', label: 'goals' },
  { href: '/test-sim', label: 'test sim' },
  { href: '/ask-ai', label: 'ask ai' },
  { href: '/textbooks', label: 'textbooks' },
] as const;

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Nav() {
  const pathname = usePathname();
  const today = formatDate(new Date());

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '12px 24px',
        borderBottom: '1px solid var(--line)',
        background: 'var(--cream)',
      }}
      aria-label="Main navigation"
    >
      <span
        style={{
          fontSize: 15,
          fontStyle: 'italic',
          fontWeight: 400,
          color: 'var(--ink)',
          marginRight: 'auto',
        }}
      >
        second brain
      </span>

      {NAV_ITEMS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: active ? 'var(--ink)' : 'var(--ink2)',
              padding: '5px 12px',
              borderRadius: 99,
              border: active ? '1px solid var(--line2)' : '1px solid transparent',
              background: active ? 'var(--cream3)' : 'transparent',
              textDecoration: 'none',
              transition: 'background var(--t-fast), border-color var(--t-fast), color var(--t-fast)',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 44,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Link>
        );
      })}

      <span
        style={{
          fontSize: 12,
          fontStyle: 'italic',
          color: 'var(--ink4)',
          marginLeft: 12,
          whiteSpace: 'nowrap',
        }}
      >
        {today}
      </span>
    </nav>
  );
}

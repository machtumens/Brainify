'use client';

// BookList — US-017 | Sprint 5 | WBS 6.1 | P21
// Renders registered textbooks. Empty state when none.

import BookItem from './BookItem';
import type { TextbookRow } from '@/types/database';

interface Props {
  books: TextbookRow[];
  onPageUpdate: (id: string, page: number) => void;
}

export default function BookList({ books, onPageUpdate }: Props) {
  if (books.length === 0) {
    return (
      <p
        style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink3)', margin: 0 }}
        data-testid="books-empty"
      >
        No books registered yet.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} aria-label="Registered textbooks">
      {books.map((book) => (
        <BookItem key={book.id} book={book} onPageUpdate={onPageUpdate} />
      ))}
    </div>
  );
}

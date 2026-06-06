import { redirect } from 'next/navigation';

// Middleware handles auth guard. If authenticated, redirect to Today view.
export default function Home() {
  redirect('/today');
}

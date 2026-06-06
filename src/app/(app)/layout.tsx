import Nav from '@/components/shared/Nav';
import CaptureBar from '@/components/shared/CaptureBar';

// Authenticated layout — wraps all (app)/* routes.
// Nav + CaptureBar always mounted. CaptureBar never in individual views.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <CaptureBar />
    </div>
  );
}

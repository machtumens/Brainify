import Nav from '@/components/shared/Nav';
import CaptureBar from '@/components/shared/CaptureBar';
import MotionProvider from '@/components/shared/MotionProvider';

// Authenticated layout — wraps all (app)/* routes.
// Nav + CaptureBar always mounted. CaptureBar never in individual views.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Nav />
        {/* Flex column so full-height views (Ask AI chat) can fill the space
            between Nav and CaptureBar without magic-number calc() heights. */}
        <main style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <CaptureBar />
      </div>
    </MotionProvider>
  );
}

'use client';
// Test Simulator page — 4-phase state machine: setup | generating | active | submitted
// Sprint 5 | US-014, US-015 | P19, P20

import { useCallback, useState } from 'react';
import TopicGrid from '@/components/test-sim/TopicGrid';
import DifficultySelector from '@/components/test-sim/DifficultySelector';
import SourceHealthSidebar from '@/components/test-sim/SourceHealthSidebar';
import TestRunner from '@/components/test-sim/TestRunner';
import TestHistory from '@/components/test-sim/TestHistory';
import { DEFAULT_DIFFICULTY, type DifficultyLevel } from '@/utils/difficultyDefaults';
import type { Question, TestResultSummary } from '@/types/test';

type PagePhase = 'setup' | 'generating' | 'active' | 'submitted';

const SECTION_LABEL: React.CSSProperties = {
  margin: '0 0 12px',
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: 'var(--ink4)',
  fontFamily: 'Newsreader, serif',
  fontWeight: 400,
};

const CARD: React.CSSProperties = {
  border: '1px solid var(--line)',
  borderRadius: 11,
  background: 'var(--cream)',
  padding: '14px 16px',
};

export default function TestSimPage() {
  const [phase, setPhase]               = useState<PagePhase>('setup');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty]     = useState<DifficultyLevel>(DEFAULT_DIFFICULTY);
  const [questions, setQuestions]       = useState<Question[]>([]);
  const [result, setResult]             = useState<TestResultSummary | null>(null);
  const [errorMsg, setErrorMsg]         = useState<string | null>(null);

  const handleToggle = useCallback((topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  }, []);

  const handleGenerate = useCallback(async () => {
    if (selectedTopics.length === 0) return;
    setPhase('generating');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: selectedTopics, difficulty, count: 5 }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.error ?? 'Generation failed');
        setPhase('setup');
        return;
      }
      setQuestions(json.data.questions);
      setPhase('active');
    } catch {
      setErrorMsg('Network error — please try again');
      setPhase('setup');
    }
  }, [selectedTopics, difficulty]);

  const handleComplete = useCallback((r: TestResultSummary) => {
    setResult(r);
    setPhase('submitted');
  }, []);

  const handleReset = useCallback(() => {
    setPhase('setup');
    setQuestions([]);
    setResult(null);
    setErrorMsg(null);
  }, []);

  return (
    <div style={{ padding: '20px 24px' }}>
      <h2 style={{
        fontSize: 14, fontWeight: 300, fontStyle: 'italic',
        color: 'var(--ink)', fontFamily: 'Newsreader, serif', marginBottom: 24,
      }}>
        Test Simulator
      </h2>

      {/* ── ACTIVE: full-width TestRunner ── */}
      {phase === 'active' && (
        <TestRunner
          questions={questions}
          topics={selectedTopics}
          difficulty={difficulty}
          onComplete={handleComplete}
          onReset={handleReset}
        />
      )}

      {/* ── SUBMITTED: score summary + history ── */}
      {phase === 'submitted' && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={CARD}>
            <p style={{
              margin: '0 0 6px', fontSize: 14, fontStyle: 'italic',
              color: 'var(--ink)', fontFamily: 'Newsreader, serif',
            }}>
              {result.score} / {result.total} correct
            </p>
            <p style={{
              margin: 0, fontSize: 12, fontStyle: 'italic',
              color: 'var(--ink3)', fontFamily: 'Newsreader, serif',
            }}>
              {result.wrong_ids.length > 0
                ? `${result.wrong_ids.length} mistake${result.wrong_ids.length > 1 ? 's' : ''} logged to your error log — confusion map updated`
                : 'No mistakes — clean run'}
            </p>
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: '10px 24px', borderRadius: 99,
              border: '1px solid var(--line2)', background: 'transparent',
              color: 'var(--ink)', fontFamily: 'Newsreader, serif',
              fontSize: 13, fontStyle: 'italic', cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            New test
          </button>
          <div style={CARD}>
            <p style={SECTION_LABEL}>Past tests</p>
            <TestHistory />
          </div>
        </div>
      )}

      {/* ── SETUP / GENERATING: two-column layout ── */}
      {(phase === 'setup' || phase === 'generating') && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 272px', gap: 24, alignItems: 'start',
        }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={CARD}>
              <TopicGrid selectedTopics={selectedTopics} onToggle={handleToggle} />
            </div>
            <div style={CARD}>
              <DifficultySelector value={difficulty} onChange={setDifficulty} />
            </div>

            <button
              onClick={handleGenerate}
              disabled={selectedTopics.length === 0 || phase === 'generating'}
              aria-label="Generate test questions"
              style={{
                width: '100%', padding: '12px 24px', borderRadius: 99, border: 'none',
                background: selectedTopics.length === 0 ? 'var(--cream3)' : 'var(--ink)',
                color: selectedTopics.length === 0 ? 'var(--ink4)' : 'white',
                fontFamily: 'Newsreader, serif', fontSize: 14, fontStyle: 'italic',
                cursor: selectedTopics.length === 0 || phase === 'generating' ? 'not-allowed' : 'pointer',
                transition: 'background 80ms ease',
              }}
            >
              {phase === 'generating'
                ? 'Generating…'
                : selectedTopics.length === 0
                ? 'Select topics to generate'
                : 'Generate test'}
            </button>

            {errorMsg && (
              <p style={{
                margin: 0, fontSize: 13, fontStyle: 'italic',
                color: 'var(--red)', fontFamily: 'Newsreader, serif',
              }}>
                {errorMsg}
              </p>
            )}

            {phase === 'generating' && (
              <div aria-label="Loading questions" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 120, borderRadius: 11 }} />
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SourceHealthSidebar selectedTopics={selectedTopics} />
            <div style={CARD}>
              <p style={SECTION_LABEL}>Past tests</p>
              <TestHistory />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

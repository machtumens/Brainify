'use client';
// Test Simulator page — 4-phase state machine: setup | generating | active | submitted
// Sprint 5 | US-014, US-015 | P19, P20

import { useCallback, useState } from 'react';
import TopicGrid from '@/components/test-sim/TopicGrid';
import DifficultySelector from '@/components/test-sim/DifficultySelector';
import SourceHealthSidebar from '@/components/test-sim/SourceHealthSidebar';
import TestRunner from '@/components/test-sim/TestRunner';
import TestHistory from '@/components/test-sim/TestHistory';
import PostMortemList from '@/components/test-sim/PostMortemList';
import PageShell from '@/components/shared/primitives/PageShell';
import Card from '@/components/shared/primitives/Card';
import SectionLabel from '@/components/shared/primitives/SectionLabel';
import StatNumber from '@/components/shared/primitives/StatNumber';
import PillButton from '@/components/shared/primitives/PillButton';
import Skeleton from '@/components/shared/primitives/Skeleton';
import InlineMessage from '@/components/shared/primitives/InlineMessage';
import { DEFAULT_DIFFICULTY, suggestDifficulty, type DifficultyLevel } from '@/utils/difficultyDefaults';
import type { Question, TestResultSummary } from '@/types/test';
import { useEffect, useRef } from 'react';

type PagePhase = 'setup' | 'generating' | 'active' | 'submitted';

export default function TestSimPage() {
  const [phase, setPhase]               = useState<PagePhase>('setup');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty]     = useState<DifficultyLevel>(DEFAULT_DIFFICULTY);
  const [questions, setQuestions]       = useState<Question[]>([]);
  const [result, setResult]             = useState<TestResultSummary | null>(null);
  const [errorMsg, setErrorMsg]         = useState<string | null>(null);

  // Difficulty dial (v1.1): >85% recent accuracy auto-bumps the default —
  // only until the user touches the selector themselves.
  const userTouchedDifficulty = useRef(false);
  useEffect(() => {
    fetch('/api/test-results')
      .then((r) => r.json())
      .then((json) => {
        if (!json.success || userTouchedDifficulty.current) return;
        const suggested = suggestDifficulty(json.data ?? []);
        if (suggested !== DEFAULT_DIFFICULTY) setDifficulty(suggested);
      })
      .catch(() => { /* dial is a nicety — default stands */ });
  }, []);

  const handleDifficultyChange = useCallback((d: DifficultyLevel) => {
    userTouchedDifficulty.current = true;
    setDifficulty(d);
  }, []);

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
    <PageShell title="Test Simulator" width="full">
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
          <Card>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6 }}>
              <StatNumber value={`${result.score} / ${result.total}`} label="correct" />
            </div>
            <p style={{
              margin: 0, fontSize: 'var(--fs-caption)', fontStyle: 'italic',
              color: 'var(--text-secondary)', fontFamily: 'Newsreader, serif',
            }}>
              {result.wrong_ids.length > 0
                ? `${result.wrong_ids.length} mistake${result.wrong_ids.length > 1 ? 's' : ''} logged to your error log — confusion map updated`
                : 'No mistakes — clean run'}
            </p>
          </Card>
          {result.wrong_map && Object.keys(result.wrong_map).length > 0 && (
            <PostMortemList questions={questions} wrongMap={result.wrong_map} />
          )}
          <PillButton onClick={handleReset} style={{ alignSelf: 'flex-start' }}>
            New test
          </PillButton>
          <Card>
            <SectionLabel as="h2">Past tests</SectionLabel>
            <TestHistory />
          </Card>
        </div>
      )}

      {/* ── SETUP / GENERATING: responsive sidebar layout (ADR-015 §5) ── */}
      {(phase === 'setup' || phase === 'generating') && (
        <div className="layout-sidebar" style={{ padding: 0 }}>
          {/* Left column */}
          <div className="layout-sidebar__main">
            <Card>
              <TopicGrid selectedTopics={selectedTopics} onToggle={handleToggle} />
            </Card>
            <Card>
              <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
            </Card>

            <PillButton
              variant="primary"
              onClick={handleGenerate}
              disabled={selectedTopics.length === 0 || phase === 'generating'}
              aria-label="Generate test questions"
              style={{ width: '100%', padding: '12px 24px', fontSize: 'var(--fs-body)' }}
            >
              {phase === 'generating'
                ? 'Generating…'
                : selectedTopics.length === 0
                ? 'Select topics to generate'
                : `Generate test · ${selectedTopics.length} topic${selectedTopics.length > 1 ? 's' : ''}`}
            </PillButton>

            {errorMsg && <InlineMessage tone="error">{errorMsg}</InlineMessage>}

            {phase === 'generating' && (
              <div aria-label="Loading questions" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} height={120} style={{ borderRadius: 'var(--r-card)' }} />
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="layout-sidebar__aside">
            <SourceHealthSidebar selectedTopics={selectedTopics} />
            <Card>
              <SectionLabel as="h2">Past tests</SectionLabel>
              <TestHistory />
            </Card>
          </div>
        </div>
      )}
    </PageShell>
  );
}

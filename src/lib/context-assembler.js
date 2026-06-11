import { createServiceClient } from './supabase';

// Token limits per principles.md §8:
// goals: last 7 days active only
// sessions: last 14 records
// errors: top 20 by frequency (grouped + counted)
// captures: last 30 days
// textbooks: current chapter only (not full topic_map)
// Total target: < 50,000 tokens

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

async function fetchGoals(db) {
  const { data, error } = await db
    .from('goals')
    .select('id, title, category, status, current_month, roadmap')
    .in('status', ['active', 'locked'])
    .order('created_at', { ascending: false });
  if (error) { return []; }
  return (data ?? []).map((g) => ({
    ...g,
    roadmap: g.roadmap ?? null,
  }));
}

async function fetchSessions(db) {
  const { data, error } = await db
    .from('sessions')
    .select('id, task_title, subject, pomodoros, difficulty, mode, notes, started_at')
    .order('started_at', { ascending: false })
    .limit(14);
  if (error) { return []; }
  return data ?? [];
}

async function fetchErrors(db) {
  const { data, error } = await db
    .from('errors')
    .select('topic, subtopic, problem_type')
    .order('flagged_at', { ascending: false });
  if (error) { return []; }

  // Group by topic+subtopic+problem_type and count frequency
  const freqMap = new Map();
  for (const e of (data ?? [])) {
    const key = `${e.topic}|${e.subtopic}|${e.problem_type}`;
    freqMap.set(key, { ...(freqMap.get(key) ?? e), count: (freqMap.get(key)?.count ?? 0) + 1 });
  }
  return Array.from(freqMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

async function fetchCaptures(db) {
  const { data, error } = await db
    .from('captures')
    .select('id, content, type, subject_tag, topic_tag')
    .gte('created_at', daysAgo(30))
    .order('created_at', { ascending: false });
  if (error) { return []; }
  return data ?? [];
}

async function fetchTextbooks(db) {
  const { data, error } = await db
    .from('textbooks')
    .select('id, title, subject, current_page, total_pages, topic_map')
    .order('active_from', { ascending: false });
  if (error) { return []; }

  // Return current chapter only — strip full topic_map to a summary
  return (data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    subject: t.subject,
    current_page: t.current_page,
    total_pages: t.total_pages,
    topic_map: null, // full map excluded from context budget
  }));
}

async function fetchSources(db) {
  const { data, error } = await db
    .from('sources')
    .select('topic, quality, resource_type');
  if (error) { return []; }
  return data ?? [];
}

/**
 * Compute confusion map from sessions and grouped errors.
 * Used both in assembleContext (for AI calls) and exported for test sim weighting (P18).
 */
export function computeContextConfusionMap(sessions, errors) {
  const coveredSet = new Set();
  for (const s of sessions) {
    if (s.subject) coveredSet.add(s.subject.toLowerCase().trim());
  }

  const errorCountMap = new Map();
  for (const e of errors) {
    if (!e.topic) continue;
    const key = e.topic.toLowerCase().trim();
    errorCountMap.set(key, (errorCountMap.get(key) ?? 0) + (e.count ?? 1));
  }

  const allTopics = new Set([...coveredSet, ...errorCountMap.keys()]);

  const safe = [], danger = [], watch = [];
  for (const topic of allTopics) {
    const covered = coveredSet.has(topic);
    const errorCount = errorCountMap.get(topic) ?? 0;
    if (errorCount >= 2) {
      danger.push(topic);
    } else if (!covered && errorCount >= 1) {
      watch.push(topic);
    } else if (covered && errorCount === 1) {
      watch.push(topic);
    } else {
      safe.push(topic);
    }
  }

  return { danger: danger.sort(), watch: watch.sort(), safe: safe.sort() };
}

/**
 * Assemble live context for AI calls.
 * v1.1: pass { userId, scope } to prepend permanent memory — memory is
 * the FIRST key so it leads every serialized context block.
 * @param {{ userId?: string, scope?: 'tutor'|'test_gen'|'brief'|'retro' }} [opts]
 */
export async function assembleContext(opts = {}) {
  const db = createServiceClient();

  const [goals, sessions, errors, captures, textbooks, sources] = await Promise.all([
    fetchGoals(db),
    fetchSessions(db),
    fetchErrors(db),
    fetchCaptures(db),
    fetchTextbooks(db),
    fetchSources(db),
  ]);

  const confusion_map = computeContextConfusionMap(sessions, errors);

  let permanent_memory = null;
  if (opts.userId) {
    try {
      const { readMemoryBlock } = await import('./memory/memoryManager');
      permanent_memory = await readMemoryBlock(opts.userId, opts.scope);
    } catch {
      // memory unavailable (table not yet migrated, etc.) — context still works
    }
  }

  return { permanent_memory, goals, sessions, errors, captures, textbooks, sources, confusion_map };
}

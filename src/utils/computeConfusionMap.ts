export type QuadrantType = 'safe' | 'danger' | 'watch' | 'upcoming';

export interface ConfusionMapData {
  safe: string[];
  danger: string[];
  watch: string[];
  upcoming: string[];
}

interface SessionRecord {
  subject?: string | null;
}

interface ErrorRecord {
  topic?: string | null;
  count?: number;
}

function normTopic(t: string): string {
  return t.toLowerCase().trim();
}

/**
 * Classify topics into 4 confusion map quadrants.
 *
 * Safe:     covered (in sessions) + zero errors
 * Danger:   errorCount >= 2 (studied or not — high error rate = danger)
 * Watch:    covered + exactly 1 error, OR not covered + any errors
 * Upcoming: textbook subjects not yet in sessions or errors (not yet encountered)
 */
export function computeConfusionMap(
  sessions: SessionRecord[],
  errors: ErrorRecord[],
  textbookSubjects: string[] = [],
): ConfusionMapData {
  // Topics covered via sessions (by subject)
  const coveredSet = new Set<string>();
  for (const s of sessions) {
    if (s.subject) coveredSet.add(normTopic(s.subject));
  }

  // Error counts per topic
  const errorCountMap = new Map<string, number>();
  for (const e of errors) {
    if (!e.topic) continue;
    const key = normTopic(e.topic);
    errorCountMap.set(key, (errorCountMap.get(key) ?? 0) + (e.count ?? 1));
  }

  // All topics from sessions + errors
  const allTopics = new Set<string>(
    Array.from(coveredSet).concat(Array.from(errorCountMap.keys()))
  );

  // Textbook subjects that haven't appeared anywhere → Upcoming
  const upcomingCandidates = textbookSubjects
    .map(normTopic)
    .filter((s) => !allTopics.has(s));

  const safe: string[] = [];
  const danger: string[] = [];
  const watch: string[] = [];

  for (const topic of Array.from(allTopics)) {
    const covered = coveredSet.has(topic);
    const errorCount = errorCountMap.get(topic) ?? 0;

    if (errorCount >= 2) {
      danger.push(topic);
    } else if (!covered && errorCount >= 1) {
      watch.push(topic);
    } else if (covered && errorCount === 1) {
      watch.push(topic);
    } else {
      // covered && errorCount === 0
      safe.push(topic);
    }
  }

  return {
    safe: safe.sort(),
    danger: danger.sort(),
    watch: watch.sort(),
    upcoming: upcomingCandidates.sort(),
  };
}

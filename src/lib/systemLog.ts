// system_log writer — cron/background job observability (v1.1 Phase 0).
// Fire-and-forget: logging failures must never break the job itself.

import { createServiceClient } from '@/lib/supabase';

export type SystemJob = 'sync' | 'retrospective' | 'memory_rewrite';

export async function logJobRun(
  job: SystemJob,
  status: 'ok' | 'error',
  detail?: string
): Promise<void> {
  try {
    const db = createServiceClient();
    await db.from('system_log').insert({ job, status, detail: detail ?? null });
  } catch {
    // observability must not take down the observed
  }
}

export interface JobStatus {
  status: string;
  detail: string | null;
  created_at: string;
}

export async function lastJobRun(job: SystemJob): Promise<JobStatus | null> {
  try {
    const db = createServiceClient();
    const { data } = await db
      .from('system_log')
      .select('status, detail, created_at')
      .eq('job', job)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}

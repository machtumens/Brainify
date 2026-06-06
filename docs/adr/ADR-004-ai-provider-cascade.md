# ADR-004: AI Provider Cascade Design

**Status:** Accepted
**Date:** 2026-06-05
**Sprint:** 1 | WBS 1.8 | US-018

---

## Context

Second Brain requires AI-generated content (daily brief, tutor, test generation, primer, retrospective) on a free-tier budget. No single free provider offers sufficient reliability — Gemini hits 1,500 req/day limits, Groq has 30 RPM throttling, and OpenRouter's free pool is rate-limited at ~20 RPM.

The builder needs zero hard stops from rate limits during normal daily use.

## Decision

Implement a sequential provider cascade in `/src/lib/ai-router.js`:

1. **Gemini Flash** (primary) — 1M token context, 1,500 req/day free
2. **Groq + Llama 3.3** (fallback 1) — fastest free inference, ~30 RPM
3. **OpenRouter free pool** (fallback 2) — 30+ models, OpenAI-compat API

Rules:
- Identical context injected regardless of provider (Law 15: provider is infrastructure)
- Provider name logged server-side only — never returned to client
- Missing env var at startup: warn + skip provider (no crash)
- All providers fail: throw generic `'AI service unavailable'` — no provider name in message
- Each provider is tried on any error, not only rate limit errors — simpler, more robust

## Consequences

**Improves:**
- Resilience: single provider failure is transparent to user
- Dev experience: if Gemini quota exhausted during dev, Groq serves automatically
- Cost: all three providers are free tier, zero credit card required for prototype

**Trade-offs:**
- Latency: cascade adds ~2s per failed provider hop (acceptable — Phase Gate target is <2s on Gemini)
- Context identical across providers: Groq and OpenRouter receive same large context even if their context windows are smaller — monitor for truncation errors in production

## Alternatives Rejected

| Alternative | Reason rejected |
|-------------|----------------|
| OpenAI only | Requires credit card; not free tier |
| Gemini only | 1,500/day limit insufficient for daily use + dev |
| Random provider selection | Unpredictable latency; Gemini should be primary for 1M context |
| Provider shown in UI | Violates Law 15 — provider is infrastructure detail |

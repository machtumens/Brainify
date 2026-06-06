/**
 * Unit tests for ai-router.js
 * Run: npx jest tests/unit/ai-router.test.ts
 *
 * Mocking strategy: mock all three provider SDKs before importing ai-router,
 * so we can control which providers succeed or fail per test.
 */

// Mock the three provider SDKs
const mockGeminiGenerate = jest.fn();
const mockGroqCreate = jest.fn();
const mockOpenRouterCreate = jest.fn();

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: mockGeminiGenerate,
    }),
  })),
}));

jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: { completions: { create: mockGroqCreate } },
  }));
});

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: { completions: { create: mockOpenRouterCreate } },
  }));
});

// Set all env vars before module import
const originalEnv = process.env;
beforeAll(() => {
  process.env = {
    ...originalEnv,
    GEMINI_API_KEY: 'test-gemini-key',
    GROQ_API_KEY: 'test-groq-key',
    OPENROUTER_API_KEY: 'test-openrouter-key',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Dynamically import after mocks and env are set
let callAI: (prompt: string) => Promise<{ text: string; provider: string }>;
let buildPrompt: (instruction: string, context: object) => string;

beforeAll(async () => {
  const router = await import('../../src/lib/ai-router.js');
  callAI = router.callAI;
  buildPrompt = router.buildPrompt;
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('callAI — provider cascade', () => {
  it('returns Gemini response when Gemini succeeds', async () => {
    mockGeminiGenerate.mockResolvedValue({ response: { text: () => 'Gemini reply' } });

    const result = await callAI('test prompt');

    expect(result.text).toBe('Gemini reply');
    expect(result.provider).toBe('gemini');
    expect(mockGroqCreate).not.toHaveBeenCalled();
  });

  it('falls back to Groq when Gemini throws', async () => {
    mockGeminiGenerate.mockRejectedValue(new Error('Rate limit exceeded'));
    mockGroqCreate.mockResolvedValue({
      choices: [{ message: { content: 'Groq reply' } }],
    });

    const result = await callAI('test prompt');

    expect(result.text).toBe('Groq reply');
    expect(result.provider).toBe('groq');
    expect(mockOpenRouterCreate).not.toHaveBeenCalled();
  });

  it('falls back to OpenRouter when Gemini and Groq both fail', async () => {
    mockGeminiGenerate.mockRejectedValue(new Error('Gemini down'));
    mockGroqCreate.mockRejectedValue(new Error('Groq down'));
    mockOpenRouterCreate.mockResolvedValue({
      choices: [{ message: { content: 'OpenRouter reply' } }],
    });

    const result = await callAI('test prompt');

    expect(result.text).toBe('OpenRouter reply');
    expect(result.provider).toBe('openrouter');
  });

  it('throws generic error when all providers fail — no provider name in message', async () => {
    mockGeminiGenerate.mockRejectedValue(new Error('Gemini 429'));
    mockGroqCreate.mockRejectedValue(new Error('Groq 429'));
    mockOpenRouterCreate.mockRejectedValue(new Error('OpenRouter 429'));

    await expect(callAI('test prompt')).rejects.toThrow('AI service unavailable');
  });

  it('error message never contains provider names', async () => {
    mockGeminiGenerate.mockRejectedValue(new Error('fail'));
    mockGroqCreate.mockRejectedValue(new Error('fail'));
    mockOpenRouterCreate.mockRejectedValue(new Error('fail'));

    let thrownMessage = '';
    try {
      await callAI('test prompt');
    } catch (err) {
      thrownMessage = (err as Error).message;
    }

    expect(thrownMessage).not.toMatch(/gemini/i);
    expect(thrownMessage).not.toMatch(/groq/i);
    expect(thrownMessage).not.toMatch(/openrouter/i);
    expect(thrownMessage).toBe('AI service unavailable');
  });
});

describe('buildPrompt', () => {
  it('combines instruction and context into a prompt string', () => {
    const prompt = buildPrompt('Do this', { goals: [], sessions: [] });
    expect(prompt).toContain('Do this');
    expect(prompt).toContain('"goals"');
    expect(prompt).toContain('"sessions"');
  });
});

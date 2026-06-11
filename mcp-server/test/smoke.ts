// Smoke test: spawn the server over stdio, list tools, call one read tool.
// Run: npm run smoke   (inside mcp-server/)

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const here = path.dirname(fileURLToPath(import.meta.url));

const EXPECTED_TOOLS = [
  'memory_read',
  'memory_write',
  'quiz_generate',
  'quiz_history',
  'textbook_list',
  'textbook_pull',
  'captures_search',
  'confusion_map_get',
  'session_log',
];

async function main() {
  const transport = new StdioClientTransport({
    command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
    args: ['tsx', path.resolve(here, '../src/index.ts')],
  });

  const client = new Client({ name: 'smoke', version: '0.0.1' });
  await client.connect(transport);

  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name).sort();
  const missing = EXPECTED_TOOLS.filter((t) => !names.includes(t));
  if (missing.length > 0) {
    throw new Error(`Missing tools: ${missing.join(', ')}`);
  }
  console.log(`tools/list OK — ${names.length} tools: ${names.join(', ')}`);

  const result = await client.callTool({ name: 'confusion_map_get', arguments: {} });
  const first = (result.content as { type: string; text?: string }[])[0];
  console.log(`confusion_map_get OK — ${String(first?.text ?? '').slice(0, 120)}...`);

  await client.close();
  console.log('SMOKE PASS');
}

main().catch((err) => {
  console.error('SMOKE FAIL:', err instanceof Error ? err.message : err);
  process.exit(1);
});

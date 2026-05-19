#!/usr/bin/env node
// Generate narration MP3s for the Learn tab using ElevenLabs Flash 2.5.
// Reads ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID from .env at the repo root.
// Reads learn-script.json and produces one MP3 per slide under audio/learn/.
//
// Run from the repo root:
//   node tools/generate-audio.mjs            # generate any missing files
//   node tools/generate-audio.mjs --force    # regenerate all files
//   node tools/generate-audio.mjs --only 14  # generate only slide 14

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// ---- minimal .env parser ----
function loadEnv() {
  const envPath = path.join(repoRoot, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Missing .env at repo root.');
    process.exit(1);
  }
  const out = {};
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = loadEnv();
const apiKey = env.ELEVENLABS_API_KEY;
const voiceId = env.ELEVENLABS_VOICE_ID;
if (!apiKey || !voiceId) {
  console.error('ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID must be set in .env.');
  process.exit(1);
}

// ---- args ----
const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyArg = args.findIndex(a => a === '--only');
const onlyId = onlyArg !== -1 ? args[onlyArg + 1] : null;

// ---- load script.json ----
const scriptPath = path.join(repoRoot, 'learn-script.json');
const script = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
const audioDir = path.join(repoRoot, script.meta.audio_dir);
fs.mkdirSync(audioDir, { recursive: true });

const model = script.meta.voice_model || 'eleven_flash_v2_5';
const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;

async function generateOne(slide) {
  const outPath = path.join(repoRoot, slide.audio_file);
  if (!force && fs.existsSync(outPath)) {
    console.log(`skip  ${slide.id}  (exists)  ${slide.audio_file}`);
    return { skipped: true };
  }
  const body = {
    text: slide.text,
    model_id: model,
    voice_settings: {
      stability: 0.42,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true
    }
  };
  const started = Date.now();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '<no body>');
    throw new Error(`HTTP ${res.status} for slide ${slide.id}: ${err.slice(0, 240)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
  const ms = Date.now() - started;
  console.log(`ok    ${slide.id}  ${(buf.length / 1024).toFixed(1)}KB  ${ms}ms  ${slide.audio_file}`);
  return { bytes: buf.length, ms };
}

(async () => {
  const slides = onlyId ? script.slides.filter(s => s.id === onlyId) : script.slides;
  if (onlyId && slides.length === 0) {
    console.error(`no slide with id "${onlyId}"`);
    process.exit(1);
  }
  console.log(`generating ${slides.length} segment(s) with voice ${voiceId.slice(0, 6)}… via ${model}`);
  let totalBytes = 0;
  let ok = 0, skipped = 0, failed = 0;
  for (const slide of slides) {
    try {
      const r = await generateOne(slide);
      if (r.skipped) skipped++;
      else { ok++; totalBytes += r.bytes; }
    } catch (e) {
      failed++;
      console.error(`fail  ${slide.id}  ${e.message}`);
    }
    // gentle pacing to avoid burst rate limits
    await new Promise(r => setTimeout(r, 250));
  }
  console.log(`done. ok=${ok} skipped=${skipped} failed=${failed} totalBytes=${(totalBytes / 1024 / 1024).toFixed(2)}MB`);
})();

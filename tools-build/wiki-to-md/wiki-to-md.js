const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');

const inputPath = process.argv[2];
let outputPath = process.argv[3];

if (!inputPath) {
  console.error('Usage: node wiki-to-md.js <input-wiki-export.md|html> [output.md]');
  console.error('Without [output.md], the name is taken from the wiki page\'s own slug and saved next to the input file.');
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, 'utf8');

const CYRILLIC_TO_LATIN = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
};
function slugify(text) {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractJsonStringField(str, fieldName) {
  const marker = `"${fieldName}":"`;
  const idx = str.indexOf(marker);
  if (idx === -1) return null;
  let i = idx + marker.length;
  let escaped = false;
  const start = i;
  while (i < str.length) {
    const ch = str[i];
    if (escaped) escaped = false;
    else if (ch === '\\') escaped = true;
    else if (ch === '"') break;
    i++;
  }
  try {
    return JSON.parse('"' + str.slice(start, i) + '"');
  } catch (e) {
    return null;
  }
}

function extractTitle(str) {
  const m = str.match(/"title":"((?:[^"\\]|\\.)*)"/);
  if (!m) return null;
  try {
    return JSON.parse('"' + m[1] + '"');
  } catch (e) {
    return null;
  }
}

let html = extractJsonStringField(raw, 'html');
let title = extractTitle(raw);
let slug = extractJsonStringField(raw, 'slug'); // the page's own clean URL slug, e.g. "ssr-i-servernyjj-rendering"

// Fallback: if there's no embedded JSON blob, assume the whole file already is the article HTML.
if (!html) {
  html = raw;
}

if (!outputPath) {
  const base = (slug && slug.split('/').filter(Boolean).pop())
    || (title && slugify(title))
    || slugify(path.basename(inputPath, path.extname(inputPath)));
  outputPath = path.join(path.dirname(inputPath), `${base}.md`);
}

// Strip YFM/ProseMirror bookkeeping attributes that add noise but no content.
html = html.replace(/\s+data-(line|yfm-node-id|pm-node[a-z-]*|no-index|header)="[^"]*"/g, '');
// Drop the hidden clipboard-anchor links inside headings (visually-hidden duplicate of the heading text).
html = html.replace(/<a[^>]*class="[^"]*yfm-anchor[^"]*"[^>]*>.*?<\/a>/g, '');
// Table cells wrap their text in a lone <p>; unwrap it so the gfm table rule sees plain inline content.
html = html.replace(/<(th|td)([^>]*)>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/\1>/g, '<$1$2>$3</$1>');

function decodeEntities(str) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}
function stripTags(str) {
  return decodeEntities(str.replace(/<[^>]+>/g, '')).trim();
}

// Wiki Yandex renders side-by-side code comparisons as a <table> with a <pre><code> per cell.
// Markdown tables can't hold multi-line code, so turndown would otherwise dump the raw
// highlight.js HTML. Pull each such table out and re-render it as a sequence of
// "**label**" + fenced code block pairs, column by column, then splice the markdown back in.
const codeTables = [];
html = html.replace(/<table[^>]*>[\s\S]*?<\/table>/g, (tableHtml) => {
  if (!/<pre[\s>]/.test(tableHtml)) return tableHtml;
  const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((m) => m[1]);
  const grid = rows.map((row) => [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((m) => m[1]));
  const columns = Math.max(0, ...grid.map((r) => r.length));
  const parts = [];
  for (let col = 0; col < columns; col++) {
    for (const row of grid) {
      const cell = row[col];
      if (cell === undefined) continue;
      const codeMatch = cell.match(/<code[^>]*class="([^"]*\bhljs\b[^"]*)"[^>]*>([\s\S]*?)<\/code>/);
      if (codeMatch) {
        const [, classAttr, codeHtml] = codeMatch;
        const lang = classAttr.split(/\s+/).find((c) => c && c !== 'hljs') || '';
        parts.push('```' + lang + '\n' + stripTags(codeHtml) + '\n```');
      } else if (/<li[\s>]/.test(cell)) {
        const items = [...cell.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)]
          .map((m) => stripTags(m[1]))
          .filter(Boolean);
        if (items.length) parts.push(items.map((item) => `- ${item}`).join('\n'));
      } else {
        const text = stripTags(cell);
        if (text) parts.push(`**${text}**`);
      }
    }
  }
  const placeholder = `CODETABLEPLACEHOLDER${codeTables.length}`;
  codeTables.push(parts.join('\n\n'));
  return `<p>${placeholder}</p>`;
});

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
  hr: '---',
});
turndownService.use(gfm);

let markdown = turndownService.turndown(html);

codeTables.forEach((rendered, i) => {
  markdown = markdown.replace(`CODETABLEPLACEHOLDER${i}`, rendered);
});

// Turndown escapes "N." at the start of a line to dodge accidental ordered lists;
// inside a heading (after "### ") that ambiguity can't happen, so unescape it.
markdown = markdown.replace(/^(#+\s+\d+)\\\./gm, '$1.');
// The wiki source often has literal "- foo" / "+ foo" lines typed as plain text bullets
// (not real <ul> markup), which turndown escapes to avoid an accidental list. Unescaping
// them turns them into an actual rendered markdown list, matching the author's intent.
markdown = markdown.replace(/^\\([-+])(\s)/gm, '$1$2');
// Turndown pads loose list items with a trailing whitespace-only line; drop that padding.
markdown = markdown.split('\n').map((line) => line.replace(/\s+$/, '')).join('\n');
// Collapse 3+ blank lines down to 1.
markdown = markdown.replace(/\n{3,}/g, '\n\n').trim() + '\n';

if (title) {
  markdown = `# ${title}\n\n${markdown}`;
}

fs.writeFileSync(outputPath, markdown, 'utf8');
console.log(`Written ${outputPath} (${markdown.length} chars)`);

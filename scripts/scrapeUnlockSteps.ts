
// scripts/scrapeUnlockSteps.ts
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface UnlockSteps {
  name: string;
  steps: string[];
}

async function scrapeUnlockSteps() {
  // 1) Launch headless Chrome
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 2) Go to the page and wait for JS/CSS to settle
  const url =
    'https://tamagotchi.fandom.com/wiki/Tamagotchi_Uni/Character_list?action=render';
  await page.goto(url, { waitUntil: 'networkidle2' });
  const html = await page.content();
  await browser.close();

  // 4) Load into Cheerio
  const $ = cheerio.load(html);
  const results: UnlockSteps[] = [];

  $('table.wikitable').each((_, table) => {
    const $table = $(table);
    const $headerRow = $table
      .find('tr')
      .filter((i, row) => {
        return $(row)
          .find('th')
          .toArray()
          .some(th => /Obtaining/i.test($(th).text()));
    })
      .first();

    if (!$headerRow.length) return;

    const headers = $headerRow
      .find('th')
      .map((i, th) => $(th).text().trim())
      .get();

    // find the column indexes for Name & Obtaining
    const nameCol = headers.findIndex(h => /Character|Name|Tama/i.test(h));
    const obtainCol = headers.findIndex(h => /Obtaining|Requirements?|Requirement|Unlock/i.test(h));
    if (nameCol === -1 || obtainCol === -1) return;

    // parse each data row
    $table.find('tr').slice($table.find('tr').index($headerRow) + 1).each((_, row) => {
      const $cells = $(row).find('td');
      if ($cells.length <= Math.max(nameCol, obtainCol)) return;

      const rawName = $cells.eq(nameCol).text().trim();
      if (!rawName) return;

      // split steps by list items or <br>
      const $obtainCell = $cells.eq(obtainCol);
      let steps: string[] = [];

      if ($obtainCell.find('li').length) {
        steps = $obtainCell
          .find('li')
          .map((i, li) => $(li).text().trim())
          .get()
          .filter(Boolean);
      } else {
        steps = ($obtainCell.html() || '')
          .split(/<br\s*\/?>/i)
          .map(f => cheerio.load(f).root().text().trim())
          .filter(Boolean);
      }

      if (steps.length) {
        results.push({ name: rawName, steps });
        console.log(`✓ ${rawName}: ${steps.length} step(s)`);
      }
    });
  });

  // 5) Write out a JSON map
  const outDir = path.resolve(__dirname, '..', 'data');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'unlockSteps.json'),
    JSON.stringify(results, null, 2),
    'utf-8'
  );

  console.log(`\nDone! ${results.length} characters written to data/unlockSteps.json`);
}

scrapeUnlockSteps().catch(err => {
  console.error(err);
  process.exit(1);
});

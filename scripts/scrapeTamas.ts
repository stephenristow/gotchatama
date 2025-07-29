
import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Expansion } from '../app/types/expansion';

interface OutTama {
  id:         number;
  name:       string;
  expansion:  Expansion;
  imageFile:  string;  // local asset path
}

async function scrapeFromFandom() {
  console.log('⏳ Fetching character list…');
  const { data: html } = await axios.get(
    'https://tamagotchi.fandom.com/wiki/Tamagotchi_Uni/Character_list?action=render'
  );
  const $ = cheerio.load(html);

  // 1) build name→expansion map
  const valid = new Set(Object.values(Expansion));
  const expansionMap: Record<string, Expansion> = {};

  $('h3').each((_, h3) => {
    const heading = $(h3).text().trim();
    if (!valid.has(heading)) return;
    const $tbl = $(h3).nextAll('table.wikitable').first();
    $tbl.find('tr').slice(1).each((_, row) => {
      const name = $(row).find('td').eq(0).text().trim();
      if (name) expansionMap[name] = heading as Expansion;
    });
  });

  // 2) prepare output & folders
  const out: OutTama[] = [];
  mkdirSync('data', { recursive: true });
  mkdirSync('assets/tamas', { recursive: true });

  let globalId = 1;

  // 3) walk each wikitable (skipping the Pets table)
  for (const tblElem of $('table.wikitable').toArray()) {
    const $tbl = $(tblElem);
    const headers = $tbl
      .find('tr').first()
      .find('th')
      .map((_, th) => $(th).text().trim())
      .get();

    if (headers.includes('Furniture Left in Garden')) {
      console.log('⏭️ Skipping Pets table');
      continue;
    }

    // 4) walk each data row
    for (const rowElem of $tbl.find('tr').slice(1).toArray()) {
      const $row = $(rowElem);
      const name = $row.find('td').eq(0).text().trim();
      if (!name) continue;

      // 4a) get the File: page title
      const $img = $row
        .find('td')
        .eq(1)
        .find('img')
      let raw = $img
        .attr('data-src') || $img.attr('src') || '';
      if (!raw) {
        console.warn(`! No file link for ${name}, skipping`);
        continue;
      }

      if (raw.startsWith('//')) raw = 'https:' + raw;
      else if (raw.startsWith('/')) raw = 'https://static.wikia.nocookie.net' + raw;

      const imageUrl = raw.replace(
        /\/revision\/latest\/scale-to-width-down\/\d+/,
        '/revision/latest'
      );

      const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer'});
      const assetPath = `assets/tamas/${globalId}.png`;
      // 4b) fetch the real PNG URL via the MediaWiki 

      writeFileSync(join(process.cwd(), assetPath), imgRes.data);
      console.log(`✔ [${globalId}] Saved ${name}`);
      // 4d) record it in our JSON manifest
      out.push({
        id:         globalId,
        name,
        expansion:  expansionMap[name] || Expansion.BaseGame,
        imageFile:  `./${assetPath}`,
      });

      globalId++;
    }
  }

    // 5) write out the final JSON
    writeFileSync('data/tamas.json', JSON.stringify(out, null, 2));
    console.log(`✨ Wrote ${out.length} entries to data/tamas.json`);

    const lines = out.map(t => 
      `${t.id}: require('../assets/tamas/${t.id}.png'),`
    );
    const content = `export const tamaImages = {\n${lines.join('\n')}\n};\n`;
    mkdirSync('app/data', { recursive: true })
    writeFileSync('app/data/tamaImages.ts', content);
    console.log('✅ Generated app/data/tamaImages.ts');

  }

  scrapeFromFandom().catch(err => {
    console.error(err);
    process.exit(1);
  });

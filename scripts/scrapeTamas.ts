import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync, mkdirSync, writeFile } from 'fs';
import { join } from 'path';

interface Tama { id: number; name: string; imageUrl: string; }

async function scrape() {
    const out: Tama[] = [];
    mkdirSync('data', {recursive: true });
    mkdirSync('assets/tamas', {recursive: true });
    
    for (let id = 1; id <= 59; id++) {
        const url = `https://tamagotchi-official.com/us/series/uni/character/${id}/`;
        try {
            const { data: html } = await axios.get(url);
            const $ = cheerio.load(html);

            const name = $('.pg-detail__name--box').text().trim();
            const imgElem = $('.pg-detail__thumb img.c-card__thumb--full');
            let imageUrl = imgElem.attr('src') ?? '';

            console.log(`ID ${id}: raw src="${imageUrl}"`);

            if (imageUrl.startsWith('/')) {
            imageUrl = `https://tamagotchi-official.com${imageUrl}`;
            }
            
            if (!name || !imageUrl) {
                console.warn(`! Missing data for ID ${id}, skipping`);
                continue;
            }

            out.push({ id, name, imageUrl });

            const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            writeFileSync(join('assets/tamas', `${id}.png`), imgRes.data);
            console.log(`-> Saved ${name}`);
        } catch {
            console.warn(`! Skipping character ${id}`);
        }
    }
    writeFileSync('data/tamas.json', JSON.stringify(out, null, 2));
    console.log(`Wrote ${out.length} entries to data/tamas.json`);
}

scrape();
import { readFileSync, writeFile } from 'node:fs';
import { resolve } from 'node:path';
const championJSON = JSON.parse(readFileSync(resolve(__dirname,'../rawData/champion.json'), 'utf-8'));

const champsById = {};
for (const champName in championJSON.data) {
    const champId = championJSON.data[champName].key
    champsById[champId] = champName;
}

writeFile(resolve(__dirname, '../assets/champion/championsById.json'), JSON.stringify(champsById), (err) => {
  if (err) throw err;
  console.log('Saved!');
})
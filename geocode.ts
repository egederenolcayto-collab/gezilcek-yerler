import Papa from "papaparse";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  const r = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSf7D1lEnEk6PDJ50LpWscyd2K244n1-G167rgnrFbhJnSyvr1aGEbkGM_ljQ1iEGt71dU5MmY8Vooi/pub?output=csv');
  const text = await r.text();
  
  Papa.parse(text, {
    header: true,
    complete: async (res) => {
      const coords: any = {};
      
      for (const row of res.data) {
        const name = row['Adı'] || row[Object.keys(row)[0]];
        if (!name) continue;
        
        let q = `${name.replace('Müzesi', '').trim()}, Istanbul`;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`, { headers: { 'User-Agent': 'IstanbulCultureApp/1.0' } });
        const json = await res.json();
        
        if (json && json.length > 0) {
          coords[name] = [parseFloat(json[0].lat), parseFloat(json[0].lon)];
          console.log(`Geocoded: ${name}`);
        } else {
            const fallback = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name.split(' ')[0] + ', Istanbul')}&limit=1`, { headers: { 'User-Agent': 'IstanbulCultureApp/1.0' } });
            const fallbackJson = await fallback.json();
            if (fallbackJson && fallbackJson.length > 0) {
              coords[name] = [parseFloat(fallbackJson[0].lat), parseFloat(fallbackJson[0].lon)];
              console.log(`Geocoded (fallback): ${name}`);
            } else {
              console.log(`FAILED: ${name}`);
            }
        }
        await wait(1100);
      }
      
      console.log(JSON.stringify(coords, null, 2));
    }
  });
}

run();

import Papa from 'papaparse';
import PRESET_COORDS from './coordinates.json';

export interface Museum {
  id: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  type: string;
  openingHours: string;
  media: string;
  lat?: number;
  lng?: number;
}

export async function fetchMuseumsData(url: string, onProgress?: (current: number, total: number) => void): Promise<Museum[]> {
  const response = await fetch(url);
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rawData = results.data as any[];
        const museums: Museum[] = [];
        
        let headerKeys = Object.keys(rawData[0] || {});
        // Find best matching keys

        const nameKey = headerKeys.find(k => k.toLowerCase().includes('ad')) || headerKeys[0];
        const districtKey = headerKeys.find(k => k.toLowerCase().includes('ilçe')) || headerKeys[2];
        const addressKey = headerKeys.find(k => k.toLowerCase().includes('adres')) || headerKeys[4];
        const phoneKey = headerKeys.find(k => k.toLowerCase().includes('telefon')) || headerKeys[5];
        const typeKey = headerKeys.find(k => k.toLowerCase().includes('türü')) || headerKeys[1];
        const hoursKey = headerKeys.find(k => k.toLowerCase().includes('saat')) || headerKeys[6];
        const mediaKey = headerKeys.find(k => k.toLowerCase().includes('medya')) || headerKeys[7];

        const coordsDict = PRESET_COORDS as Record<string, [number, number]>;

        for (let i = 0; i < rawData.length; i++) {
          const row = rawData[i];
          const name = row[nameKey] || 'Unknown Museum';
          const address = row[addressKey] || '';
          
          let lat = undefined;
          let lng = undefined;
          
          if (coordsDict[name]) {
             lat = coordsDict[name][0];
             lng = coordsDict[name][1];
          } else {
             const matchedKey = Object.keys(coordsDict).find(k => name.includes(k) || k.includes(name));
             if (matchedKey) {
                lat = coordsDict[matchedKey][0];
                lng = coordsDict[matchedKey][1];
             } else {
                // fallback generic location center if not found, so it shows up at least somewhere near
                lat = 41.0082;
                lng = 28.9784;
             }
          }

          museums.push({
            id: `museum-${i}`,
            name,
            district: row[districtKey] || '',
            address,
            phone: row[phoneKey] || '',
            type: row[typeKey] || '',
            openingHours: row[hoursKey] || '',
            media: row[mediaKey] || '',
            lat,
            lng
          });
          
          if (onProgress) {
             onProgress(i + 1, rawData.length);
          }
        }
        
        // Filter out museums that couldn't be located to avoid React-Leaflet errors, optionally
        const locatedMuseums = museums.filter(m => m.lat !== undefined && m.lng !== undefined);
        resolve(locatedMuseums);
      },
      error: (error: any) => reject(error)
    });
  });
}

import React, { useEffect, useState } from 'react';
import MuseumMap from '../components/MuseumMap';
import { fetchMuseumsData, Museum } from '../utils/dataFetcher';
import { Loader2, ArrowLeft, Map as MapIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSf7D1lEnEk6PDJ50LpWscyd2K244n1-G167rgnrFbhJnSyvr1aGEbkGM_ljQ1iEGt71dU5MmY8Vooi/pub?output=csv';

export default function MapPage() {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMuseumsData(CSV_URL, (current, total) => {
          if (isMounted) setProgress({ current, total });
        });
        if (isMounted) {
          setMuseums(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error loading museum data:", err);
          setError("Veriler yüklenirken bir hata oluştu :(");
          setLoading(false);
        }
      }
    }

    loadData();
    
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#F9F8F6] text-[#2D2926] font-sans selection:bg-[#E5E2DD] overflow-hidden">
      {/* Header */}
      <header className="h-20 border-b border-[#E5E2DD] px-10 flex flex-none items-center justify-between bg-white/80 backdrop-blur-md z-10 w-full">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-10 h-10 bg-[#C4A484] hover:bg-[#5A5A40] transition rounded-full flex items-center justify-center text-white font-serif italic text-xl">
            K
          </Link>
          <div className="flex flex-col">
            <h1 className="font-serif italic text-2xl tracking-tight text-[#5A5A40]">
               Görülmesi Gereken Yerler
            </h1>
          </div>
        </div>
        {!loading && (
          <div className="px-4 py-2 border border-[#5A5A40] text-[10px] font-bold uppercase tracking-tighter">
            {museums.length} Nokta İşlendi
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative bg-[#E5E2DD]">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-center p-8 z-10 w-full h-full bg-[#F9F8F6]/90 backdrop-blur-sm absolute inset-0">
            <Loader2 className="w-12 h-12 text-[#C4A484] animate-spin mb-4" />
            <h3 className="font-serif italic text-2xl text-[#2D2926] mb-2">Harita Hazırlanıyor...</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Adresler anlık olarak harita koordinatlarına dönüştürülüyor.
            </p>
            {progress.total > 0 && (
              <div className="w-full max-w-sm">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] mb-2">
                  <span>İşlenen: {progress.current} / {progress.total}</span>
                  <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-[#E5E2DD] h-1">
                  <div 
                    className="bg-[#C4A484] h-1 transition-all duration-300 ease-out" 
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-white border border-[#E5E2DD] shadow-xl max-w-md m-auto">
             <div className="w-12 h-12 bg-[#5A5A40] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif italic text-[#C4A484]">i</span>
             </div>
            <h3 className="font-serif italic text-xl text-[#2D2926] mb-2">Hata</h3>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#5A5A40] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#C4A484] transition"
            >
              Tekrar Dene
            </button>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <MuseumMap museums={museums} />
          </div>
        )}
      </main>
    </div>
  );
}

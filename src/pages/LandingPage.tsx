import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2D2926] font-sans selection:bg-[#E5E2DD] selection:text-[#5A5A40] flex flex-col">
      {/* Navigation */}
      <nav className="w-full h-20 border-b border-[#E5E2DD] bg-white/80 backdrop-blur-md z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-10 h-full flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-[#C4A484] rounded-full flex items-center justify-center text-white font-serif italic text-xl group-hover:bg-[#5A5A40] transition">
              K
            </div>
            <h1 className="font-serif italic text-2xl tracking-tight text-[#5A5A40]">Görülmesi Gereken Yerler</h1>
          </div>
          <div className="flex gap-8 text-xs font-semibold uppercase tracking-widest">
            <Link to="/" className="text-[#C4A484] border-b border-[#C4A484] pb-1">
              Keşfet
            </Link>
            <Link to="/map" className="hover:text-[#C4A484] transition-colors">
              Haritaya Git
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden px-6 py-20 pb-32">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#5A5A40] text-[10px] font-bold uppercase tracking-tighter mb-8 bg-white/50">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4A484] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5A5A40]"></span>
            </span>
            Canlı Geocoding Teknolojisi
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-[#2D2926] mb-6 leading-tight">
            İstanbul'da
            <br className="hidden md:block"/>
            <span className="text-[#C4A484]"> Görülmesi Gereken Yerler</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
            Açık veri portalından alınan canlı mekan ve adres verileri anlık olarak konumlandırılır. Modern harita tasarımı ile İstanbul'un kültürel ve tarihi zenginliğini fotoğraflarla keşfetmeye başla.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center text-xs font-bold uppercase tracking-widest">
            <Link 
              to="/map" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#5A5A40] text-white hover:bg-[#C4A484] transition-all w-full sm:w-auto"
            >
               Haritayı Aç
            </Link>
            <a 
              href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSf7D1lEnEk6PDJ50LpWscyd2K244n1-G167rgnrFbhJnSyvr1aGEbkGM_ljQ1iEGt71dU5MmY8Vooi/pub?output=csv" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-[#5A5A40] border border-[#5A5A40] hover:bg-[#5A5A40] hover:text-white transition-all w-full sm:w-auto"
            >
              Veri Kaynağını İncele
            </a>
          </div>
        </motion.div>

        {/* Feature Cards below */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#F9F8F6] p-6 border-l-4 border-[#5A5A40] shadow-sm hover:bg-white transition-colors"
          >
            <p className="text-[10px] font-bold text-[#C4A484] uppercase mb-2 tracking-widest">Algoritma</p>
            <h3 className="font-serif italic text-xl leading-tight mb-2 text-[#2D2926]">Canlı Geocoding</h3>
            <p className="text-[11px] text-gray-500">Adres metinlerini anlık olarak harita koordinatlarına çeviren algoritmik altyapı.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#F9F8F6] p-6 border-l-4 border-[#C4A484] shadow-sm hover:bg-white transition-colors"
          >
            <p className="text-[10px] font-bold text-[#C4A484] uppercase mb-2 tracking-widest">Performans</p>
            <h3 className="font-serif italic text-xl leading-tight mb-2 text-[#2D2926]">Akıllı Önbellek</h3>
            <p className="text-[11px] text-gray-500">Tarayıcı önbelleğinde saklanan konumlar ile ikinci denemede sıfır gecikme.</p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-[#F9F8F6] p-6 border-l-4 border-[#5A5A40] shadow-sm hover:bg-white transition-colors"
          >
            <p className="text-[10px] font-bold text-[#C4A484] uppercase mb-2 tracking-widest">Keşif</p>
            <h3 className="font-serif italic text-xl leading-tight mb-2 text-[#2D2926]">Detaylı Bilgiler</h3>
            <p className="text-[11px] text-gray-500">Harita üzerindeki etkileşimli pinler sayesinde adres ve iletişim bilgilerine hızlı erişim.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Landmark, Building2, Castle, ShoppingBag, Droplets, MapPin, Clock, Camera, Binoculars, Trees, Waves } from 'lucide-react';
import { Museum } from '../utils/dataFetcher';

function getIconForType(typeStr: string) {
  const type = (typeStr || '').toLowerCase();
  let IconComponent = MapPin;
  let bgClass = "bg-[#5A5A40]";
  let borderColor = "border-white";
  
  if (type.includes('saray') || type.includes('kale') || type.includes('hisar')) {
     IconComponent = Castle;
     bgClass = "bg-rose-600";
  } else if (type.includes('cami')) {
     IconComponent = Landmark;
     bgClass = "bg-teal-600";
  } else if (type.includes('müze')) {
     IconComponent = Building2;
     bgClass = "bg-[#C4A484]";
  } else if (type.includes('sarnıç')) {
     IconComponent = Droplets;
     bgClass = "bg-sky-600";
  } else if (type.includes('çarşı')) {
     IconComponent = ShoppingBag;
     bgClass = "bg-amber-500";
  } else if (type.includes('kule') || type.includes('seyir')) {
     IconComponent = Binoculars;
     bgClass = "bg-indigo-600";
  } else if (type.includes('sahil') || type.includes('deniz') || type.includes('yalı')) {
     IconComponent = Waves;
     bgClass = "bg-cyan-500";
  } else if (type.includes('park') || type.includes('tepe') || type.includes('meydan') || type.includes('koru')) {
     IconComponent = Trees;
     bgClass = "bg-emerald-500";
  }

  const iconHtml = renderToString(
    <div className="relative flex items-center justify-center w-10 h-10">
      <div className={`absolute top-0 w-8 h-8 rounded-full ${bgClass} border-2 ${borderColor} shadow-sm z-10 flex items-center justify-center text-white`}>
        <IconComponent size={14} strokeWidth={2.5} />
      </div>
      <div className={`absolute top-[10px] w-4 h-4 ${bgClass} rotate-45 transform origin-center border-r-2 border-b-2 ${borderColor} shadow-sm z-0`}></div>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 36],
    popupAnchor: [0, -32]
  });
}

function getMediaVisual(mediaUrl: string) {
  if (!mediaUrl) return null;
  
  const url = mediaUrl.trim();
  
  // YouTube thumbnail extraction
  if (url.includes('youtu.be/')) {
    const idMatches = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (idMatches && idMatches[1]) {
       return { 
         type: 'youtube', 
         url: url, 
         imageUrl: `https://img.youtube.com/vi/${idMatches[1]}/hqdefault.jpg` 
       };
    }
  } else if (url.includes('youtube.com/watch')) {
    try {
      const urlObj = new URL(url);
      const v = urlObj.searchParams.get('v');
      if (v) {
         return {
           type: 'youtube',
           url: url,
           imageUrl: `https://img.youtube.com/vi/${v}/hqdefault.jpg`
         };
      }
    } catch(e) {}
  } else if (url.includes('youtube.com/shorts/')) {
    const idMatches = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
    if (idMatches && idMatches[1]) {
       return {
         type: 'youtube',
         url: url,
         imageUrl: `https://img.youtube.com/vi/${idMatches[1]}/hqdefault.jpg`
       }
    }
  }
  
  // Image links
  if (url.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) || url.includes('images.pexels.com') || url.includes('unsplash.com')) {
    return { type: 'image', url: url, imageUrl: url };
  }
  
  // Fallback
  return { type: 'link', url: !url.startsWith('http') ? `https://${url}` : url, imageUrl: null };
}

interface MuseumMapProps {
  museums: Museum[];
}

export default function MuseumMap({ museums }: MuseumMapProps) {
  // Center of Istanbul
  const istanbulCenter: [number, number] = [41.0082, 28.9784];

  return (
    <MapContainer 
      center={istanbulCenter} 
      zoom={12} 
      scrollWheelZoom={true} 
      zoomControl={false}
      className="w-full h-full z-0 relative"
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {museums.map((museum) => {
        if (!museum.lat || !museum.lng) return null;
        
        const media = getMediaVisual(museum.media);
        
        return (
          <Marker 
            key={museum.id} 
            position={[museum.lat, museum.lng]}
            icon={getIconForType(museum.type)}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} className="font-sans">
              <div className="bg-[#2D2926] text-white text-[10px] px-2 py-1 shadow-xl">
                {museum.name} <span className="opacity-70">| {museum.type || museum.district}</span>
              </div>
            </Tooltip>
            <Popup className="font-sans w-[280px]" closeButton={false}>
              <div className="flex flex-col">
                {media && media.imageUrl && (
                  <a href={media.url} target="_blank" rel="noreferrer" className="block relative w-full h-48 overflow-hidden bg-gray-100 group">
                    <img 
                      src={media.imageUrl} 
                      alt={museum.name} 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {media.type === 'youtube' && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition">
                         <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                           <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#5A5A40] border-b-[8px] border-b-transparent ml-1"></div>
                         </div>
                       </div>
                    )}
                     <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white p-1.5 rounded-full shadow-md z-10">
                        <Camera size={14} />
                     </div>
                  </a>
                )}
                <div className="p-4 border-t border-[#E5E2DD]">
                  <div className="text-[9px] font-bold text-[#C4A484] uppercase mb-1">{museum.type} • {museum.district}</div>
                  <h4 className="font-serif italic text-xl mb-3 text-[#2D2926] leading-tight">{museum.name}</h4>
                  <div className="space-y-2 border-t border-[#E5E2DD] pt-3 text-[11px] text-gray-600">
                    {museum.openingHours && (
                      <p className="flex items-start gap-2"><Clock size={14} className="text-[#5A5A40] mt-0.5" /> <span>{museum.openingHours}</span></p>
                    )}
                    <p className="flex items-start gap-2"><MapPin size={14} className="text-[#5A5A40] mt-0.5 flex-none" /> <span>{museum.address}</span></p>
                    {museum.phone && (
                      <p className="flex items-center gap-2"><span>📞</span> <a href={`tel:${museum.phone}`} className="hover:text-[#C4A484] transition">{museum.phone}</a></p>
                    )}
                    {media && !media.imageUrl && media.url && (
                      <a href={media.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-full mt-2 py-2 bg-[#5A5A40] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#C4A484] transition">
                        Daha Fazla Bilgi
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

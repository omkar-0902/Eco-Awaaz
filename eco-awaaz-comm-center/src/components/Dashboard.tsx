import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, BarChart3, Droplet, Loader2, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

interface AreaData {
  pin: string;
  name: string;
  totalComplaints: number;
  breakdown: { label: string; count: number; color: string }[];
}

const hydroMockData: AreaData[] = [
  {
    pin: '400053',
    name: 'Andheri West',
    totalComplaints: 3450,
    breakdown: [
      { label: 'NO WATER SUPPLY', count: 1245, color: 'bg-rose-500' },
      { label: 'CONTAMINATED WATER', count: 843, color: 'bg-orange-500' },
      { label: 'LOW WATER PRESSURE', count: 520, color: 'bg-amber-500' },
      { label: 'LEAKING PIPE', count: 842, color: 'bg-blue-500' },
    ],
  },
  {
    pin: '400034',
    name: 'Tardeo',
    totalComplaints: 1204,
    breakdown: [
      { label: 'NO WATER SUPPLY', count: 604, color: 'bg-rose-500' },
      { label: 'CONTAMINATED WATER', count: 200, color: 'bg-orange-500' },
      { label: 'LOW WATER PRESSURE', count: 150, color: 'bg-amber-500' },
      { label: 'LEAKING PIPE', count: 250, color: 'bg-blue-500' },
    ],
  },
  {
    pin: '400001',
    name: 'Fort / CSMT',
    totalComplaints: 840,
    breakdown: [
      { label: 'NO WATER SUPPLY', count: 440, color: 'bg-rose-500' },
      { label: 'CONTAMINATED WATER', count: 150, color: 'bg-orange-500' },
      { label: 'LOW WATER PRESSURE', count: 150, color: 'bg-amber-500' },
      { label: 'LEAKING PIPE', count: 100, color: 'bg-blue-500' },
    ],
  },
];

const gridMockData: AreaData[] = [
  {
    pin: '400053',
    name: 'Andheri West',
    totalComplaints: 840,
    breakdown: [
      { label: 'NO POWER SUPPLY', count: 300, color: 'bg-rose-500' },
      { label: 'TRANSFORMER OR DC BLAST', count: 42, color: 'bg-orange-500' },
      { label: 'STREET LIGHT NOT WORKING', count: 400, color: 'bg-amber-500' },
      { label: 'LOOSE/HANGING WIRE', count: 98, color: 'bg-blue-500' },
    ],
  },
  {
    pin: '400034',
    name: 'Tardeo',
    totalComplaints: 345,
    breakdown: [
      { label: 'NO POWER SUPPLY', count: 120, color: 'bg-rose-500' },
      { label: 'TRANSFORMER OR DC BLAST', count: 15, color: 'bg-orange-500' },
      { label: 'STREET LIGHT NOT WORKING', count: 150, color: 'bg-amber-500' },
      { label: 'LOOSE/HANGING WIRE', count: 60, color: 'bg-blue-500' },
    ],
  },
  {
    pin: '400001',
    name: 'Fort / CSMT',
    totalComplaints: 210,
    breakdown: [
      { label: 'NO POWER SUPPLY', count: 80, color: 'bg-rose-500' },
      { label: 'TRANSFORMER OR DC BLAST', count: 5, color: 'bg-orange-500' },
      { label: 'STREET LIGHT NOT WORKING', count: 100, color: 'bg-amber-500' },
      { label: 'LOOSE/HANGING WIRE', count: 25, color: 'bg-blue-500' },
    ],
  },
];

const sanitationMockData: AreaData[] = [
  {
    pin: '400053',
    name: 'Andheri West',
    totalComplaints: 1250,
    breakdown: [
      { label: 'GARBAGE NOT COLLECTED', count: 640, color: 'bg-rose-500' },
      { label: 'BLOCKED OR BROKEN DRAINAGE', count: 210, color: 'bg-orange-500' },
      { label: 'GARBAGE DUMPED ON ROADS', count: 200, color: 'bg-amber-500' },
      { label: 'BAD SMELL OR DISEASE RISK', count: 200, color: 'bg-emerald-500' },
    ],
  },
  {
    pin: '400034',
    name: 'Tardeo',
    totalComplaints: 520,
    breakdown: [
      { label: 'GARBAGE NOT COLLECTED', count: 220, color: 'bg-rose-500' },
      { label: 'BLOCKED OR BROKEN DRAINAGE', count: 80, color: 'bg-orange-500' },
      { label: 'GARBAGE DUMPED ON ROADS', count: 120, color: 'bg-amber-500' },
      { label: 'BAD SMELL OR DISEASE RISK', count: 100, color: 'bg-emerald-500' },
    ],
  },
  {
    pin: '400001',
    name: 'Fort / CSMT',
    totalComplaints: 340,
    breakdown: [
      { label: 'GARBAGE NOT COLLECTED', count: 150, color: 'bg-rose-500' },
      { label: 'BLOCKED OR BROKEN DRAINAGE', count: 60, color: 'bg-orange-500' },
      { label: 'GARBAGE DUMPED ON ROADS', count: 80, color: 'bg-amber-500' },
      { label: 'BAD SMELL OR DISEASE RISK', count: 50, color: 'bg-emerald-500' },
    ],
  },
];

interface LiveDashboardProps {
  onLogout: () => void;
  domainName: string; 
  iconBg: string;
  iconColor: string;
  themeColor: string; 
}

const Dashboard: React.FC<LiveDashboardProps> = ({ onLogout, domainName, iconBg, iconColor, themeColor }) => {
  const [hydroPhase, setHydroPhase] = useState<'droplet' | 'vortex'>('droplet');
  const [reportText, setReportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (domainName === 'HYDRO OPERATIONS') {

      const timer = setTimeout(() => setHydroPhase('vortex'), 2200);
      return () => clearTimeout(timer);
    }
  }, [domainName]);

  const [activeData, setActiveData] = useState<AreaData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    let endpoint = '';
    if (domainName === 'GRID OPERATIONS') endpoint = '/dashboard/electricity';
    else if (domainName === 'SANITATION OPS') endpoint = '/dashboard/waste';
    else endpoint = '/dashboard/water';

    setIsDataLoading(true);
    API.get(endpoint)
      .then(res => {
        const data = res.data;
        const colorPalette = ['bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-blue-500', 'bg-indigo-500'];
        const breakdown = Object.entries(data.complaintTypes || {}).map(([label, count], idx) => ({
          label: label.toUpperCase(),
          count: count as number,
          color: colorPalette[idx % colorPalette.length]
        }));
        
        setActiveData({
          pin: data.topPostalCode || 'N/A',
          name: data.topAddress || 'N/A',
          totalComplaints: data.totalComplaints || 0,
          breakdown
        });
      })
      .catch(err => {
        console.error('Failed to fetch dashboard data:', err);
        // Fallback to mock data if API fails to keep UI gracefully filled
        if (domainName === 'GRID OPERATIONS') setActiveData(gridMockData[0]);
        else if (domainName === 'SANITATION OPS') setActiveData(sanitationMockData[0]);
        else setActiveData(hydroMockData[0]);
      })
      .finally(() => {
        setIsDataLoading(false);
      });
  }, [domainName]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 relative rounded-[24px] overflow-hidden">
      
        {domainName === 'HYDRO OPERATIONS' && (
         <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#00152a]">
            {/* Phase 1: Rotating Raindrop Entry */}
            <AnimatePresence>
              {hydroPhase === 'droplet' && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                  <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: [0, 1.5, 0.8], rotate: 1080 }}
                    exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-blue-400 drop-shadow-[0_0_50px_rgba(59,130,246,0.8)]"
                  >
                    <Droplet className="w-48 h-48" fill="currentColor" />
                    {/* Inner Ripples within Droplet */}
                    <motion.div 
                      className="absolute inset-0 border-4 border-white/40 rounded-full"
                      animate={{ scale: [1, 2], opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Phase 2: Rain and Dark Clouds */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: hydroPhase === 'vortex' ? 1 : 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              {/* Dark stormy background overlay */}
              <div className="absolute inset-0 bg-slate-900/60" />

              {/* Raindrops */}
              {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 bg-gradient-to-b from-transparent via-blue-200 to-blue-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10%`,
                    height: `${Math.random() * 20 + 20}px`,
                    opacity: Math.random() * 0.5 + 0.3,
                  }}
                  animate={{
                    y: ['0vh', '120vh'], // Fall from top to bottom
                  }}
                  transition={{
                    duration: Math.random() * 0.5 + 0.7,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 2,
                  }}
                />
              ))}

              {/* Dark Clouds Layer 1 (Back) */}
              <motion.div
                className="absolute top-0 w-[200%] h-32 flex opacity-80"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1/3 h-full bg-slate-800 rounded-b-full blur-3xl scale-y-150 transform -translate-y-8" />
                ))}
              </motion.div>

              {/* Dark Clouds Layer 2 (Front) */}
              <motion.div
                className="absolute -top-10 w-[200%] h-40 flex opacity-90"
                animate={{ x: ['-50%', '0%'] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1/2 h-full bg-slate-900 rounded-b-full blur-2xl scale-y-125 translate-y-4" />
                ))}
              </motion.div>

              {/* Periodic Lightning Flashes */}
              <motion.div
                className="absolute inset-0 bg-white"
                animate={{ opacity: [0, 0, 0, 0.4, 0, 0, 0.2, 0, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                style={{ mixBlendMode: 'overlay' }}
              />
            </motion.div>

            {/* Rising water from bottom (to cover the terrain crack) */}
            <motion.div 
               initial={{ height: "0%" }}
               animate={{ height: "40%" }}
               transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
               className="absolute bottom-0 w-full bg-blue-600/30 backdrop-blur-sm shadow-[inset_0_20px_40px_rgba(0,0,0,0.4)]"
            />
            
            {/* Land surface at the bottom */}
            <div className="absolute bottom-0 w-full h-12 bg-[#2d3748] z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
               {/* Grass overlay on land */}
               <div className="absolute top-0 w-full h-3 bg-[#38a169]" />
               {/* Grass Tufts */}
               <div className="absolute -top-2 left-[10%] w-1.5 h-3 bg-[#38a169] rounded-t-full rotate-[-15deg] origin-bottom" />
               <div className="absolute -top-3 left-[11%] w-1.5 h-4 bg-[#38a169] rounded-t-full origin-bottom" />
               <div className="absolute -top-2 left-[12%] w-1.5 h-3 bg-[#38a169] rounded-t-full rotate-[15deg] origin-bottom" />

               <div className="absolute -top-3 right-[20%] w-1.5 h-4 bg-[#38a169] rounded-t-full rotate-[-10deg] origin-bottom" />
               <div className="absolute -top-2 right-[19%] w-1.5 h-3 bg-[#38a169] rounded-t-full rotate-[20deg] origin-bottom" />
               
               {/* Crack opening in the land */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-slate-900 rounded-t-xl overflow-hidden border-4 border-slate-700 border-b-0 shadow-inner z-20">
                  {/* Water spewing under high pressure */}
                  <motion.div 
                    animate={{ y: [40, -40], opacity: [0, 1, 0], scale: [0.8, 1.5, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                    className="w-20 h-16 bg-blue-400 blur-[3px] absolute -bottom-4 -left-2 rounded-full"
                  />
                  <motion.div 
                    animate={{ y: [40, -60], opacity: [0, 1, 0], scale: [0.6, 1.2, 0.6] }}
                    transition={{ duration: 0.9, delay: 0.2, repeat: Infinity, ease: "easeOut" }}
                    className="w-16 h-20 bg-blue-200 blur-[2px] absolute -bottom-4 left-0 rounded-full"
                  />
                  {/* High pressure droplets shooting above crack */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none">
                     <motion.div animate={{ y: [20, -50], x: [0, -15], opacity: [0, 1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-2 h-2 bg-blue-300 rounded-full blur-[1px] absolute bottom-0 left-1/2" />
                     <motion.div animate={{ y: [20, -60], x: [0, 20], opacity: [0, 1, 0] }} transition={{ duration: 0.7, delay: 0.3, repeat: Infinity }} className="w-2.5 h-2.5 bg-blue-200 rounded-full blur-[1px] absolute bottom-0 left-[45%]" />
                  </div>
               </div>
            </div>
         </div>
      )}

      {domainName === 'GRID OPERATIONS' && (() => {
         const towers = [
            { id: 1, x: 150, y: 1050, scale: 1.4 },
            { id: 3, x: 950, y: 1100, scale: 1.6 }
         ];

         const getPts = (t: { x: number; y: number; scale: number }) => ({
            topL: { x: t.x - 30*t.scale, y: t.y - 270*t.scale },
            topR: { x: t.x + 30*t.scale, y: t.y - 270*t.scale },
            midL: { x: t.x - 45*t.scale, y: t.y - 240*t.scale },
            midR: { x: t.x + 45*t.scale, y: t.y - 240*t.scale },
            botL: { x: t.x - 60*t.scale, y: t.y - 210*t.scale },
            botR: { x: t.x + 60*t.scale, y: t.y - 210*t.scale },
         });

         const pts1 = getPts(towers[0]);
         const pts3 = getPts(towers[1]);

         const wire = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
             const midX = (p1.x + p2.x) / 2;
             const sagDist = Math.abs(p1.x - p2.x) * 0.15; // Natural gravity line
             const sagY = Math.max(p1.y, p2.y) + sagDist; 
             return `M ${p1.x},${p1.y} Q ${midX},${sagY} ${p2.x},${p2.y}`;
         }

         return (
         <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* The Vibrant Sunset Theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-rose-500 to-indigo-900 opacity-80" />
            
            {/* Few gentle clouds */}
            <div className="absolute top-[15%] left-[10%] opacity-30 drop-shadow-lg">
               <svg width="140" height="60" viewBox="0 0 120 40" fill="#f8fafc">
                  <circle cx="30" cy="20" r="15" />
                  <circle cx="55" cy="15" r="20" />
                  <circle cx="85" cy="20" r="15" />
                  <rect x="30" y="15" width="55" height="20" rx="10" />
               </svg>
            </div>
            <div className="absolute top-[25%] right-[15%] opacity-20 drop-shadow-md scale-75">
               <svg width="120" height="40" viewBox="0 0 120 40" fill="#f8fafc">
                  <circle cx="30" cy="20" r="15" />
                  <circle cx="55" cy="15" r="20" />
                  <circle cx="85" cy="20" r="15" />
                  <rect x="30" y="15" width="55" height="20" rx="10" />
               </svg>
            </div>
            <div className="absolute top-[35%] left-[45%] opacity-15 drop-shadow-sm scale-50">
               <svg width="120" height="40" viewBox="0 0 120 40" fill="#f1f5f9">
                  <circle cx="30" cy="20" r="15" />
                  <circle cx="55" cy="15" r="20" />
                  <circle cx="85" cy="20" r="15" />
                  <rect x="30" y="15" width="55" height="20" rx="10" />
               </svg>
            </div>

            {/* Minimised Sun */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-t from-yellow-300 to-orange-200 rounded-full blur-[2px] shadow-[0_0_80px_rgba(253,224,71,1)]" />

            {/* High-Contrast SVG Silhouette Background - Adjusted Opacity for text readability */}
            <svg className="absolute inset-0 w-full h-full opacity-40 mix-blend-multiply" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMax slice" style={{ filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))' }}>
               <defs>
                  <g id="tower" stroke="#000000" fill="none" strokeWidth="2.5">
                     <line x1="0" y1="-400" x2="0" y2="0" strokeWidth="3.5" />
                     <line x1="-50" y1="0" x2="0" y2="-370" strokeWidth="3.5" />
                     <line x1="50" y1="0" x2="0" y2="-370" strokeWidth="3.5" />
                     <line x1="-35" y1="-120" x2="0" y2="-370" />
                     <line x1="35" y1="-120" x2="0" y2="-370" />

                     <line x1="-30" y1="-270" x2="30" y2="-270" strokeWidth="4" />
                     <line x1="0" y1="-320" x2="-30" y2="-270" />
                     <line x1="0" y1="-320" x2="30" y2="-270" />

                     <line x1="-45" y1="-240" x2="45" y2="-240" strokeWidth="4" />
                     <line x1="0" y1="-280" x2="-45" y2="-240" />
                     <line x1="0" y1="-280" x2="45" y2="-240" />

                     <line x1="-60" y1="-210" x2="60" y2="-210" strokeWidth="4" />
                     <line x1="0" y1="-250" x2="-60" y2="-210" />
                     <line x1="0" y1="-250" x2="60" y2="-210" />

                     <line x1="-30" y1="-270" x2="-30" y2="-250" strokeWidth="3" opacity="0.9" />
                     <line x1="30" y1="-270" x2="30" y2="-250" strokeWidth="3" opacity="0.9" />
                     <line x1="-45" y1="-240" x2="-45" y2="-220" strokeWidth="3" opacity="0.9" />
                     <line x1="45" y1="-240" x2="45" y2="-220" strokeWidth="3" opacity="0.9" />
                     <line x1="-60" y1="-210" x2="-60" y2="-190" strokeWidth="3" opacity="0.9" />
                     <line x1="60" y1="-210" x2="60" y2="-190" strokeWidth="3" opacity="0.9" />

                     <path d="M -42,-60 L 32,-140 M 42,-60 L -32,-140" strokeWidth="1.5" />
                     <path d="M -32,-140 L 22,-210 M 32,-140 L -22,-210" strokeWidth="1.5" />
                  </g>
               </defs>

               <g className="wires" stroke="#000000" fill="none">
                  {/* Left off-screen */}
                  <path d={wire({x:-50, y: pts1.topL.y-40}, pts1.topL)} strokeWidth="2.5" />
                  <path d={wire({x:-50, y: pts1.midL.y-40}, pts1.midL)} strokeWidth="2.5" />
                  <path d={wire({x:-50, y: pts1.botL.y-40}, pts1.botL)} strokeWidth="2.5" />

                  {/* Tower 1 to Tower 3 (Direct Connection) */}
                  <path d={wire(pts1.topR, pts3.topL)} strokeWidth="2" />
                  <path d={wire(pts1.midR, pts3.midL)} strokeWidth="2" />
                  <path d={wire(pts1.botR, pts3.botL)} strokeWidth="2" />

                  {/* Tower 3 to off-screen right */}
                  <path d={wire(pts3.topR, {x:1050, y: pts3.topR.y-50})} strokeWidth="2.5" />
                  <path d={wire(pts3.midR, {x:1050, y: pts3.midR.y-50})} strokeWidth="2.5" />
                  <path d={wire(pts3.botR, {x:1050, y: pts3.botR.y-50})} strokeWidth="2.5" />
               </g>

               {/* Render Towers */}
               {towers.map(t => (
                  <use key={t.id} href="#tower" transform={`translate(${t.x}, ${t.y}) scale(${t.scale})`} />
               ))}
            </svg>
         </div>
         );
      })()}

      {domainName === 'SANITATION OPS' && (
         <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Light greenish background tint */}
            <div className="absolute inset-0 bg-emerald-50/50" />
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-emerald-100/60 to-transparent mix-blend-multiply border-b-[12px] border-slate-300" />
            
            {/* Left Corner: Multiple Dustbins */}
            <div className="absolute bottom-3 left-0 md:left-4 flex items-end gap-1 opacity-90 drop-shadow-md">
               {/* Dustbin 1 */}
               <svg width="50" height="70" viewBox="0 0 60 80" className="text-slate-600">
                  <path d="M10,20 L50,20 L45,80 L15,80 Z" fill="currentColor"/>
                  <rect x="5" y="10" width="50" height="10" fill="#334155" rx="2" />
                  <rect x="25" y="5" width="10" height="5" fill="#334155" rx="1" />
                  <line x1="20" y1="30" x2="20" y2="70" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="30" y1="30" x2="30" y2="70" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="40" y1="30" x2="40" y2="70" stroke="#94a3b8" strokeWidth="2" />
               </svg>
               {/* Dustbin 2 (Green) */}
               <svg width="55" height="75" viewBox="0 0 60 80" className="text-emerald-700 -ml-2 z-10 drop-shadow-xl">
                  <path d="M10,20 L50,20 L45,80 L15,80 Z" fill="currentColor"/>
                  <rect x="5" y="10" width="50" height="10" fill="#047857" rx="2" />
                  <rect x="25" y="5" width="10" height="5" fill="#047857" rx="1" />
                  <line x1="20" y1="30" x2="20" y2="70" stroke="#a7f3d0" strokeWidth="2" />
                  <line x1="30" y1="30" x2="30" y2="70" stroke="#a7f3d0" strokeWidth="2" />
                  <line x1="40" y1="30" x2="40" y2="70" stroke="#a7f3d0" strokeWidth="2" />
               </svg>
               {/* Dustbin 3 (Blue) */}
               <svg width="45" height="65" viewBox="0 0 60 80" className="text-blue-700 -ml-2 drop-shadow-md">
                  <path d="M10,20 L50,20 L45,80 L15,80 Z" fill="currentColor"/>
                  <rect x="5" y="10" width="50" height="10" fill="#1d4ed8" rx="2" />
                  <rect x="25" y="5" width="10" height="5" fill="#1d4ed8" rx="1" />
                  <line x1="20" y1="30" x2="20" y2="70" stroke="#93c5fd" strokeWidth="2" />
                  <line x1="30" y1="30" x2="30" y2="70" stroke="#93c5fd" strokeWidth="2" />
                  <line x1="40" y1="30" x2="40" y2="70" stroke="#93c5fd" strokeWidth="2" />
               </svg>
            </div>

            {/* Right Corner: Garbage Truck */}
            <div className="absolute bottom-3 right-0 md:right-4 opacity-90 drop-shadow-xl">
               <svg width="180" height="120" viewBox="0 0 150 100">
                  {/* Truck Rear Body (Compactor) */}
                  <path d="M 50,30 L 140,30 L 145,80 L 50,80 Z" fill="#166534" />
                  {/* Truck Front Cabin */}
                  <path d="M 10,45 L 50,45 L 50,80 L 10,80 Z" fill="#f8fafc" />
                  <path d="M 20,45 L 35,30 L 50,30 L 50,45 Z" fill="#e2e8f0" />
                  {/* Window */}
                  <path d="M 22,45 L 36,32 L 48,32 L 48,45 Z" fill="#cbd5e1" />
                  
                  {/* Wheels */}
                  <circle cx="30" cy="85" r="12" fill="#1e293b" />
                  <circle cx="30" cy="85" r="5" fill="#94a3b8" />
                  
                  <circle cx="95" cy="85" r="12" fill="#1e293b" />
                  <circle cx="95" cy="85" r="5" fill="#94a3b8" />

                  <circle cx="125" cy="85" r="12" fill="#1e293b" />
                  <circle cx="125" cy="85" r="5" fill="#94a3b8" />
                  
                  {/* Compactor mechanic details */}
                  <line x1="60" y1="40" x2="130" y2="70" stroke="#064e3b" strokeWidth="3" />
                  <line x1="60" y1="70" x2="130" y2="40" stroke="#064e3b" strokeWidth="3" />
                  <rect x="135" y="30" width="8" height="50" fill="#064e3b" rx="2" />
               </svg>
            </div>
         </div>
      )}

      {/* Dashboard Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 top-0 sticky z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
             <Droplet className="w-5 h-5" fill="currentColor"/>
          </div>
          <div>
            <h4 className={`text-[10px] ${themeColor} font-bold tracking-[0.2em] uppercase mb-0.5 opacity-80`}>Live View Active</h4>
            <h2 className="text-xl font-black text-slate-900 leading-tight tracking-tight">{domainName}</h2>
          </div>
        </div>
        <button onClick={onLogout} className="px-4 py-2 rounded-lg text-xs font-black tracking-widest uppercase text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors">
          Exit Dashboard
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 pointer-events-auto">
        
        {activeData && (
             <motion.div 
               key="data"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="max-w-4xl mx-auto"
             >
              {isDataLoading || !activeData ? (
                 <div className="flex flex-col items-center justify-center p-24 text-slate-400">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <p className="font-bold tracking-widest uppercase">Fetching Live Data...</p>
                 </div>
              ) : (
                <div 
                  key={activeData.pin}
                  className="max-w-4xl mx-auto"
                >
                   {/* Data Header */}
                   <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-lg mb-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                     
                     <div>
                       <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                         <MapPin size={14} className="text-blue-500"/> TOP POSTAL ZONE
                       </h4>
                       <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4">{activeData.pin}</h2>
                       <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-md">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Metrics Active
                       </span>
                     </div>
  
                     <div className="text-center md:text-right bg-blue-50 border border-blue-100 rounded-2xl p-6 min-w-[200px] z-10 shadow-sm">
                       <h4 className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-widest mb-1">Total Complaints</h4>
                       <div className="text-5xl font-black text-blue-700 tracking-tighter">{activeData.totalComplaints.toLocaleString()}</div>
                       <div className="text-xs text-blue-500 font-bold mt-2 border-t border-blue-200/50 pt-2">Last 72 hours</div>
                     </div>
                   </div>
  
                   {/* Graph Area */}
                   <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-lg overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                          <BarChart3 size={20} className="text-slate-400" />
                          Complaint Frequency Graph
                        </h3>
                      </div>
  
                      <div className="space-y-6">
                        {activeData.breakdown.length === 0 ? (
                           <div className="text-center text-slate-400 font-bold py-6">All clear! No active complaints.</div>
                        ) : (
                          activeData.breakdown.map((item, idx) => (
                            <div key={idx} className="relative">
                               <div className="flex justify-between text-sm font-bold mb-2">
                                  <span className="text-slate-800 tracking-widest uppercase text-xs">{item.label}</span>
                                  <span className="text-slate-500 font-mono">{item.count.toLocaleString()}</span>
                               </div>
                               <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.count / activeData.totalComplaints) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                                    className={`h-full ${item.color} shadow-sm rounded-full`}
                                  />
                               </div>
                            </div>
                          ))
                        )}
                      </div>
                   </div>
                </div>
              )}

                {/* Domain Specific Reporting Section */}
                <div className="bg-white rounded-[24px] p-8 mt-8 border border-slate-200 shadow-lg relative overflow-hidden">
                   <div className="relative z-10">
                     {domainName === 'GRID OPERATIONS' && (
                       <div>
                          <label className="text-xs font-mono text-slate-500 font-black uppercase tracking-[0.2em] mb-4 block">Power Outage Reason</label>
                          <textarea 
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                            placeholder="Describe the nature of the grid failure or maintenance requirement..."
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-amber-500/50 transition-all min-h-[120px] shadow-inner"
                          />
                       </div>
                     )}
                     {domainName === 'HYDRO OPERATIONS' && (
                       <div>
                          <label className="text-xs font-mono text-slate-500 font-black uppercase tracking-[0.2em] mb-4 block">Water Supply Arrival Time and Date</label>
                          <textarea 
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                            placeholder="Enter arrival day, date, and approximate time window manually (e.g. Monday, 12th Oct, 10:00 AM)..."
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all min-h-[140px] shadow-inner"
                          />
                       </div>
                     )}
                     {domainName === 'SANITATION OPS' && (
                       <div>
                          <label className="text-xs font-mono text-slate-500 font-black uppercase tracking-[0.2em] mb-4 block">Collector Arrival Time and Date</label>
                          <textarea 
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                            placeholder="Enter collection schedule manually (e.g. Daily at 8 AM, or specific date and time)..."
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-all min-h-[140px] shadow-inner"
                          />
                        </div>
                      )}
                      
                      <div className="mt-8 flex items-center justify-end gap-4">
                        {submitStatus === 'success' && (
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-emerald-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Report Submitted Successfully
                          </motion.span>
                        )}
                        {submitStatus === 'error' && (
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-rose-600 font-bold text-xs uppercase tracking-widest"
                          >
                            Failed to submit. Try again.
                          </motion.span>
                        )}
                        <button 
                          disabled={isSubmitting || !reportText.trim()}
                          onClick={async () => {
                            if (!reportText.trim()) return;
                            setIsSubmitting(true);
                            setSubmitStatus('idle');
                            
                            let resourceType = '';
                            let prefix = '';
                            if (domainName === 'GRID OPERATIONS') {
                              resourceType = 'electricity';
                              prefix = 'Power Outage Reason: ';
                            } else if (domainName === 'HYDRO OPERATIONS') {
                              resourceType = 'water';
                              prefix = 'Water Supply Arrival Time and Date: ';
                            } else if (domainName === 'SANITATION OPS') {
                              resourceType = 'waste';
                              prefix = 'Collector Arrival Time and Date: ';
                            }

                            try {
                              await API.post('/resource/add', {
                                resourceType,
                                description: prefix + reportText
                              });
                              setSubmitStatus('success');
                              setReportText('');
                              setTimeout(() => setSubmitStatus('idle'), 3000);
                            } catch (err) {
                              console.error('Submit report failed:', err);
                              setSubmitStatus('error');
                            } finally {
                              setIsSubmitting(false);
                            }
                          }}
                          className={`px-8 py-4 ${themeColor.replace('text-', 'bg-')} text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                        >
                          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REPORT'}
                        </button>
                      </div>
                    </div>
                    {/* Visual accent */}
                    <div className={`absolute top-0 right-0 w-32 h-32 ${themeColor.replace('text-', 'bg-')} opacity-[0.03] rounded-full translate-x-12 -translate-y-12`} />
                 </div>
             </motion.div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;


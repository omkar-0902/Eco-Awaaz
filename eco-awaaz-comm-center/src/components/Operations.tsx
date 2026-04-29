import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Zap, Recycle } from 'lucide-react';
import Card from './Card';
import Dashboard from './Dashboard';

type OpsCard = {
  domain: string;
  name: string;
  statLabel: string;
  statValue: string;
  valColor: string;
  glowColor: string;
  glowColorHex: string;
  hoverBorder: string;
  btnBg: string;
  btnText: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  chart: React.ReactNode;
  tickets: { text: string; count: string }[];
};

const opsCards: OpsCard[] = [
  {
    domain: 'HYDRO OPERATIONS',
    name: 'Water Command',
    statLabel: 'LOSS REDUCED',
    statValue: '-18.4%',
    valColor: 'text-blue-600',
    glowColor: 'from-blue-600/10',
    glowColorHex: 'rgba(37,99,235,0.08)',
    hoverBorder: 'hover:border-blue-500',
    btnBg: 'bg-blue-600',
    btnText: 'text-white',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    icon: <Droplet className="w-4 h-4" fill="currentColor" />,
    chart: (
      <svg viewBox="0 0 100 40" className="w-[120px] h-[40px] opacity-90" preserveAspectRatio="none">
        <path d="M0,30 L20,25 L40,35 L60,15 L80,20 L100,5" fill="none" stroke="#2563eb" strokeWidth="2.5" />
        <path d="M0,30 L20,25 L40,35 L60,15 L80,20 L100,5 L100,40 L0,40 Z" fill="url(#blue-grad)" opacity="0.2" />
        <defs>
          <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="#2563eb" />
             <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    ),
    tickets: [
      { text: 'NO WATER SUPPLY', count: '1,245' },
      { text: 'CONTAMINATED WATER', count: '843' },
      { text: 'LOW WATER PRESSURE', count: '520' },
      { text: 'LEAKING PIPE', count: '2,104' }
    ]
  },
  {
    domain: 'GRID OPERATIONS',
    name: 'Electricity Command',
    statLabel: 'AVG RESTORE',
    statValue: '37 min',
    valColor: 'text-amber-500',
    glowColor: 'from-amber-500/10',
    glowColorHex: 'rgba(245,158,11,0.08)',
    hoverBorder: 'hover:border-amber-500',
    btnBg: 'bg-amber-500',
    btnText: 'text-white',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    icon: <Zap className="w-4 h-4" fill="currentColor" />,
    chart: (
      <div className="flex items-end gap-1 h-[40px] w-[120px]">
        {[4, 5, 4, 6, 8, 5, 9, 7, 10, 11, 12, 14, 16].map((h, i) => (
           <div key={i} className="flex-1 bg-amber-400 rounded-sm opacity-90" style={{ height: `${h * 2.5}px` }} />
        ))}
      </div>
    ),
    tickets: [
      { text: 'NO POWER SUPPLY', count: '4,210' },
      { text: 'TRANSFORMER OR DC BLAST', count: '112' },
      { text: 'STREET LIGHT NOT WORKING', count: '840' },
      { text: 'LOOSE/HANGING WIRE', count: '256' }
    ]
  },
  {
    domain: 'SANITATION OPS',
    name: 'Waste Command',
    statLabel: 'PICKUPS TODAY',
    statValue: '1,284',
    valColor: 'text-emerald-500',
    glowColor: 'from-emerald-500/10',
    glowColorHex: 'rgba(16,185,129,0.08)',
    hoverBorder: 'hover:border-emerald-500',
    btnBg: 'bg-emerald-500',
    btnText: 'text-white',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    icon: <Recycle className="w-4 h-4" />,
    chart: (
      <svg viewBox="0 0 100 40" className="w-[120px] h-[40px] opacity-90" preserveAspectRatio="none">
        <path d="M0,10 L20,15 L40,25 L60,20 L80,30 L100,35" fill="none" stroke="#10b981" strokeWidth="2.5" />
        <path d="M0,10 L20,15 L40,25 L60,20 L80,30 L100,35 L100,40 L0,40 Z" fill="url(#green-grad)" opacity="0.2" />
        <defs>
          <linearGradient id="green-grad" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="#10b981" />
             <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    ),
    tickets: [
      { text: 'GARBAGE NOT COLLECTED', count: '5,214' },
      { text: 'BLOCKED OR BROKEN DRAINAGE', count: '1,432' },
      { text: 'GARBAGE DUMPED ON ROADS', count: '843' },
      { text: 'BAD SMELL OR DISEASE RISK', count: '1,102' }
    ]
  }
];

const Operations: React.FC = () => {
  const [selectedOps, setSelectedOps] = useState<OpsCard | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (selectedOps) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedOps]);

  return (
    <>
      <section id="operations" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto overflow-hidden">
        <div className="mb-16 flex flex-col items-start text-left">
          <span className="text-slate-900 font-bold mb-4 block uppercase font-mono tracking-[0.3em] text-base md:text-lg">01 · Operations</span>
          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter text-slate-900 whitespace-nowrap">Three operations. One control surface.</h2>
          <p className="text-slate-900 text-lg md:text-xl max-w-3xl font-black">
            Pick a domain to enter its live dashboard.<br className="hidden md:block"/>
            Each surface is themed for the signal it monitors — and lights up when things go critical.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 justify-center items-center perspective-[2000px]">
          {opsCards.map((card, idx) => {
            return (
              <motion.div
                key={idx}
                className="w-full flex justify-center h-full group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              >
                 <Card
                   containerHeight="100%"
                   containerWidth="100%"
                   rotateAmplitude={8}
                   scaleOnHover={1.03}
                 >
                    <div className={`w-full h-full bg-white border-2 border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-[24px] overflow-hidden relative flex flex-col transition-colors duration-300 ${card.hoverBorder}`}>
                      {/* Top Glow Gradient */}
                      <div className={`absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b ${card.glowColor} to-transparent pointer-events-none opacity-40`} />

                      <div className="p-8 relative z-10 flex flex-col flex-1">
                        
                        {/* Header */}
                        <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor}`}>
                              {card.icon}
                            </div>
                            <div>
                              <h4 className="text-[11px] text-slate-600 font-bold tracking-[0.2em] uppercase mb-1">{card.domain}</h4>
                              <h3 className="text-xl font-black text-slate-900">{card.name}</h3>
                            </div>
                          </div>
                          <span className="text-[11px] font-black text-rose-500 tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> LIVE
                          </span>
                        </div>



                        {/* Complaints */}
                        <div className="space-y-3 mb-6 flex-1">
                          {card.tickets.map((t, i) => (
                            <div key={i} className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm hover:bg-slate-100 transition-colors">
                              <span className="text-slate-900 text-[11px] lg:text-xs font-bold uppercase truncate">{t.text}</span>
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-widest whitespace-nowrap bg-white border border-slate-200 shadow-sm ${card.valColor}`}>
                                {t.count} ISSUED
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-center text-xs text-slate-800 mt-auto pt-5 border-t border-slate-200 font-black uppercase tracking-wide">
                           <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full bg-current ${card.valColor} animate-pulse shadow-sm`} />
                              <span>Live Sync System</span>
                           </div>
                        </div>

                        {/* Button replacing card click logic */}
                        <button 
                           onClick={() => setSelectedOps(card)}
                           className={`mt-6 w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md ${card.btnBg} ${card.btnText} hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                        >
                           VIEW DASHBOARD &rarr;
                        </button>
                      </div>
                    </div>
                 </Card>
              </motion.div>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-12 mb-8">
           <div className="inline-flex flex-wrap items-center justify-center gap-4 px-8 py-4 bg-slate-900 border border-slate-800 rounded-full shadow-2xl text-sm md:text-base font-mono text-white uppercase tracking-[0.3em] font-black">
              <span>CLICK VIEW DASHBOARD</span>
              <span className="text-slate-500">•</span>
              <span>SECURE LOGIN</span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400">LIVE DASHBOARD</span>
           </div>
        </div>
      </section>

      {/* Dynamic Pop-up Modal */}
      <AnimatePresence>
        {selectedOps && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSelectedOps(null); setIsAuthenticated(false); }}
          >
            <motion.div 
              className={`w-full ${isAuthenticated ? 'max-w-[75rem] h-[85vh]' : 'max-w-md'} bg-white rounded-[24px] overflow-hidden relative shadow-2xl border border-slate-100 flex flex-col`}
              style={{ boxShadow: `0 20px 60px -10px ${selectedOps.glowColorHex}` }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              {isAuthenticated ? (
                <Dashboard 
                  domainName={selectedOps.domain}
                  iconBg={selectedOps.iconBg}
                  iconColor={selectedOps.iconColor}
                  themeColor={selectedOps.valColor}
                  onLogout={() => { setIsAuthenticated(false); setSelectedOps(null); }}
                />
              ) : (
                <>
                  {/* Modal Top Glow */}
                  <div className={`absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b ${selectedOps.glowColor} to-transparent pointer-events-none opacity-50`} />

                  <div className="p-8 relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedOps.iconBg} ${selectedOps.iconColor}`}>
                    {selectedOps.icon}
                  </div>
                  <div>
                    <h4 className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mb-1">{selectedOps.domain}</h4>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{selectedOps.name} Center</h2>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-8 font-medium">
                  Sign in with your municipal credentials to access the live operations dashboard.
                </p>

                {/* Form Fields */}
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest block mb-2">ADMIN ID / PIN</label>
                    <input 
                      type="text" 
                      placeholder="e.g. MUN-110022" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest block mb-2">PASSWORD</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-medium"
                    />
                  </div>
                </div>

                {/* Login Button */}
                <button 
                  onClick={() => setIsAuthenticated(true)}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-transform hover:scale-[1.02] active:scale-[0.98] ${selectedOps.btnBg} ${selectedOps.btnText} mb-6 shadow-md`}
                >
                  Access Command Center &rarr;
                </button>

                {/* Footer */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest mt-auto">
                  <button onClick={() => { setSelectedOps(null); setIsAuthenticated(false); }} className="hover:text-slate-700 transition-colors cursor-pointer">
                    &larr; Back to selector
                  </button>
                  <span>SSO • SAML 2.0</span>
                </div>
              </div>
              </>
            )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Operations;

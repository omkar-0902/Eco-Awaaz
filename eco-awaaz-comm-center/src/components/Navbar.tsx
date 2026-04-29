import React, { useState } from 'react';
import PillNav from './PillNav';
import SignupFlow from './SignupFlow';

import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const [activeHash] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const logoEl = (
    <div className="flex items-center gap-3 w-max">
      <div className="w-10 h-10 flex items-center justify-center transition-all overflow-hidden rounded-full border border-black shadow-sm bg-black">
        <img src={logo} alt="Eco-Awaaz Logo" className="w-full h-full object-cover scale-[1.45]" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-slate-900 text-lg tracking-tight">Eco-Awaaz</span>
        <span className="text-slate-500 text-[10px] tracking-[0.2em] font-bold uppercase hidden lg:block">V1.0 · PILOT</span>
      </div>
    </div>
  );

  const navItems = [
    { label: 'Problem', href: '#problem' },
    { label: 'System', href: '#system' },
    { label: 'Command center', href: '#command-center' },
    { label: 'Impact', href: '#impact' }
  ];

  return (
    <>
      <div className="absolute top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none flex justify-center">
        <nav className="pointer-events-auto backdrop-blur-3xl bg-white/40 border border-black shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.8)] rounded-full w-full max-w-[1600px] transition-all duration-300">
        <div className="flex items-center justify-between h-[72px] px-6">
          
          <div className="w-[300px]">
             {logoEl}
          </div>

          <div className="flex-1 flex justify-center">
            <PillNav 
              items={navItems}
              activeHref={activeHash}
              baseColor="#ffffff" 
              pillColor="#000000" 
              hoveredPillTextColor="#000000"
              pillTextColor="#ffffff"
              className="gap-4"
            />
          </div>

          {/* Action */}
          <div className="w-[300px] flex justify-end">
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="hidden md:block px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 border border-slate-900 rounded-full hover:bg-slate-800 transition-colors cursor-pointer shadow-sm pointer-events-auto"
            >
              Signup &rarr;
            </button>
          </div>
        </div>
      </nav>
    </div>

    {/* Dedicated User Signup Flow that overlays entire UI */}
    <SignupFlow isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
};

export default Navbar;

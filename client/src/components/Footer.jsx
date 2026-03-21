import React from 'react';

const Footer = ({ theme = 'light' }) => {
    const isDark = theme === 'dark';
    return (
        <footer className={`py-8 px-6 mt-auto ${isDark ? 'bg-transparent border-t border-white/5' : 'bg-white border-t border-slate-200'}`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                    <p className={`font-bold text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>© {new Date().getFullYear()} Gradevo. All rights reserved.</p>
                    <div className={`hidden md:block w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                    <a
                        href="http://khushangsingh.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-bold text-sm transition-colors flex items-center gap-1.5 ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-primary'}`}
                    >
                        <span className="material-symbols-outlined text-sm">account_circle</span>
                        Developer
                    </a>
                </div>

                <div className="flex items-center gap-6">
                    <a href="#" className={`font-bold text-sm transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>Privacy</a>
                    <a href="#" className={`font-bold text-sm transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>Terms</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

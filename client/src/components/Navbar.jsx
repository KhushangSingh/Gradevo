import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [logoError, setLogoError] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl shrink-0">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo Section */}
                <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
                    {logoError ? (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                            <span className="material-symbols-outlined text-sm">show_chart</span>
                        </div>
                    ) : (
                        <img src="/Logo.png" alt="Gradevo" onError={() => setLogoError(true)} className="h-8 w-auto object-contain shrink-0" />
                    )}
                    <div className="hidden sm:block">
                        <h1 className="text-slate-900 font-bold text-lg leading-none">Gradevo</h1>
                    </div>
                </Link>

                {/* Navigation Links */}
                <nav className="flex items-center gap-1 sm:gap-2 absolute left-1/2 -translate-x-1/2">
                    <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group ${isActive('/dashboard') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">dashboard</span>
                        <span className="font-medium text-sm hidden md:block">Dashboard</span>
                    </Link>
                    <Link to="/leaderboard" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group ${isActive('/leaderboard') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">leaderboard</span>
                        <span className="font-medium text-sm hidden md:block">Leaderboard</span>
                    </Link>
                    <Link to="/friends" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group ${isActive('/friends') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">person_add</span>
                        <span className="font-medium text-sm hidden md:block">Friends</span>
                    </Link>
                </nav>

                {/* User & Actions */}
                {user && (
                    <div className="flex items-center gap-3 shrink-0">
                        <Link to="/profile" className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border-2 border-primary/30 text-slate-700 font-bold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden lg:flex flex-col items-start pr-1">
                                <p className="text-slate-900 text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-slate-500 text-[10px] mt-0.5">{user.branch}</p>
                            </div>
                        </Link>
                        <button onClick={logout} title="Logout" className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors border border-transparent hover:border-red-200">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;

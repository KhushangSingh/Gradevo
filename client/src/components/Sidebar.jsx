import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [logoError, setLogoError] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 h-screen flex flex-col border-r border-slate-200 bg-white/95 backdrop-blur-xl shrink-0 transition-all duration-300">
            <div className="p-6 flex items-center gap-3">
                {logoError ? (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                        <span className="material-symbols-outlined text-xl">show_chart</span>
                    </div>
                ) : (
                    <img src="/Logo.png" alt="Gradevo" onError={() => setLogoError(true)} className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-primary/20 shrink-0" />
                )}
                <div>
                    <h1 className="text-slate-900 font-bold text-lg leading-tight">Gradevo</h1>
                    <p className="text-slate-500 text-xs">Student Leaderboard</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
                <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/dashboard') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                    <span className={`material-symbols-outlined group-hover:scale-110 transition-transform`}>dashboard</span>
                    <span className="font-medium">Dashboard</span>
                </Link>
                <Link to="/leaderboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/leaderboard') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                    <span className={`material-symbols-outlined group-hover:scale-110 transition-transform`}>leaderboard</span>
                    <span className="font-medium">Leaderboard</span>
                </Link>
                <Link to="/friends" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/friends') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                    <span className={`material-symbols-outlined group-hover:scale-110 transition-transform`}>person_add</span>
                    <span className="font-medium">Friends</span>
                </Link>
            </nav>

            {user && (
                <div className="p-4 border-t border-slate-200">
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors mb-2 group">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-primary/30 text-slate-700 font-bold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden flex-1">
                            <p className="text-slate-900 text-sm font-medium truncate">{user.name}</p>
                            <p className="text-slate-500 text-xs">{user.degree} • {user.branch}</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-sm group-hover:text-primary transition-colors">chevron_right</span>
                    </Link>
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium border border-transparent hover:border-red-200">
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Logout
                    </button>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;

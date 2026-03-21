import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Footer from '../components/Footer';

const LandingPage = () => {
    const { user } = useContext(AuthContext);
    const [logoError, setLogoError] = useState(false);

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="min-h-screen bg-[#050505] font-display text-white relative overflow-hidden">
            {/* Premium Animated Background (Mesh Gradient / Glowing Orbs) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-rose-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }}></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-amber-600/10 rounded-full blur-[140px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }}></div>
                
                {/* Subtle Radial Gradient overlay to focus center */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-80"></div>
            </div>

            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
                <div className="flex items-center gap-2">
                    {logoError ? (
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            <span className="material-symbols-outlined text-xl">show_chart</span>
                        </div>
                    ) : (
                        <img src="/Logo.png" alt="Gradevo" onError={() => setLogoError(true)} className="h-10 w-auto object-contain" />
                    )}
                    <h1 className="text-2xl font-black text-white tracking-tight">Gradevo</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-6 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                        Login
                    </Link>
                    <Link to="/register" className="px-6 py-2.5 rounded-xl font-bold bg-white text-black hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-7xl mx-auto px-6 py-24 lg:py-36 flex flex-col items-center text-center relative z-10">
                <div className="space-y-8 max-w-4xl">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-white mx-auto">
                        Know Where You <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-orange-500">Stand.</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                        Gradevo connects with your college database to provide real-time academic rankings. Compare your performance with peers, batchmates, and your entire department securely.
                    </p>
                    <div className="flex justify-center pt-8">
                        <Link to="/register" className="px-8 py-4 rounded-2xl font-bold bg-orange-500 text-white text-lg hover:bg-orange-600 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2 group w-fit">
                            Check My Rank
                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-slate-400 text-sm font-bold">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[14px] text-orange-400">lock</span>
                            </div>
                            <span>Verified Students Only</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[14px] text-orange-400">bolt</span>
                            </div>
                            <span>Real-time Updates</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="relative z-10 py-24 px-6 border-t border-white/5 bg-[#050505]/50 backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Why use Gradevo?</h2>
                        <p className="text-slate-400 text-lg">The most accurate, granular, and private academic performance insights available.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            { icon: 'domain', title: 'College Verified', desc: 'Secure signup linked exclusively to your official college email domain.' },
                            { icon: 'leaderboard', title: 'Granular Rankings', desc: 'Filter rankings by Batch, Branch, and Specialization instantly.' },
                            { icon: 'lock', title: 'Privacy First', desc: 'Your data is strictly visible only to peers within your own college network.' }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white/[0.02] p-8 rounded-3xl border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm group">
                                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                                    <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="relative z-10">
                <Footer theme="dark" />
            </div>
        </div>
    );
};

export default LandingPage;

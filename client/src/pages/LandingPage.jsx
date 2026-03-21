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
        <div className="min-h-screen bg-white font-display text-slate-900">
            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {logoError ? (
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            <span className="material-symbols-outlined text-xl">show_chart</span>
                        </div>
                    ) : (
                        <img src="/Logo.png" alt="Gradevo" onError={() => setLogoError(true)} className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-orange-500/20" />
                    )}
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Gradevo</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        Login
                    </Link>
                    <Link to="/register" className="px-6 py-2.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-bold text-xs uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        Live College Rankings
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900">
                        Know Where You <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Stand.</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
                        Gradevo connects with your college database to provide real-time academic rankings. Compare your performance with peers, batchmates, and your entire department securely.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link to="/register" className="px-8 py-4 rounded-2xl font-bold bg-orange-500 text-white text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 group">
                            Check My Rank
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                        <Link to="/login" className="px-8 py-4 rounded-2xl font-bold bg-white border-2 border-slate-100 text-slate-700 text-lg hover:border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center">
                            Student Login
                        </Link>
                    </div>

                    <div className="pt-8 flex items-center gap-8 text-slate-400 text-sm font-bold">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                            <span>Verified Students Only</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                            <span>Real-time Updates</span>
                        </div>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-400/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10 grid gap-6">
                        {/* Fake Stat Card 1 */}
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 translate-y-8 w-80 mx-auto lg:ml-auto">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                    <span className="material-symbols-outlined">school</span>
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase">CGPA</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900">9.4</div>
                            <div className="mt-2 text-xs font-bold text-green-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                Top 5% in Batch
                            </div>
                        </div>

                        {/* Fake Stat Card 2 */}
                        <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl shadow-slate-900/20 transform rotate-[6deg] hover:rotate-0 transition-transform duration-500 w-80 mx-auto lg:mr-auto text-white">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Rank</div>
                                    <div className="text-3xl font-black text-white">#04</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined">emoji_events</span>
                                </div>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full rounded-full w-[85%]"></div>
                            </div>
                            <div className="mt-2 text-right text-[10px] font-bold text-slate-400">Computer Science</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="bg-slate-50 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Why use Gradevo?</h2>
                        <p className="text-slate-500">We provide the most accurate and granular academic performance insights available for your institution.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: 'domain', title: 'College Verified', desc: 'Secure signup linked exclusively to your official college email domain.' },
                            { icon: 'leaderboard', title: 'Granular Rankings', desc: 'Filter rankings by Batch, Branch, and Specialization instantly.' },
                            { icon: 'lock', title: 'Privacy First', desc: 'Your data is visible only to peers within your college network.' }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;

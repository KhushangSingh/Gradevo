import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [branchLeaderboard, setBranchLeaderboard] = useState([]);
    const [specLeaderboard, setSpecLeaderboard] = useState([]);
    const [showRecoveryPrompt, setShowRecoveryPrompt] = useState(false);
    
    useEffect(() => {
        if (user) {
          fetchLeaderboards();
        }
    }, [user]);

    useEffect(() => {
        if (user?.hasRecovery === false) {
            setShowRecoveryPrompt(true);
        }
    }, [user]);

    const fetchLeaderboards = async () => {
        try {
            // 1. Fetch MAIN BRANCH leaderboard
            const branchParams = new URLSearchParams({
                batch: user.batch,
                degree: user.degree,
                branch: user.branch,
                college: user.college
            }).toString();
            
            // 2. Fetch SPECIALIZATION leaderboard
            const specParams = new URLSearchParams({
                batch: user.batch,
                degree: user.degree,
                branch: user.branch,
                specialization: user.specialization,
                college: user.college
            }).toString();

            const [branchRes, specRes] = await Promise.all([
                axios.get(`/api/users/leaderboard?${branchParams}`),
                axios.get(`/api/users/leaderboard?${specParams}`)
            ]);

            setBranchLeaderboard(Array.isArray(branchRes.data) ? branchRes.data : []);
            setSpecLeaderboard(Array.isArray(specRes.data) ? specRes.data : []);

        } catch (error) {
            console.error("Error fetching leaderboards", error);
        }
    };

    // Calculate ranks
    const branchRank = branchLeaderboard.find(u => u.isMe)?.rank || '-';
    const specRank = specLeaderboard.find(u => u.isMe)?.rank || '-';

    // Helper for rendering top 3 (or user context) in a mini list
    const renderMiniLeaderboard = (data, title, userRank) => {
        const totalStudents = data.length;
        const percentile = totalStudents > 1 && typeof userRank === 'number' 
            ? ((totalStudents - userRank) / totalStudents * 100).toFixed(0) 
            : 0;

        return (
        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 flex flex-col h-full group hover:shadow-lg hover:shadow-orange-100/30 transition-all duration-300 min-h-[250px]">
            <div className="flex justify-between items-start mb-4">
                <div>
                     <h3 className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">{title}</h3>
                     <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-800 tracking-tighter">#{userRank}</span>
                        <span className="text-slate-400 text-xs font-medium">/ {totalStudents}</span>
                     </div>
                     {typeof userRank === 'number' && (
                         <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100/50">
                             <div className="h-1 w-12 bg-orange-200/50 rounded-full overflow-hidden">
                                 <div className="h-full bg-orange-400 rounded-full" style={{ width: `${percentile}%` }}></div>
                             </div>
                             <span className="text-[9px] font-bold text-orange-600">
                                 Better than {percentile}%
                             </span>
                         </div>
                     )}
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${userRank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-yellow-500/20' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                    <span className="material-symbols-outlined text-xl">{userRank <= 3 ? 'military_tech' : 'leaderboard'}</span>
                </div>
            </div>

            <div className="space-y-2 mt-auto">
                {data.slice(0, 3).map((student) => (
                    <div key={student._id} className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${student.isMe ? 'bg-orange-50 border border-orange-100 text-orange-900 shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}>
                        <div className="flex items-center gap-2.5">
                             <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${student.isMe ? 'bg-orange-500 text-white' : student.rank === 1 ? 'bg-yellow-100 text-yellow-700' : student.rank === 2 ? 'bg-slate-100 text-slate-600' : student.rank === 3 ? 'bg-orange-50 text-orange-700' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                {student.rank === 1 ? '1' : student.rank === 2 ? '2' : student.rank === 3 ? '3' : student.rank}
                             </div>
                             <span className={`text-xs font-bold ${student.isMe ? 'text-orange-900' : 'text-slate-700'}`}>
                                {student.isMe ? 'You' : student.name.split(' ')[0]}
                             </span>
                        </div>
                        <span className={`text-[10px] font-bold ${student.isMe ? 'text-orange-700' : 'text-slate-400'}`}>{student.cgpa}</span>
                    </div>
                ))}
                 {data.length > 3 && (
                     <div className="text-center pt-1">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wide">
                            + {data.length - 3} others
                        </span>
                     </div>
                )}
            </div>
        </div>
    );
    };

    return (
        <div className="space-y-6">
            {showRecoveryPrompt && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="text-lg font-bold text-slate-900">Set Up Password Recovery</h3>
                            <button
                                onClick={() => setShowRecoveryPrompt(false)}
                                className="text-slate-400 hover:text-slate-700"
                                type="button"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <p className="text-sm text-slate-600 mb-5">
                            Add your security question and answer to enable forgot password recovery.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRecoveryPrompt(false)}
                                type="button"
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                            >
                                Later
                            </button>
                            <Link
                                to="/profile"
                                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold text-center"
                            >
                                Open Profile
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Overview for <span className="text-orange-600">{user?.name?.split(' ')[0]}</span> • {user?.college?.split(',')[0]} ( {user?.branch} - {user?.specialization} )</p>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* CGPA Card - Lighter & Smaller */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between h-full min-h-[250px] relative group hover:shadow-lg hover:shadow-orange-100/40 transition-all duration-300">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-60"></div>
                     <div className="relative z-10 flex justify-between items-start">
                         <div className="inline-flex px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100">
                            <h3 className="text-orange-600 text-[10px] font-bold uppercase tracking-widest">CGPA</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-orange-100 flex items-center justify-center bg-white text-orange-400">
                            <span className="material-symbols-outlined text-sm">school</span>
                        </div>
                     </div>

                     <div className="relative z-10 mt-6 text-center">
                        <span className="text-6xl font-black tracking-tighter text-slate-900">{user?.cgpa}</span>
                        <span className="text-slate-300 text-xl font-bold ml-1">/10</span>
                     </div>

                     <div className="relative z-10 mt-auto pt-6">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                             <span>Progress</span>
                             <span>{(user?.cgpa/10)*100}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-300 to-orange-500 h-full rounded-full" style={{ width: `${(user?.cgpa/10)*100}%` }}></div>
                        </div>
                     </div>
                </div>

                {/* Main Branch Ranking Box */}
                {renderMiniLeaderboard(branchLeaderboard, `Overall ${user?.branch}`, branchRank)}

                {/* Specialization Ranking Box */}
                 {renderMiniLeaderboard(specLeaderboard, `${user?.specialization} Major`, specRank)}
            </section>

            {/* Recent Activity or Summary */}
            <div className="bg-gradient-to-br from-white to-orange-50 border border-orange-100 rounded-2xl p-8 text-center shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Keep Climbing!</h3>
                <p className="text-slate-500 max-w-lg mx-auto mb-6">You are doing great. Check the full leaderboard to see detailed statistics and find study partners.</p>
                <Link to="/leaderboard" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20">
                    View Full Leaderboard
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { ACADEMIC_MAP as fallbackMap } from '../utils/academicMap';
import CustomSelect from '../components/CustomSelect';
import COLLEGE_LIST from '../utils/collegeList';

const Profile = () => {
    const { user, fetchUser, logout } = useContext(AuthContext);
    const { addToast, openConfirm } = useContext(ToastContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', cgpa: '', college: '', degree: '', branch: '', specialization: '', batch: ''
    });
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [academicMap, setAcademicMap] = useState(fallbackMap);

    useEffect(() => {
        const fetchMap = async () => {
            try {
                const { data } = await axios.get('/api/users/academic-map');
                // Merge fallback with DB data to ensure everything is present
                setAcademicMap(prev => ({ ...prev, ...data }));
            } catch (err) {
                console.error("Error fetching academic map", err);
            }
        };
        fetchMap();
    }, []);

    const getDegrees = () => Object.keys(academicMap);
    const getBranches = (deg) => deg ? Object.keys(academicMap[deg] || {}) : [];
    const getSpecializations = (deg, br) => (deg && br) ? (academicMap[deg]?.[br] || []) : [];

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '', email: user.email || '', cgpa: user.cgpa || '', college: user.college || '',
                degree: user.degree || '', branch: user.branch || '', specialization: user.specialization || '', batch: user.batch || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'degree') {
            const branches = getBranches(value);
            const firstBranch = branches[0] || '';
            const specs = getSpecializations(value, firstBranch);
            const firstSpec = specs[0] || 'Core';
            setFormData({ ...formData, degree: value, branch: firstBranch, specialization: firstSpec });
        } else if (name === 'branch') {
            const specs = getSpecializations(formData.degree, value);
            const firstSpec = specs[0] || 'Core';
            setFormData({ ...formData, branch: value, specialization: firstSpec });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };

            if (securityQuestion.trim() || securityAnswer.trim()) {
                payload.securityQuestion = securityQuestion;
                payload.securityAnswer = securityAnswer;
            }

            await axios.put('/api/users/profile', payload);
            addToast('Profile updated successfully!', 'success');
            setIsEditing(false);
            setSecurityAnswer('');
            fetchUser(); // Refresh context
        } catch (error) {
            addToast(error.response?.data?.message || 'Update failed', 'error');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = await openConfirm(
            'Delete your account?',
            'This action is permanent and cannot be undone. All your data will be erased.'
        );
        if (confirmed) {
            try {
                await axios.delete('/api/users/profile');
                addToast('Account deleted successfully.', 'info');
                logout();
                navigate('/');
            } catch (error) {
                addToast(error.response?.data?.message || 'Delete failed', 'error');
            }
        }
    }

    const inputClasses = "w-full bg-slate-50 border border-slate-200 hover:border-primary/50 hover:bg-white rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
    const labelClasses = "text-xs font-medium text-slate-500 uppercase ml-1 block mb-1";

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-900">My Profile</h2>
                <button 
                    onClick={() => {
                        if (isEditing) {
                            setFormData({
                                name: user.name || '', email: user.email || '', cgpa: user.cgpa || '', college: user.college || '',
                                degree: user.degree || '', branch: user.branch || '', specialization: user.specialization || '', batch: user.batch || ''
                            });
                            setSecurityQuestion('');
                            setSecurityAnswer('');
                        }
                        setIsEditing(!isEditing);
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isEditing ? 'bg-red-500/10 text-red-500 border-red-200 hover:bg-red-500/20' : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'}`}
                >
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                    <span className="material-symbols-outlined text-base leading-none">
                        {isEditing ? 'close' : 'edit'}
                    </span>
                </button>
            </div>

            {/* On mobile: form first, then action cards. On lg+: side-by-side */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Left Column: visible on lg+ only, reordered on mobile via order utilities */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
                    {/* User Info Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm backdrop-blur-xl flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center border-4 border-white text-slate-700 font-bold text-3xl shadow-lg mb-3">
                            {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <h3 className="text-slate-900 text-lg font-bold">{formData.name}</h3>
                        <p className="text-slate-500 text-sm">{formData.email}</p>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                        <div>
                            <h3 className="text-slate-900 font-bold text-sm mb-0.5">Account Actions</h3>
                            <p className="text-slate-500 text-xs">Sign out of your account on this device.</p>
                        </div>
                        <button onClick={() => { logout(); navigate('/login'); }} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors shadow-sm self-start">
                            <span className="material-symbols-outlined text-sm">logout</span>
                            Log Out
                        </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                        <div>
                            <h3 className="text-red-500 font-bold text-sm mb-0.5">Danger Zone</h3>
                            <p className="text-slate-500 text-xs">Delete your account permanently.</p>
                        </div>
                        <button onClick={handleDeleteAccount} className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold transition-colors self-start">
                            <span className="material-symbols-outlined text-sm">delete_forever</span>
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Right Column: Form — appears first on mobile */}
                <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm backdrop-blur-xl order-1 lg:order-2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} disabled={!isEditing} />
                            </div>
                             <div>
                                <label className={labelClasses}>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} disabled={!isEditing} />
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>College</label>
                            <CustomSelect name="college" value={formData.college} onChange={handleChange} options={COLLEGE_LIST} placeholder="Search your college..." disabled={!isEditing} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Degree</label>
                                <CustomSelect name="degree" value={formData.degree} onChange={handleChange} options={getDegrees()} disabled={!isEditing} />
                            </div>
                            <div>
                                <label className={labelClasses}>Branch</label>
                                <CustomSelect name="branch" value={formData.branch} onChange={handleChange} options={getBranches(formData.degree)} disabled={!isEditing} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Specialization</label>
                                <CustomSelect name="specialization" value={formData.specialization} onChange={handleChange} options={getSpecializations(formData.degree, formData.branch)} disabled={!isEditing} />
                            </div>
                            <div>
                                <label className={labelClasses}>Batch Year</label>
                                <input type="number" name="batch" value={formData.batch} onChange={handleChange} className={inputClasses} disabled={!isEditing} />
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>CGPA</label>
                            <div className="relative">
                                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} className={`${inputClasses} pl-10`} disabled={!isEditing} />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-lg">school</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">Security Recovery</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className={labelClasses}>Security Question</label>
                                    <input
                                        type="text"
                                        name="securityQuestion"
                                        value={securityQuestion}
                                        onChange={(e) => setSecurityQuestion(e.target.value)}
                                        className={inputClasses}
                                        disabled={!isEditing}
                                        placeholder={user?.hasRecovery ? 'Update your question' : 'Set your recovery question'}
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>Security Answer</label>
                                    <input
                                        type="text"
                                        name="securityAnswer"
                                        value={securityAnswer}
                                        onChange={(e) => setSecurityAnswer(e.target.value)}
                                        className={inputClasses}
                                        disabled={!isEditing}
                                        placeholder={user?.hasRecovery ? 'Enter new answer to update' : 'Set your recovery answer'}
                                    />
                                </div>
                                {isEditing && (
                                    <p className="text-xs text-slate-500">
                                        To update recovery, fill both fields together.
                                    </p>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="pt-4 flex gap-3">
                                <button type="submit" className="flex-1 bg-primary hover:bg-orange-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;

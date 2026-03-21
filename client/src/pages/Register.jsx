import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { getDegrees, getBranches, getSpecializations } from '../utils/academicMap';
import CustomSelect from '../components/CustomSelect';
import COLLEGE_LIST from '../utils/collegeList';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cgpa: '',
    college: '',
    degree: 'B.Tech',
    branch: 'CSE',
    specialization: 'Core',
    batch: new Date().getFullYear(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'degree') {
      const firstBranch = getBranches(value)[0] || '';
      const firstSpec = getSpecializations(value, firstBranch)[0] || 'Core';
      setFormData({ ...formData, degree: value, branch: firstBranch, specialization: firstSpec });
    } else if (name === 'branch') {
      const firstSpec = getSpecializations(formData.degree, value)[0] || 'Core';
      setFormData({ ...formData, branch: value, specialization: firstSpec });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.cgpa > 10 || formData.cgpa < 0) {
      addToast('Invalid CGPA. Please enter a value between 0 and 10.', 'warning');
      return;
    }
    if (!formData.college) {
      addToast('Please select your college.', 'warning');
      return;
    }
    try {
      const data = await register(formData);
      addToast('Registration successful! Welcome to Gradevo.', 'success');
      if (data?.collegeWarning) {
        addToast(data.collegeWarning, 'warning');
      }
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    }
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 hover:border-primary/50 hover:bg-white rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-1 focus:ring-primary/50 transition-all";
  const labelClasses = "text-xs font-medium text-slate-500 uppercase ml-1 block mb-1";

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors group"
      >
        <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        Back to Home
      </Link>

      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl w-full max-w-2xl relative z-10 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-500 text-sm">Join the Gradevo leaderboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Full Name</label>
              <input type="text" name="name" placeholder="Rahul Sharma" onChange={handleChange} className={inputClasses} required />
            </div>
            <div>
              <label className={labelClasses}>College Email</label>
              <input type="email" name="email" placeholder="rahul@college.ac.in" onChange={handleChange} className={inputClasses} required />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Password</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} className={inputClasses} required />
          </div>

          <div>
            <label className={labelClasses}>College</label>
            <CustomSelect
              name="college"
              value={formData.college}
              onChange={handleChange}
              options={COLLEGE_LIST}
              placeholder="Search your college..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>CGPA</label>
              <input type="number" name="cgpa" placeholder="e.g. 8.75" step="0.01" onChange={handleChange} className={inputClasses} required />
            </div>
            <div>
              <label className={labelClasses}>Batch Year</label>
              <input type="number" name="batch" placeholder="e.g. 2025" onChange={handleChange} className={inputClasses} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClasses}>Degree</label>
              <CustomSelect
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                options={getDegrees()}
              />
            </div>
            <div>
              <label className={labelClasses}>Branch</label>
              <CustomSelect
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                options={getBranches(formData.degree)}
              />
            </div>
            <div>
              <label className={labelClasses}>Specialization</label>
              <CustomSelect
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                options={getSpecializations(formData.degree, formData.branch)}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 text-white py-3.5 rounded-xl font-bold transition-all active:scale-95 mt-4">
            Create My Account
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:text-orange-600 transition-colors font-medium">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

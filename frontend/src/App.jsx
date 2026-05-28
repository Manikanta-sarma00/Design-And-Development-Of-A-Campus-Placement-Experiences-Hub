// import React, { useState, useEffect, createContext, useContext } from 'react';
// import { Search, Plus, TrendingUp, Users, Building2, BookOpen, LogOut, Menu, X, Heart, Eye, Star, ArrowRight, Award } from 'lucide-react';
// import './App.css';

// // API Configuration
// const API_BASE_URL = 'http://localhost:5000/api';

// // Auth Context
// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));

//   useEffect(() => {
//     if (token) {
//       const userData = JSON.parse(localStorage.getItem('user') || '{}');
//       setUser(userData);
//     }
//   }, [token]);

//   const login = (userData, authToken) => {
//     setUser(userData);
//     setToken(authToken);
//     localStorage.setItem('token', authToken);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => useContext(AuthContext);

// // API Service
// const api = {
//   register: async (data) => {
//     const res = await fetch(`${API_BASE_URL}/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     return res.json();
//   },
//   login: async (data) => {
//     const res = await fetch(`${API_BASE_URL}/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     return res.json();
//   },
//   getExperiences: async () => {
//     const res = await fetch(`${API_BASE_URL}/experiences`);
//     return res.json();
//   },
//   addExperience: async (data, token) => {
//     const res = await fetch(`${API_BASE_URL}/experiences`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(data)
//     });
//     return res.json();
//   },
//   likeExperience: async (id) => {
//     const res = await fetch(`${API_BASE_URL}/experiences/${id}/like`, { method: 'POST' });
//     return res.json();
//   },
//   viewExperience: async (id) => {
//     await fetch(`${API_BASE_URL}/experiences/${id}/view`, { method: 'POST' });
//   },
//   getCompanies: async () => {
//     const res = await fetch(`${API_BASE_URL}/companies`);
//     return res.json();
//   },
//   getStats: async () => {
//     const res = await fetch(`${API_BASE_URL}/stats`);
//     return res.json();
//   },
//   getYearStats: async () => {
//     const res = await fetch(`${API_BASE_URL}/stats/by-year`);
//     return res.json();
//   },
//   getDepartmentStats: async () => {
//     const res = await fetch(`${API_BASE_URL}/stats/by-department`);
//     return res.json();
//   },
//   getSuccessStories: async () => {
//     const res = await fetch(`${API_BASE_URL}/success-stories`);
//     return res.json();
//   }
// };

// // Landing Page Component
// const LandingPage = ({ onLogin, onRegister }) => {
//   const [stats, setStats] = useState({ total_experiences: 450, total_companies: 85, total_students: 1200 });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const data = await api.getStats();
//         setStats(data);
//       } catch (err) {
//         console.log('Using default stats');
//       }
//     };
//     fetchStats();
//   }, []);

//   return (
//     <div className="landing-page">
//       {/* Header */}
//       <div className="landing-header">
//         <h1 className="landing-logo">Campus Placement Experiences Hub</h1>
//         <div className="landing-auth-buttons">
//           <button onClick={onLogin} className="btn-login-header">
//             Login
//           </button>
//           <button onClick={onRegister} className="btn-register-header">
//             Register
//           </button>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <div className="landing-hero">
//         <h1 className="landing-title">Learn from Real Placement Experiences</h1>
//         <p className="landing-subtitle">
//           Connect with seniors, discover interview insights and ace your campus placements
//         </p>

//         {/* Stats */}
//         <div className="landing-stats">
//           <div className="landing-stat-item">
//             <div className="landing-stat-value">{stats.total_experiences}+</div>
//             <div className="landing-stat-label">Total Experiences</div>
//           </div>
          
//           <div className="landing-stat-item">
//             <div className="landing-stat-value">{stats.total_companies}+</div>
//             <div className="landing-stat-label">Companies</div>
//           </div>
          
//           <div className="landing-stat-item">
//             <div className="landing-stat-value">{stats.total_students ? `${(stats.total_students/1000).toFixed(1)}K` : '1.2K'}+</div>
//             <div className="landing-stat-label">Active Students</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Login Component
// const Login = ({ onSwitchToRegister, onBack, onLoginSuccess }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const result = await api.login(formData);
//       if (result.error) {
//         setError(result.error);
//       } else {
//         login(result.user, result.token);
//         onLoginSuccess();
//       }
//     } catch (err) {
//       setError('Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2 className="auth-title">Welcome Back</h2>
//         <p className="auth-subtitle">Login to access your placement hub</p>
        
//         {error && <div className="error-message">{error}</div>}

//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               required
//               value={formData.email}
//               onChange={(e) => setFormData({...formData, email: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               required
//               value={formData.password}
//               onChange={(e) => setFormData({...formData, password: e.target.value})}
//             />
//           </div>

//           <button type="submit" disabled={loading} className="btn-primary">
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p className="auth-switch">
//           Don't have an account?{' '}
//           <button onClick={onSwitchToRegister} className="link-button">
//             Register
//           </button>
//         </p>

//         {onBack && (
//           <button onClick={onBack} className="btn-back">
//             Back to Home
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // Register Component
// const Register = ({ onSwitchToLogin, onBack, onRegisterSuccess }) => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     college: '',
//     department: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await api.register(formData);
//       if (result.error) {
//         setError(result.error);
//       } else {
//         alert('Registration successful! Please login.');
//         onRegisterSuccess();
//       }
//     } catch (err) {
//       setError('Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2 className="auth-title">Create Account</h2>
//         <p className="auth-subtitle">Join the placement community</p>
        
//         {error && <div className="error-message">{error}</div>}

//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <label>Full Name</label>
//             <input
//               type="text"
//               required
//               value={formData.fullName}
//               onChange={(e) => setFormData({...formData, fullName: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               required
//               value={formData.email}
//               onChange={(e) => setFormData({...formData, email: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>College</label>
//             <input
//               type="text"
//               required
//               value={formData.college}
//               onChange={(e) => setFormData({...formData, college: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>Department</label>
//             <input
//               type="text"
//               value={formData.department}
//               onChange={(e) => setFormData({...formData, department: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               required
//               minLength={6}
//               value={formData.password}
//               onChange={(e) => setFormData({...formData, password: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>Confirm Password</label>
//             <input
//               type="password"
//               required
//               value={formData.confirmPassword}
//               onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
//             />
//           </div>

//           <button type="submit" disabled={loading} className="btn-primary">
//             {loading ? 'Creating account...' : 'Register'}
//           </button>
//         </form>

//         <p className="auth-switch">
//           Already have an account?{' '}
//           <button onClick={onSwitchToLogin} className="link-button">
//             Login
//           </button>
//         </p>

//         {onBack && (
//           <button onClick={onBack} className="btn-back">
//             Back to Home
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // Dashboard Component
// const Dashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [yearStats, setYearStats] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [statsData, yearData] = await Promise.all([
//           api.getStats(),
//           api.getYearStats()
//         ]);
//         setStats(statsData);
//         setYearStats(yearData);
//       } catch (err) {
//         console.error('Failed to fetch stats:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="page-content">
//       <h1 className="page-title">Dashboard</h1>
      
//       <div className="stats-grid">
//         <div className="stat-card stat-blue">
//           <div className="stat-icon"><BookOpen size={32} /></div>
//           <div className="stat-value">{stats?.total_experiences || 0}</div>
//           <div className="stat-label">Total Experiences</div>
//         </div>

//         <div className="stat-card stat-green">
//           <div className="stat-icon"><Building2 size={32} /></div>
//           <div className="stat-value">{stats?.total_companies || 0}</div>
//           <div className="stat-label">Companies</div>
//         </div>

//         <div className="stat-card stat-purple">
//           <div className="stat-icon"><Users size={32} /></div>
//           <div className="stat-value">{stats?.total_students || 0}</div>
//           <div className="stat-label">Students Placed</div>
//         </div>

//         <div className="stat-card stat-orange">
//           <div className="stat-icon"><Award size={32} /></div>
//           <div className="stat-value">{stats?.overall_avg_package || 'N/A'}</div>
//           <div className="stat-label">Avg Package</div>
//         </div>
//       </div>

//       <div className="card">
//         <h2 className="card-title">Year-wise Statistics</h2>
//         <div className="year-stats">
//           {yearStats.map((year) => (
//             <div key={year.year} className="year-stat-item">
//               <div className="year-stat-header">
//                 <h3>{year.year}</h3>
//                 <span className="badge">{year.total_placements} placements</span>
//               </div>
//               <div className="year-stat-details">
//                 <div><strong>Companies:</strong> {year.companies_count}</div>
//                 <div><strong>Avg Package:</strong> {year.avg_package}</div>
//                 <div><strong>Highest Package:</strong> {year.highest_package}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Experiences Component
// const Experiences = () => {
//   const [experiences, setExperiences] = useState([]);
//   const [filteredExperiences, setFilteredExperiences] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterDifficulty, setFilterDifficulty] = useState('All');
//   const [loading, setLoading] = useState(true);
//   const [selectedExperience, setSelectedExperience] = useState(null);

//   useEffect(() => {
//     const fetchExperiences = async () => {
//       try {
//         const data = await api.getExperiences();
//         setExperiences(data);
//         setFilteredExperiences(data);
//       } catch (err) {
//         console.error('Failed to fetch experiences:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExperiences();
//   }, []);

//   useEffect(() => {
//     let filtered = experiences;
    
//     if (searchTerm) {
//       filtered = filtered.filter(exp =>
//         exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         exp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         exp.student_name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     if (filterDifficulty !== 'All') {
//       filtered = filtered.filter(exp => exp.difficulty === filterDifficulty);
//     }
    
//     setFilteredExperiences(filtered);
//   }, [searchTerm, filterDifficulty, experiences]);

//   const handleLike = async (id) => {
//     try {
//       const result = await api.likeExperience(id);
//       setExperiences(experiences.map(exp =>
//         exp.id === id ? { ...exp, likes: result.likes } : exp
//       ));
//     } catch (err) {
//       console.error('Failed to like:', err);
//     }
//   };

//   const handleView = async (exp) => {
//     setSelectedExperience(exp);
//     try {
//       await api.viewExperience(exp.id);
//       setExperiences(experiences.map(e =>
//         e.id === exp.id ? { ...e, views: e.views + 1 } : e
//       ));
//     } catch (err) {
//       console.error('Failed to record view:', err);
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="page-content">
//       <h1 className="page-title">Placement Experiences</h1>
      
//       <div className="filters-row">
//         <div className="search-box">
//           <Search size={20} />
//           <input
//             type="text"
//             placeholder="Search by company, role, or student..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
        
//         <select
//           value={filterDifficulty}
//           onChange={(e) => setFilterDifficulty(e.target.value)}
//           className="filter-select"
//         >
//           <option>All</option>
//           <option>Easy</option>
//           <option>Medium</option>
//           <option>Hard</option>
//         </select>
//       </div>

//       <div className="experiences-list">
//         {filteredExperiences.map((exp) => (
//           <div key={exp.id} className="experience-card">
//             <div className="experience-header">
//               <div>
//                 <h3 className="experience-company">{exp.company}</h3>
//                 <p className="experience-role">{exp.role}</p>
//               </div>
//               <div className="experience-badges">
//                 <span className="badge badge-green">{exp.ctc}</span>
//                 <span className={`badge badge-${exp.difficulty.toLowerCase()}`}>
//                   {exp.difficulty}
//                 </span>
//               </div>
//             </div>

//             <div className="experience-details">
//               <div><strong>Student:</strong> {exp.student_name}</div>
//               <div><strong>College:</strong> {exp.college}</div>
//               <div><strong>Department:</strong> {exp.department}</div>
//               <div><strong>Year:</strong> {exp.academic_year}</div>
//             </div>

//             <div className="experience-rating">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   size={16}
//                   className={i < exp.rating ? 'star-filled' : 'star-empty'}
//                 />
//               ))}
//               <span className="rounds-text">{exp.rounds} rounds</span>
//             </div>

//             <p className="experience-text">{exp.experience.substring(0, 200)}...</p>

//             <div className="experience-footer">
//               <div className="experience-actions">
//                 <button onClick={() => handleLike(exp.id)} className="action-btn">
//                   <Heart size={18} />
//                   <span>{exp.likes}</span>
//                 </button>
//                 <div className="action-btn">
//                   <Eye size={18} />
//                   <span>{exp.views}</span>
//                 </div>
//               </div>
//               <button onClick={() => handleView(exp)} className="btn-link">
//                 Read More <ArrowRight size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedExperience && (
//         <div className="modal-overlay" onClick={() => setSelectedExperience(null)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <div>
//                 <h2>{selectedExperience.company}</h2>
//                 <p>{selectedExperience.role}</p>
//               </div>
//               <button onClick={() => setSelectedExperience(null)} className="modal-close">
//                 <X size={24} />
//               </button>
//             </div>
            
//             <div className="modal-body">
//               <div className="modal-info">
//                 <div><strong>Student:</strong> {selectedExperience.student_name}</div>
//                 <div><strong>Package:</strong> {selectedExperience.ctc}</div>
//                 <div><strong>College:</strong> {selectedExperience.college}</div>
//                 <div><strong>Department:</strong> {selectedExperience.department}</div>
//                 <div><strong>Year:</strong> {selectedExperience.academic_year}</div>
//                 <div><strong>Difficulty:</strong> {selectedExperience.difficulty}</div>
//                 <div><strong>Rounds:</strong> {selectedExperience.rounds}</div>
//                 <div><strong>Rating:</strong> {selectedExperience.rating}/5</div>
//               </div>
              
//               <div className="modal-text">{selectedExperience.experience}</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Add Experience Component
// const AddExperience = ({ onSuccess }) => {
//   const { token } = useAuth();
//   const [formData, setFormData] = useState({
//     company: '',
//     role: '',
//     student_name: '',
//     college: '',
//     department: '',
//     academic_year: '2024',
//     ctc: '',
//     rounds: 3,
//     difficulty: 'Medium',
//     rating: 5,
//     experience: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const result = await api.addExperience(formData, token);
//       if (result.error) {
//         setError(result.error);
//       } else {
//         alert('Experience added successfully!');
//         onSuccess();
//       }
//     } catch (err) {
//       setError('Failed to add experience. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-content">
//       <h1 className="page-title">Share Your Experience</h1>
      
//       {error && <div className="error-message">{error}</div>}

//       <form onSubmit={handleSubmit} className="experience-form">
//         <div className="form-grid">
//           <div className="form-group">
//             <label>Company Name *</label>
//             <input
//               type="text"
//               required
//               value={formData.company}
//               onChange={(e) => setFormData({...formData, company: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>Role *</label>
//             <input
//               type="text"
//               required
//               value={formData.role}
//               onChange={(e) => setFormData({...formData, role: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>Student Name *</label>
//             <input
//               type="text"
//               required
//               value={formData.student_name}
//               onChange={(e) => setFormData({...formData, student_name: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>College *</label>
//             <input
//               type="text"
//               required
//               value={formData.college}
//               onChange={(e) => setFormData({...formData, college: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>Department *</label>
//             <input
//               type="text"
//               required
//               value={formData.department}
//               onChange={(e) => setFormData({...formData, department: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>Academic Year *</label>
//             <input
//               type="text"
//               required
//               placeholder="e.g., 2024"
//               value={formData.academic_year}
//               onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>CTC/Package *</label>
//             <input
//               type="text"
//               required
//               placeholder="e.g., 12 LPA"
//               value={formData.ctc}
//               onChange={(e) => setFormData({...formData, ctc: e.target.value})}
//             />
//           </div>

//           <div className="form-group">
//             <label>Number of Rounds *</label>
//             <input
//               type="number"
//               required
//               min="1"
//               max="10"
//               value={formData.rounds}
//               onChange={(e) => setFormData({...formData, rounds: parseInt(e.target.value)})}
//             />
//           </div>

//           <div className="form-group">
//             <label>Difficulty *</label>
//             <select
//               required
//               value={formData.difficulty}
//               onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
//             >
//               <option>Easy</option>
//               <option>Medium</option>
//               <option>Hard</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Rating (1-5) *</label>
//             <input
//               type="number"
//               required
//               min="1"
//               max="5"
//               value={formData.rating}
//               onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Your Experience *</label>
//           <textarea
//             required
//             rows="10"
//             placeholder="Share your interview experience, tips, and advice for others..."
//             value={formData.experience}
//             onChange={(e) => setFormData({...formData, experience: e.target.value})}
//           />
//         </div>

//         <button type="submit" disabled={loading} className="btn-primary btn-large">
//           {loading ? 'Submitting...' : 'Submit Experience'}
//         </button>
//       </form>
//     </div>
//   );
// };

// // Companies Component
// const Companies = () => {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const data = await api.getCompanies();
//         setCompanies(data);
//       } catch (err) {
//         console.error('Failed to fetch companies:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCompanies();
//   }, []);

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="page-content">
//       <h1 className="page-title">Companies</h1>

//       <div className="companies-grid">
//         {companies.map((company) => (
//           <div key={company.id} className="company-card">
//             <div className="company-icon">
//               <Building2 size={24} />
//             </div>
//             <h3 className="company-name">{company.name}</h3>
//             <p className="company-description">{company.description}</p>
//             <div className="company-stats">
//               <div>
//                 <span className="label">Avg Package:</span>
//                 <span className="value">{company.avg_package}</span>
//               </div>
//               <div>
//                 <span className="label">Rating:</span>
//                 <span className="value">{company.avg_rating} ⭐</span>
//               </div>
//               <div>
//                 <span className="label">Reviews:</span>
//                 <span className="value">{company.total_reviews}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Statistics Component
// const Statistics = () => {
//   const [departmentStats, setDepartmentStats] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const data = await api.getDepartmentStats();
//         setDepartmentStats(data);
//       } catch (err) {
//         console.error('Failed to fetch stats:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="page-content">
//       <h1 className="page-title">Department Statistics</h1>

//       <div className="dept-stats">
//         {departmentStats.map((dept) => (
//           <div key={dept.department} className="dept-card">
//             <div className="dept-header">
//               <h3>{dept.department}</h3>
//               <span className="badge">{dept.total_placements} placements</span>
//             </div>

//             <div className="dept-stats-grid">
//               <div className="dept-stat">
//                 <div className="stat-label">Students Placed</div>
//                 <div className="stat-value">{dept.students_placed}</div>
//               </div>
//               <div className="dept-stat">
//                 <div className="stat-label">Companies</div>
//                 <div className="stat-value">{dept.companies_count}</div>
//               </div>
//               <div className="dept-stat">
//                 <div className="stat-label">Avg Package</div>
//                 <div className="stat-value">{dept.avg_package}</div>
//               </div>
//               <div className="dept-stat">
//                 <div className="stat-label">Highest Package</div>
//                 <div className="stat-value">{dept.highest_package}</div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Success Stories Component
// const SuccessStories = () => {
//   const [stories, setStories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedStory, setSelectedStory] = useState(null);

//   useEffect(() => {
//     const fetchStories = async () => {
//       try {
//         const data = await api.getSuccessStories();
//         setStories(data);
//       } catch (err) {
//         console.error('Failed to fetch stories:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStories();
//   }, []);

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="page-content">
//       <h1 className="page-title">Success Stories</h1>

//       <div className="stories-grid">
//         {stories.map((story) => (
//           <div key={story.id} className="story-card">
//             <div className="story-avatar">
//               {story.student_name.charAt(0)}
//             </div>
//             <h3 className="story-name">{story.student_name}</h3>
//             <p className="story-college">{story.college}</p>
//             <div className="story-badges">
//               <span className="badge badge-green">{story.package}</span>
//               <span className="badge">{story.company}</span>
//             </div>
//             <p className="story-text">{story.story.substring(0, 150)}...</p>
//             <button onClick={() => setSelectedStory(story)} className="btn-link">
//               Read Full Story <ArrowRight size={16} />
//             </button>
//           </div>
//         ))}
//       </div>

//       {selectedStory && (
//         <div className="modal-overlay" onClick={() => setSelectedStory(null)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <div className="story-modal-header">
//                 <div className="story-avatar large">
//                   {selectedStory.student_name.charAt(0)}
//                 </div>
//                 <div>
//                   <h2>{selectedStory.student_name}</h2>
//                   <p>{selectedStory.college} - {selectedStory.branch}</p>
//                 </div>
//               </div>
//               <button onClick={() => setSelectedStory(null)} className="modal-close">
//                 <X size={24} />
//               </button>
//             </div>
            
//             <div className="modal-body">
//               <div className="story-modal-info">
//                 <div>
//                   <div className="label">Company</div>
//                   <div className="value">{selectedStory.company}</div>
//                 </div>
//                 <div>
//                   <div className="label">Package</div>
//                   <div className="value">{selectedStory.package}</div>
//                 </div>
//               </div>
              
//               <div className="modal-text">{selectedStory.story}</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Main App Component
// const App = () => {
//   const [currentView, setCurrentView] = useState('landing');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const { user, logout, isAuthenticated } = useAuth();
  
//   const navigation = [
//     { name: 'Dashboard', icon: TrendingUp, view: 'dashboard' },
//     { name: 'Experiences', icon: BookOpen, view: 'experiences' },
//     { name: 'Add Experience', icon: Plus, view: 'add-experience' },
//     { name: 'Companies', icon: Building2, view: 'companies' },
//     { name: 'Statistics', icon: Users, view: 'statistics' },
//     { name: 'Success Stories', icon: Award, view: 'success-stories' },
//   ];

//   const handleLogout = () => {
//     logout();
//     setCurrentView('landing');
//   };

//   // Show landing page for non-authenticated users
//   if (!isAuthenticated) {
//     if (currentView === 'landing') {
//       return (
//         <LandingPage
//           onLogin={() => setCurrentView('login')}
//           onRegister={() => setCurrentView('register')}
//         />
//       );
//     }
    
//     if (currentView === 'login') {
//       return (
//         <Login
//           onSwitchToRegister={() => setCurrentView('register')}
//           onBack={() => setCurrentView('landing')}
//           onLoginSuccess={() => setCurrentView('dashboard')}
//         />
//       );
//     }
    
//     if (currentView === 'register') {
//       return (
//         <Register
//           onSwitchToLogin={() => setCurrentView('login')}
//           onBack={() => setCurrentView('landing')}
//           onRegisterSuccess={() => setCurrentView('login')}
//         />
//       );
//     }
//   }

//   // Authenticated user view
//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
//         <div className="sidebar-header">
//           <h1>Campus Placement Experiences hub</h1>
//           <p>{user?.fullName}</p>
//         </div>

//         <nav className="sidebar-nav">
//           {navigation.map((item) => (
//             <button
//               key={item.view}
//               onClick={() => {
//                 setCurrentView(item.view);
//                 setIsSidebarOpen(false);
//               }}
//               className={`nav-item ${currentView === item.view ? 'active' : ''}`}
//             >
//               <item.icon size={20} />
//               {item.name}
//             </button>
//           ))}
//         </nav>

//         <div className="sidebar-footer">
//           <button onClick={handleLogout} className="logout-btn">
//             <LogOut size={20} />
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         {/* Top Bar */}
//         <div className="top-bar">
//           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-btn">
//             {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//           <div className="user-info">
//             <div className="user-name">{user?.fullName}</div>
//             <div className="user-email">{user?.email}</div>
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="content-area">
//           {currentView === 'dashboard' && <Dashboard />}
//           {currentView === 'experiences' && <Experiences />}
//           {currentView === 'add-experience' && (
//             <AddExperience onSuccess={() => setCurrentView('experiences')} />
//           )}
//           {currentView === 'companies' && <Companies />}
//           {currentView === 'statistics' && <Statistics />}
//           {currentView === 'success-stories' && <SuccessStories />}
//         </div>
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       {isSidebarOpen && (
//         <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
//       )}
//     </div>
//   );
// };

// // Root Component with Auth Provider
// const Root = () => {
//   return (
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   );
// };

// export default App;
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Search, Plus, TrendingUp, Users, Building2, BookOpen, LogOut, Menu, X, Heart, Eye, Star, ArrowRight, Award, UserCircle } from 'lucide-react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// API Service
const api = {
  register: async (data) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  login: async (data) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getExperiences: async () => {
    const res = await fetch(`${API_BASE_URL}/experiences`);
    return res.json();
  },
  addExperience: async (data, token) => {
    const res = await fetch(`${API_BASE_URL}/experiences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  likeExperience: async (id) => {
    const res = await fetch(`${API_BASE_URL}/experiences/${id}/like`, { method: 'POST' });
    return res.json();
  },
  viewExperience: async (id) => {
    await fetch(`${API_BASE_URL}/experiences/${id}/view`, { method: 'POST' });
  },
  getCompanies: async () => {
    const res = await fetch(`${API_BASE_URL}/companies`);
    return res.json();
  },
  getStats: async () => {
    const res = await fetch(`${API_BASE_URL}/stats`);
    return res.json();
  },
  getYearStats: async () => {
    const res = await fetch(`${API_BASE_URL}/stats/by-year`);
    return res.json();
  },
  getDepartmentStats: async () => {
    const res = await fetch(`${API_BASE_URL}/stats/by-department`);
    return res.json();
  },
  getSuccessStories: async () => {
    const res = await fetch(`${API_BASE_URL}/success-stories`);
    return res.json();
  }
};

// =============================================
// Professional Success Modal Component ← NEW
// =============================================
const SuccessModal = ({ message, subMessage, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-modal-icon">
          <svg viewBox="0 0 52 52" className="checkmark">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h2 className="success-modal-title">{message}</h2>
        <p className="success-modal-sub">{subMessage}</p>
        <div className="success-modal-bar">
          <div className="success-modal-bar-fill"></div>
        </div>
      </div>
    </div>
  );
};

// Landing Page Component
// Counter animation hook
const useCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

// Typing effect hook
const useTypingEffect = (text, speed = 60) => {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);
  return displayed;
};

// Floating Particle
const Particle = ({ style }) => (
  <div className="particle" style={style} />
);

// Landing Page Component
const LandingPage = ({ onLogin, onRegister }) => {
  const [stats, setStats] = useState({
    total_experiences: 0,
    total_companies: 0,
    total_students: 0
  });
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [visible, setVisible] = useState(true);

  // Typing effect on title
  

  // Counter animations — only start after stats loaded
  const expCount = useCounter(statsLoaded ? stats.total_experiences : 0);
  const compCount = useCounter(statsLoaded ? stats.total_companies : 0);
  const studCount = useCounter(statsLoaded ? stats.total_students : 0);

  // Particles config
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    style: {
      width: `${Math.random() * 10 + 4}px`,
      height: `${Math.random() * 10 + 4}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 6 + 4}s`,
      animationDelay: `${Math.random() * 4}s`,
      opacity: Math.random() * 0.5 + 0.2,
    }
  }));

  useEffect(() => {
    // Fade in on load
    

    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        setStats({
          total_experiences: data.total_experiences || 450,
          total_companies: data.total_companies || 85,
          total_students: data.total_students || 50
        });
      } catch (err) {
        setStats({ total_experiences: 450, total_companies: 85, total_students: 50 });
      } finally {
        setStatsLoaded(true);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={`landing-page ${visible ? 'landing-visible' : ''}`}>

      {/* Floating Particles */}
      <div className="particles-container">
        {particles.map((p) => (
          <Particle key={p.id} style={p.style} />
        ))}
      </div>

      {/* Header */}
      <div className="landing-header fade-down">
        <h1 className="landing-logo">Campus Placement Experiences Hub</h1>
        <div className="landing-auth-buttons">
          <button onClick={onLogin} className="btn-login-header">Login</button>
          <button onClick={onRegister} className="btn-register-header">Register</button>
        </div>
      </div>

      {/* College Banner */}
      <div className="college-banner fade-down">
        <div className="college-banner-shine"></div>
        <span className="college-banner-text">🎓 Bonam Venkata Chalamayya Engineering College,Odalarevu</span>
      </div>

      {/* Hero Section */}
      <div className="landing-hero">

        {/* Typing title */}
        <h1 className="landing-title slide-up">
          Learn from Real Placement Experiences
        </h1>

        <p className="landing-subtitle slide-up-delay">
          Connect with seniors, discover interview insights and ace your campus placements
        </p>

        {/* Animated Stats */}
        <div className="landing-stats slide-up-delay-2">
          <div className="landing-stat-item">
            <div className="landing-stat-value">{expCount}+</div>
            <div className="landing-stat-label">Total Experiences</div>
          </div>
          <div className="landing-stat-item">
            <div className="landing-stat-value">{compCount}+</div>
            <div className="landing-stat-label">Companies</div>
          </div>
          <div className="landing-stat-item">
            <div className="landing-stat-value">{studCount}+</div>
            <div className="landing-stat-label">Active Students</div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Login Component
const Login = ({ onSwitchToRegister, onBack, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.login(formData);
      if (result.error) {
        setError(result.error);
      } else {
        login(result.user, result.token);
        onLoginSuccess();
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to access your placement hub</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="link-button">Register</button>
        </p>
        {onBack && <button onClick={onBack} className="btn-back">Back to Home</button>}
      </div>
    </div>
  );
};

// Register Component
const Register = ({ onSwitchToLogin, onBack, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', rollNumber: '',
    college: '', department: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const roll = formData.rollNumber.trim().toUpperCase();
    if (roll.length !== 10) {
      setError('Roll number must be exactly 10 characters (e.g. 22221A04R6)');
      return;
    }
    if (!roll[0].match(/\d/) || !roll[1].match(/\d/)) {
      setError('Roll number must start with regulation year digits (e.g. 22)');
      return;
    }
    if (roll[2] !== '2' || roll[3] !== '2') {
      setError('Invalid roll number — college code must be wrong');
      return;
    }
    if (!formData.email.endsWith('@bvcgroup.in')) {
      setError('Only @bvcgroup.in college email addresses are allowed');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await api.register({...formData, rollNumber: roll});
      if (result.error) {
        setError(result.error);
      } else {
        onRegisterSuccess();
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the placement community</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" required value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Roll Number</label>
            <input type="text" required maxLength={10} placeholder="e.g. 22221A04R6"
              value={formData.rollNumber}
              onChange={(e) => setFormData({...formData, rollNumber: e.target.value.toUpperCase()})} />
          </div>
          <div className="form-group">
            <input type="email"
            placeholder="Enter email"
              value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>College</label>
            <input type="text" required value={formData.college}
              onChange={(e) => setFormData({...formData, college: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required minLength={6} value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" required value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="link-button">Login</button>
        </p>
        {onBack && <button onClick={onBack} className="btn-back">Back to Home</button>}
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [yearStats, setYearStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, yearData] = await Promise.all([
          api.getStats(),
          api.getYearStats()
        ]);
        setStats(statsData);
        setYearStats(yearData);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-content">
      <h1 className="page-title">Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon"><BookOpen size={32} /></div>
          <div className="stat-value">{stats?.total_experiences || 0}</div>
          <div className="stat-label">Total Experiences</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon"><Building2 size={32} /></div>
          <div className="stat-value">{stats?.total_companies || 0}</div>
          <div className="stat-label">Companies</div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon"><Users size={32} /></div>
          <div className="stat-value">{stats?.total_students || 0}</div>
          <div className="stat-label">Students Placed</div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-icon"><Award size={32} /></div>
          <div className="stat-value">{stats?.overall_avg_package || 'N/A'}</div>
          <div className="stat-label">Avg Package</div>
        </div>
      </div>
      <div className="card">
        <h2 className="card-title">Year-wise Statistics</h2>
        <div className="year-stats">
          {yearStats.map((year) => (
            <div key={year.year} className="year-stat-item">
              <div className="year-stat-header">
                <h3>{year.year}</h3>
                <span className="badge">{year.total_placements} placements</span>
              </div>
              <div className="year-stat-details">
                <div><strong>Companies:</strong> {year.companies_count}</div>
                <div><strong>Avg Package:</strong> {year.avg_package}</div>
                <div><strong>Highest Package:</strong> {year.highest_package}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Experiences Component
const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await api.getExperiences();
        setExperiences(data);
        setFilteredExperiences(data);
      } catch (err) {
        console.error('Failed to fetch experiences:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  useEffect(() => {
    let filtered = experiences;
    if (searchTerm) {
      filtered = filtered.filter(exp =>
        exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.student_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterDifficulty !== 'All') {
      filtered = filtered.filter(exp => exp.difficulty === filterDifficulty);
    }
    setFilteredExperiences(filtered);
  }, [searchTerm, filterDifficulty, experiences]);

  const handleLike = async (id) => {
    try {
      const result = await api.likeExperience(id);
      setExperiences(experiences.map(exp =>
        exp.id === id ? { ...exp, likes: result.likes } : exp
      ));
    } catch (err) {
      console.error('Failed to like:', err);
    }
  };

  const handleView = async (exp) => {
    setSelectedExperience(exp);
    try {
      await api.viewExperience(exp.id);
      setExperiences(experiences.map(e =>
        e.id === exp.id ? { ...e, views: e.views + 1 } : e
      ));
    } catch (err) {
      console.error('Failed to record view:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-content">
      <h1 className="page-title">Placement Experiences</h1>
      <div className="filters-row">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Search by company, role, or student..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)} className="filter-select">
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <div className="experiences-list">
        {filteredExperiences.map((exp) => (
          <div key={exp.id} className="experience-card">
            <div className="experience-header">
              <div>
                <h3 className="experience-company">{exp.company}</h3>
                <p className="experience-role">{exp.role}</p>
              </div>
              <div className="experience-badges">
                <span className="badge badge-green">{exp.ctc}</span>
                <span className={`badge badge-${exp.difficulty.toLowerCase()}`}>{exp.difficulty}</span>
              </div>
            </div>
            <div className="experience-details">
              <div><strong>Student:</strong> {exp.student_name}</div>
              <div><strong>College:</strong> {exp.college}</div>
              <div><strong>Department:</strong> {exp.department}</div>
              <div><strong>Year:</strong> {exp.academic_year}</div>
            </div>
            <div className="experience-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < exp.rating ? 'star-filled' : 'star-empty'} />
              ))}
              <span className="rounds-text">{exp.rounds} rounds</span>
            </div>
            <p className="experience-text">{exp.experience.substring(0, 200)}...</p>
            <div className="experience-footer">
              <div className="experience-actions">
                <button onClick={() => handleLike(exp.id)} className="action-btn">
                  <Heart size={18} /><span>{exp.likes}</span>
                </button>
                <div className="action-btn">
                  <Eye size={18} /><span>{exp.views}</span>
                </div>
              </div>
              <button onClick={() => handleView(exp)} className="btn-link">
                Read More <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedExperience && (
        <div className="modal-overlay" onClick={() => setSelectedExperience(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedExperience.company}</h2>
                <p>{selectedExperience.role}</p>
              </div>
              <button onClick={() => setSelectedExperience(null)} className="modal-close">
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-info">
                <div><strong>Student:</strong> {selectedExperience.student_name}</div>
                <div><strong>Package:</strong> {selectedExperience.ctc}</div>
                <div><strong>College:</strong> {selectedExperience.college}</div>
                <div><strong>Department:</strong> {selectedExperience.department}</div>
                <div><strong>Year:</strong> {selectedExperience.academic_year}</div>
                <div><strong>Difficulty:</strong> {selectedExperience.difficulty}</div>
                <div><strong>Rounds:</strong> {selectedExperience.rounds}</div>
                <div><strong>Rating:</strong> {selectedExperience.rating}/5</div>
              </div>
              <div className="modal-text">{selectedExperience.experience}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Experience Component
const AddExperience = ({ onSuccess }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    company: '', role: '', student_name: '', college: '',
    department: '', academic_year: '2024', ctc: '',
    rounds: 3, difficulty: 'Medium', rating: 5, experience: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.addExperience(formData, token);
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('Failed to add experience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Share Your Experience</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="experience-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Company Name *</label>
            <input type="text" required value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Role *</label>
            <input type="text" required value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Student Name *</label>
            <input type="text" required value={formData.student_name}
              onChange={(e) => setFormData({...formData, student_name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>College *</label>
            <input type="text" required value={formData.college}
              onChange={(e) => setFormData({...formData, college: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Department *</label>
            <input type="text" required value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Academic Year *</label>
            <input type="text" required placeholder="e.g., 2024" value={formData.academic_year}
              onChange={(e) => setFormData({...formData, academic_year: e.target.value})} />
          </div>
          <div className="form-group">
            <label>CTC/Package *</label>
            <input type="text" required placeholder="e.g., 12 LPA" value={formData.ctc}
              onChange={(e) => setFormData({...formData, ctc: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Number of Rounds *</label>
            <input type="number" required min="1" max="10" value={formData.rounds}
              onChange={(e) => setFormData({...formData, rounds: parseInt(e.target.value)})} />
          </div>
          <div className="form-group">
            <label>Difficulty *</label>
            <select required value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div className="form-group">
            <label>Rating (1-5) *</label>
            <input type="number" required min="1" max="5" value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})} />
          </div>
        </div>
        <div className="form-group">
          <label>Your Experience *</label>
          <textarea required rows="10"
            placeholder="Share your interview experience, tips, and advice for others..."
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary btn-large">
          {loading ? 'Submitting...' : 'Submit Experience'}
        </button>
      </form>
    </div>
  );
};

// Companies Component
const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await api.getCompanies();
        setCompanies(data);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-content">
      <h1 className="page-title">Companies</h1>
      <div className="companies-grid">
        {companies.map((company) => (
          <div key={company.id} className="company-card">
            <div className="company-icon"><Building2 size={24} /></div>
            <h3 className="company-name">{company.name}</h3>
            <p className="company-description">{company.description}</p>
            <div className="company-stats">
              <div><span className="label">Avg Package:</span><span className="value">{company.avg_package}</span></div>
              <div><span className="label">Rating:</span><span className="value">{company.avg_rating} ⭐</span></div>
              <div><span className="label">Reviews:</span><span className="value">{company.total_reviews}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Statistics Component
const Statistics = () => {
  const [departmentStats, setDepartmentStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDepartmentStats();
        setDepartmentStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-content">
      <h1 className="page-title">Department Statistics</h1>
      <div className="dept-stats">
        {departmentStats.map((dept) => (
          <div key={dept.department} className="dept-card">
            <div className="dept-header">
              <h3>{dept.department}</h3>
              <span className="badge">{dept.total_placements} placements</span>
            </div>
            <div className="dept-stats-grid">
              <div className="dept-stat">
                <div className="stat-label">Students Placed</div>
                <div className="stat-value">{dept.students_placed}</div>
              </div>
              <div className="dept-stat">
                <div className="stat-label">Companies</div>
                <div className="stat-value">{dept.companies_count}</div>
              </div>
              <div className="dept-stat">
                <div className="stat-label">Avg Package</div>
                <div className="stat-value">{dept.avg_package}</div>
              </div>
              <div className="dept-stat">
                <div className="stat-label">Highest Package</div>
                <div className="stat-value">{dept.highest_package}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Success Stories Component
const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await api.getSuccessStories();
        setStories(data);
      } catch (err) {
        console.error('Failed to fetch stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-content">
      <h1 className="page-title">Success Stories</h1>
      <div className="stories-grid">
        {stories.map((story) => (
          <div key={story.id} className="story-card">
            <div className="story-avatar">{story.student_name.charAt(0)}</div>
            <h3 className="story-name">{story.student_name}</h3>
            <p className="story-college">{story.college}</p>
            <div className="story-badges">
              <span className="badge badge-green">{story.package}</span>
              <span className="badge">{story.company}</span>
            </div>
            <p className="story-text">{story.story.substring(0, 150)}...</p>
            <button onClick={() => setSelectedStory(story)} className="btn-link">
              Read Full Story <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {selectedStory && (
        <div className="modal-overlay" onClick={() => setSelectedStory(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="story-modal-header">
                <div className="story-avatar large">{selectedStory.student_name.charAt(0)}</div>
                <div>
                  <h2>{selectedStory.student_name}</h2>
                  <p>{selectedStory.college} - {selectedStory.branch}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStory(null)} className="modal-close">
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="story-modal-info">
                <div><div className="label">Company</div><div className="value">{selectedStory.company}</div></div>
                <div><div className="label">Package</div><div className="value">{selectedStory.package}</div></div>
              </div>
              <div className="modal-text">{selectedStory.story}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Page Component
const Profile = () => {
  const { user } = useAuth();

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="page-content">
      <h1 className="page-title">My Profile</h1>
      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <h2 className="profile-name">{user?.fullName}</h2>
          <p className="profile-email">{user?.email}</p>
        </div>
        <div className="profile-details">
          <div className="profile-detail-item">
            <span className="profile-detail-label">Full Name</span>
            <span className="profile-detail-value">{user?.fullName || 'N/A'}</span>
          </div>
          <div className="profile-detail-item">
            <span className="profile-detail-label">Email</span>
            <span className="profile-detail-value">{user?.email || 'N/A'}</span>
          </div>
          <div className="profile-detail-item">
            <span className="profile-detail-label">Roll Number</span>
            <span className="profile-detail-value">{user?.rollNumber || 'N/A'}</span>
          </div>
          <div className="profile-detail-item">
            <span className="profile-detail-label">College</span>
            <span className="profile-detail-value">{user?.college || 'N/A'}</span>
          </div>
          <div className="profile-detail-item">
            <span className="profile-detail-label">Department</span>
            <span className="profile-detail-value">{user?.department || 'N/A'}</span>
          </div>
          <div className="profile-detail-item">
            <span className="profile-detail-label">Joined Date</span>
            <span className="profile-detail-value">{formatDate(user?.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================
// Main App Component
// =============================================
const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const [successModal, setSuccessModal] = useState(null);
  const showSuccess = (message, subMessage = '') => setSuccessModal({ message, subMessage });

  const navigation = [
    { name: 'Dashboard', icon: TrendingUp, view: 'dashboard' },
    { name: 'Experiences', icon: BookOpen, view: 'experiences' },
    { name: 'Add Experience', icon: Plus, view: 'add-experience' },
    { name: 'Companies', icon: Building2, view: 'companies' },
    { name: 'Statistics', icon: Users, view: 'statistics' },
    { name: 'Success Stories', icon: Award, view: 'success-stories' },
  ];

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
  };

  if (!isAuthenticated) {
    if (currentView === 'landing') {
      return (
        <>
          {successModal && <SuccessModal message={successModal.message} subMessage={successModal.subMessage} onClose={() => setSuccessModal(null)} />}
          <LandingPage
            onLogin={() => setCurrentView('login')}
            onRegister={() => setCurrentView('register')}
          />
        </>
      );
    }
    if (currentView === 'login') {
      return (
        <>
          {successModal && <SuccessModal message={successModal.message} subMessage={successModal.subMessage} onClose={() => setSuccessModal(null)} />}
          <Login
            onSwitchToRegister={() => setCurrentView('register')}
            onBack={() => setCurrentView('landing')}
            onLoginSuccess={() => {
              showSuccess('Login Successful!', 'Welcome back to Campus Placement Hub 👋');
              setCurrentView('dashboard');
            }}
          />
        </>
      );
    }
    if (currentView === 'register') {
      return (
        <>
          {successModal && <SuccessModal message={successModal.message} subMessage={successModal.subMessage} onClose={() => setSuccessModal(null)} />}
          <Register
            onSwitchToLogin={() => setCurrentView('login')}
            onBack={() => setCurrentView('landing')}
            onRegisterSuccess={() => {
              showSuccess('Registration Successful!', 'Your account has been created ✅');
              setCurrentView('login');
            }}
          />
        </>
      );
    }
  }

  return (
    <div className="app-container">
      {successModal && <SuccessModal message={successModal.message} subMessage={successModal.subMessage} onClose={() => setSuccessModal(null)} />}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1>Campus Placement Experiences hub</h1>
          <p>{user?.fullName}</p>
        </div>
        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setCurrentView(item.view);
                setIsSidebarOpen(false);
              }}
              className={`nav-item ${currentView === item.view ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {item.name}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-btn">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div
            className="user-info"
            onClick={() => setCurrentView('profile')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <UserCircle size={36} color="#3b82f6" />
            <div>
              <div className="user-name">{user?.fullName}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
        </div>

        <div className="content-area">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'experiences' && <Experiences />}
          {currentView === 'add-experience' && (
            <AddExperience onSuccess={() => {
              showSuccess('Experience Shared!', 'Thank you for helping your fellow students 🎉');
              setCurrentView('experiences');
            }} />
          )}
          {currentView === 'companies' && <Companies />}
          {currentView === 'statistics' && <Statistics />}
          {currentView === 'success-stories' && <SuccessStories />}
          {currentView === 'profile' && <Profile />}
        </div>
      </div>

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

const Root = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default Root;
 

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialUsers = [
  { email: 'sysadmin', password: 'test3', username: 'Sysadmin' },
];

const SignInSignUp = () => {
  const [tab, setTab] = useState('signin');
  const [users, setUsers] = useState(initialUsers);
  const [signIn, setSignIn] = useState({ email: '', password: '', remember: false });
  const [signUp, setSignUp] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    const found = users.find(u => u.email === signIn.email && u.password === signIn.password);
    if (found) {
      sessionStorage.setItem('auth', '1');
      navigate('/diagram-dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setUsers([...users, { ...signUp }]);
    setTab('signin');
    setSignIn({ email: signUp.email, password: signUp.password, remember: false });
    setSignUp({ username: '', email: '', password: '' });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 bg-primary text-white text-2xl font-bold">S</div>
        <div className="text-xl font-bold mb-6">Sure Diagrammer</div>
        <div className="flex w-full mb-6">
          <button className={`flex-1 py-2 rounded-l-lg font-medium ${tab === 'signin' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`} onClick={() => { setTab('signin'); setError(''); }}>Sign In</button>
          <button className={`flex-1 py-2 rounded-r-lg font-medium ${tab === 'signup' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`} onClick={() => { setTab('signup'); setError(''); }}>Sign Up</button>
        </div>
        {tab === 'signin' ? (
          <form className="w-full" onSubmit={handleSignIn}>
            <label className="block mb-1 font-medium">Email Address</label>
            <input className="w-full border rounded px-3 py-2 mb-4" type="text" value={signIn.email} onChange={e => setSignIn(s => ({ ...s, email: e.target.value }))} placeholder="Enter your email address" required />
            <label className="block mb-1 font-medium">Password</label>
            <input className="w-full border rounded px-3 py-2 mb-2" type="password" value={signIn.password} onChange={e => setSignIn(s => ({ ...s, password: e.target.value }))} placeholder="Enter your password" required />
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={signIn.remember} onChange={e => setSignIn(s => ({ ...s, remember: e.target.checked }))} />
                Remember me
              </label>
              <button type="button" className="text-primary text-sm" onClick={() => navigate('/reset-password')}>Forgot password?</button>
            </div>
            {error && <div className="text-error text-sm mb-2">{error}</div>}
            <button className="w-full bg-primary text-white py-2 rounded font-medium mb-4" type="submit">Sign In</button>
            <div className="text-center text-gray-400 mb-4">Or continue with</div>
            <button className="w-full flex items-center justify-center gap-2 border rounded py-2 mb-2" type="button">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 border rounded py-2" type="button">
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5" /> Continue with GitHub
            </button>
            <div className="text-xs text-gray-400 mt-4 text-center">By signing in, you agree to our <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a></div>
          </form>
        ) : (
          <form className="w-full" onSubmit={handleSignUp}>
            <label className="block mb-1 font-medium">Username</label>
            <input className="w-full border rounded px-3 py-2 mb-4" type="text" value={signUp.username} onChange={e => setSignUp(s => ({ ...s, username: e.target.value }))} placeholder="Enter your username" required />
            <label className="block mb-1 font-medium">Email Address</label>
            <input className="w-full border rounded px-3 py-2 mb-4" type="text" value={signUp.email} onChange={e => setSignUp(s => ({ ...s, email: e.target.value }))} placeholder="Enter your email address" required />
            <label className="block mb-1 font-medium">Password</label>
            <input className="w-full border rounded px-3 py-2 mb-4" type="password" value={signUp.password} onChange={e => setSignUp(s => ({ ...s, password: e.target.value }))} placeholder="Enter your password" required />
            <button className="w-full bg-primary text-white py-2 rounded font-medium mb-4" type="submit">Sign Up</button>
            <div className="text-center text-gray-400 mb-4">Or continue with</div>
            <button className="w-full flex items-center justify-center gap-2 border rounded py-2 mb-2" type="button">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 border rounded py-2" type="button">
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5" /> Continue with GitHub
            </button>
            <div className="text-xs text-gray-400 mt-4 text-center">By signing in, you agree to our <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a></div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignInSignUp; 
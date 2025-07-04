import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Briefcase as BriefcaseBusiness, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from "../../firebase";
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, setUserFromOAuth } = useAuth();

  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = (location.state as any)?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please provide both email and password');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);

      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        localStorage.setItem('token', token);
        localStorage.setItem('userId', currentUser.uid);
      }

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (storedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }

      showToast('Successfully logged in!', 'success');
    } catch (error) {
      setFormError('Invalid email or password. Please try again.');
      showToast('Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // Assuming you have a backend endpoint to handle Google sign-in
      const response = await axios.post('/api/auth/google', { token });

      if (response.data) {
        const customUser = {
          id: response.data.id,
          name: user.displayName || '',
          email: user.email || '',
          role: response.data.role, // hoặc mặc định 'user'
        };

        setUserFromOAuth(customUser, token); // kiểu custom hợp lệ
        localStorage.setItem('token', token); // lưu token
        localStorage.setItem('userId', response.data.id);
        console.log('User ID:', response.data.id);

        showToast('Successfully logged in with Google!', 'success');
        navigate(from);
      }

    } catch (error) {
      console.error('Google sign-in error:', error);
      showToast('Google sign-in failed', 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BriefcaseBusiness className="h-12 w-12 text-primary-500 dark:text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-gray-600 hover:text-gray-300">
              create a new account
            </Link>
          </p>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {formError}
          </div>
        )}

        <form className="mt-8 space-y-6 " onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-50">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm ">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-50">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900 dark:text-gray-50">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-gray-600 hover:text-gray-300">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 flex justify-center relative text-black border-t border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-50">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-800 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
              Google
            </button>

            <button
              type="button"
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-800 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
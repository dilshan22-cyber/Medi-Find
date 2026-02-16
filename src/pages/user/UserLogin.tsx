import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export function UserLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate login or actual login
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // AuthContext will update state automatically
      // We can also check role here if we want specific redirects, 
      // but for now redirect to user profile. 
      // Ideally check user role from DB if needed, but for Login just redirect.
      navigate('/user/profile');
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
        <p className="mt-2 text-xl text-gray-600">
          Sign in to your MediFind account
        </p>
      </div>

      <Card className="p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <Alert variant="error" title="Login Failed">
            {error}
          </Alert>}

          <Input label="Email Address" name="email" type="email" placeholder="you@example.com" required autoComplete="email" value={formData.email} onChange={handleChange} />

          <Input label="Password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" value={formData.password} onChange={handleChange} />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="remember-me" className="ml-3 block text-lg text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-lg">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Sign In
          </Button>

          <div className="text-center mt-6">
            <p className="text-lg text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
              </Link>
            </p>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-sm text-gray-500">
                Are you a pharmacy?{' '}
                <Link to="/pharmacy/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </Card>
    </div>
  </div>;
}
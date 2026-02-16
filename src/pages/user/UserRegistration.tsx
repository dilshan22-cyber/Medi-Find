import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { registerPersonalUser } from '../../services/api';
import { Alert } from '../../components/ui/Alert';

export function UserRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    district: '',
    city: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await registerPersonalUser(formData.email, formData.password, {
        fullName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        district: formData.district,
        city: formData.city
      });
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-xl text-gray-600">
            Join MediFind to save medicines and track prices
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <Alert variant="error" title="Registration Failed">{error}</Alert>}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input label="First Name" name="firstName" type="text" placeholder="John" required value={formData.firstName} onChange={handleChange} />
              <Input label="Last Name" name="lastName" type="text" placeholder="Doe" required value={formData.lastName} onChange={handleChange} />
            </div>

            <Input label="Email Address" name="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} />

            <Input label="Phone Number" name="phone" type="tel" placeholder="0912 345 6789" required value={formData.phone} onChange={handleChange} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input label="District" name="district" type="text" placeholder="District" required value={formData.district} onChange={handleChange} />
              <Input label="City" name="city" type="text" placeholder="City" required value={formData.city} onChange={handleChange} />
            </div>

            <Input label="Password" name="password" type="password" placeholder="Create a strong password" helperText="Must be at least 8 characters long" required value={formData.password} onChange={handleChange} />

            <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat your password" required value={formData.confirmPassword} onChange={handleChange} />

            <div className="flex items-start mt-4">
              <div className="flex h-6 items-center">
                <input id="terms" name="terms" type="checkbox" required className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </div>
              <div className="ml-3 text-lg">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" size="lg" isLoading={isLoading}>
              Create Account
            </Button>

            <div className="text-center mt-6">
              <p className="text-lg text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-500">
                  Want to sell medicines?{' '}
                  <Link to="/pharmacy/register" className="font-medium text-blue-600 hover:text-blue-500">
                    Register as a Pharmacy
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
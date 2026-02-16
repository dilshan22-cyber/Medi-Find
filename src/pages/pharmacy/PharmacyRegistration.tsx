import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { registerPharmacy } from '../../services/api';
import { Alert } from '../../components/ui/Alert';

export function PharmacyRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    pharmacyName: '',
    licenseNumber: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    latitude: '',
    longitude: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await registerPharmacy(formData.email, formData.password, {
        pharmacyName: formData.pharmacyName,
        licenseId: formData.licenseNumber,
        ownerName: formData.contactPerson,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        location: {
          lat: parseFloat(formData.latitude) || 0,
          lng: parseFloat(formData.longitude) || 0
        }
      });
      navigate('/pharmacy/login');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
      }, (error) => {
        console.error("Error getting location:", error);
        alert("Could not get location. Please enter manually.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Partner with MediFind</h1>
          <p className="mt-2 text-xl text-gray-600">
            Register your pharmacy to reach more customers
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <Alert variant="error" title="Registration Failed">{error}</Alert>}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input label="Pharmacy Name" name="pharmacyName" type="text" placeholder="HealthPlus Pharmacy" required value={formData.pharmacyName} onChange={handleChange} />
              <Input label="License Number" name="licenseNumber" type="text" placeholder="PH-123456" required value={formData.licenseNumber} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input label="Contact Person" name="contactPerson" type="text" placeholder="Jane Doe" required value={formData.contactPerson} onChange={handleChange} />
              <Input label="Phone Number" name="phone" type="tel" placeholder="011 234 5678" required value={formData.phone} onChange={handleChange} />
            </div>

            <Input label="Email Address" name="email" type="email" placeholder="pharmacy@example.com" required value={formData.email} onChange={handleChange} />

            <Input label="Address" name="address" type="text" placeholder="123 Main Street, Colombo 03" required value={formData.address} onChange={handleChange} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input label="District" name="district" type="text" placeholder="District" required value={formData.district} onChange={handleChange} />
              <Input label="City" name="city" type="text" placeholder="City" required value={formData.city} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-end">
              <Input label="Latitude" name="latitude" type="text" placeholder="6.9271" required value={formData.latitude} onChange={handleChange} />
              <Input label="Longitude" name="longitude" type="text" placeholder="79.8612" required value={formData.longitude} onChange={handleChange} />
              <Button type="button" variant="outline" onClick={getLocation} className="mb-[2px]">Get Location</Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                helperText="Must be at least 8 characters long"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-start mt-4">
              <div className="flex h-6 items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
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
              Register Pharmacy
            </Button>

            <div className="text-center mt-6">
              <p className="text-lg text-gray-600">
                Already have a partner account?{' '}
                <Link to="/pharmacy/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-500">
                  Looking for medicine?{' '}
                  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                    Register as a User
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

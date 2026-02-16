import React, { useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PharmacyUser } from '../../types/auth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, MapPin, Phone, Mail, Clock, Save } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';

export function PharmacyProfile() {
    const { user, userData, refreshUserData } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [profile, setProfile] = useState({
        name: '',
        licenseNumber: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ownerName: '',
        operatingHours: '',
        description: ''
    });

    // Load data from context
    React.useEffect(() => {
        // Fallback to Auth Profile name if Firestore data missing/loading
        const defaultName = user?.displayName || 'New Pharmacy';
        const defaultEmail = user?.email || '';

        if (userData && userData.role === 'pharmacy') {
            setProfile({
                name: userData.pharmacyName || defaultName,
                licenseNumber: userData.licenseId || '',
                email: userData.email || defaultEmail,
                phone: userData.phone || '',
                address: userData.address || '',
                city: userData.city || '',
                district: userData.district || '',
                ownerName: userData.ownerName || '',
                operatingHours: userData.openingHours || '', // Assuming openingHours in schema
                description: userData.description || '' // Assuming description in schema
            });
        } else if (user) {
            // Logged in but no Firestore data yet
            setProfile(prev => ({
                ...prev,
                name: defaultName,
                email: defaultEmail
            }));
        }
    }, [userData, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        try {
            await updateDoc(doc(db, "pharmacies", user.uid), {
                pharmacyName: profile.name,
                phone: profile.phone,
                address: profile.address,
                city: profile.city,
                district: profile.district,
                ownerName: profile.ownerName,
                openingHours: profile.operatingHours, // Map back to schema
                description: profile.description,
                updatedAt: Date.now()
            });

            await refreshUserData();
            setShowSuccess(true);
            setIsEditing(false);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Error updating pharmacy profile:", error);
            alert("Failed to update profile.");
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pharmacy Profile</h1>
                    <p className="text-lg text-gray-600 mt-1">Manage your pharmacy details and settings</p>
                </div>
                <Button
                    variant={isEditing ? 'outline' : 'primary'}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </Button>
            </div>

            {showSuccess && (
                <Alert variant="success" title="Profile Updated">
                    Your pharmacy profile has been successfully updated.
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <Card className="p-6 text-center h-full">
                        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="h-16 w-16 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">License: {profile.licenseNumber}</p>
                        <div className="mt-6 flex justify-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${(userData as PharmacyUser)?.status === 'verified' ? 'bg-green-100 text-green-800' :
                                (userData as PharmacyUser)?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {(userData as PharmacyUser)?.status ? (userData as PharmacyUser).status.charAt(0).toUpperCase() + (userData as PharmacyUser).status.slice(1) : 'Pending'}
                            </span>
                        </div>
                    </Card>
                </div>

                {/* Details Form */}
                <div className="md:col-span-2">
                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <Input
                                    label="Pharmacy Name"
                                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    disabled={!isEditing}
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Phone Number"
                                        leftIcon={<Phone className="h-5 w-5 text-gray-400" />}
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        disabled={!isEditing}
                                        required
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>

                                <Input
                                    label="Contact Person"
                                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                                    value={profile.ownerName}
                                    onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                                    disabled={!isEditing}
                                    required
                                />

                                <Input
                                    label="Street Address"
                                    leftIcon={<MapPin className="h-5 w-5 text-gray-400" />}
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    disabled={!isEditing}
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="City"
                                        value={profile.city}
                                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                        disabled={!isEditing}
                                        required
                                    />
                                    <Input
                                        label="District"
                                        value={profile.district}
                                        onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>

                            </div>

                            <Input
                                label="Operating Hours"
                                leftIcon={<Clock className="h-5 w-5 text-gray-400" />}
                                value={profile.operatingHours}
                                onChange={(e) => setProfile({ ...profile, operatingHours: e.target.value })}
                                disabled={!isEditing}
                                placeholder="e.g., Mon-Sun: 8:00 AM - 9:00 PM"
                                required
                            />

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    value={profile.description}
                                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>

                            {isEditing && (
                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                    <Button type="submit" leftIcon={<Save className="h-4 w-4" />}>
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Card>
                </div>
            </div>
        </div >
    );
}

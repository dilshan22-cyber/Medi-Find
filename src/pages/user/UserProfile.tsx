import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Phone, MapPin, Mail, Clock, Heart } from 'lucide-react';
import { SAVED_MEDICINES } from '../../utils/mockData';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../services/api';

export function UserProfile() {
    const navigate = useNavigate();
    const { user, userData, loading, refreshUserData } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        city: '',
        district: ''
    });

    useEffect(() => {
        if (userData && userData.role === 'personal') {
            const names = userData.fullName ? userData.fullName.split(' ') : ['', ''];
            setFormData({
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                phone: userData.phone || '',
                city: userData.city || '',
                district: userData.district || ''
            });
        }
    }, [userData]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const targetUid = user?.uid || userData?.uid;
            if (targetUid) {
                // Combine names
                const fullName = `${formData.firstName} ${formData.lastName}`.trim();

                await updateUserProfile(targetUid, {
                    fullName,
                    phone: formData.phone,
                    city: formData.city,
                    district: formData.district
                });

                // Refresh local context
                await refreshUserData();
                setIsEditing(false);
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    if (loading) return <div>Loading...</div>;

    // If logged in but no data, default to specific empty state
    const displayData = userData || {
        role: 'personal',
        fullName: user?.displayName || 'New User',
        email: user?.email || '',
        phone: '',
        city: '',
        district: ''
    };
    const isNewUser = !userData;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Personal Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <User className="h-5 w-5 mr-2 text-blue-600" />
                                Personal Details
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </Button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Full Name</label>
                                {isEditing || isNewUser ? (
                                    <div className="flex gap-2">
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            placeholder="First Name"
                                        />
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            placeholder="Last Name"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-lg text-gray-900">{displayData.role === 'personal' ? displayData.fullName : 'N/A'}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500 flex items-center">
                                    <Mail className="h-4 w-4 mr-1" /> Email
                                </label>
                                <p className="text-lg text-gray-900">{displayData.email}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500 flex items-center">
                                    <Phone className="h-4 w-4 mr-1" /> Phone
                                </label>
                                {isEditing || isNewUser ? (
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Phone Number"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900">{displayData.role === 'personal' ? displayData.phone : 'N/A'}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500 flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" /> Location
                                </label>
                                {isEditing || isNewUser ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="City"
                                        />
                                        <Input
                                            value={formData.district}
                                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                            placeholder="District"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-lg text-gray-900">{displayData.role === 'personal' ? `${displayData.city || ''}, ${displayData.district || ''}` : 'N/A'}</p>
                                )}
                            </div>

                            {(isEditing || isNewUser) && (
                                <Button type="submit" className="w-full mt-4">Save Changes</Button>
                            )}
                        </form>
                    </Card>
                </div>

                {/* Right Column: Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Saved Medicines */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <Heart className="h-5 w-5 mr-2 text-red-500" />
                                Saved Medicines
                            </h2>
                            <Button variant="link" size="sm" onClick={() => navigate('/user/saved')}>
                                View All
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {SAVED_MEDICINES.slice(0, 2).map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Best price at {item.store}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-blue-600">{item.price}</span>
                                        <Button variant="outline" size="sm" className="mt-1">View</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Search History */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-gray-500" />
                            Recent Searches
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {['Paracetamol', 'Ibuprofen', 'Diabetes Test Strips', 'Face Masks'].map((term, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 cursor-pointer"
                                >
                                    {term}
                                </span>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

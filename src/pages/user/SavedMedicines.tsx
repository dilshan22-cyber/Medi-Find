import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { getSavedMedicines, removeSavedMedicine } from '../../services/api';

export function SavedMedicines() {
    const { user } = useAuth();
    const [savedItems, setSavedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadSaved();
        }
    }, [user]);

    const loadSaved = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const items = await getSavedMedicines(user.uid);
            setSavedItems(items);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id: string) => {
        if (!user) return;
        try {
            await removeSavedMedicine(user.uid, id);
            setSavedItems(prev => prev.filter(item => item.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Medicines</h1>

            {loading ? <p>Loading...</p> : savedItems.length === 0 ? (
                <Alert variant="info" title="No saved medicines">
                    You haven't saved any medicines yet. Search for medicines to add them to your list.
                </Alert>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedItems.map((item) => (
                        <Card key={item.id} className="p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{item.medicineName || item.name}</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {item.available ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">Saved from: {item.pharmacyName || item.store}</p>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-2xl font-bold text-blue-600">{item.price ? `LKR ${item.price}` : 'Price N/A'}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button variant="primary" className="flex-1" leftIcon={<ShoppingBag className="h-4 w-4" />}>
                                    Order Now
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleRemove(item.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

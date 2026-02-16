import React, { useEffect, useState } from 'react';
import { getPendingPharmacies, verifyPharmacy } from '../../services/api';
import { PharmacyUser } from '../../types/auth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export function AdminDashboard() {
    const [pendingPharmacies, setPendingPharmacies] = useState<PharmacyUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        setLoading(true);
        try {
            const list = await getPendingPharmacies();
            setPendingPharmacies(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (uid: string, status: 'verified' | 'rejected') => {
        try {
            await verifyPharmacy(uid, status);
            loadPending(); // Refresh list
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <h2 className="text-xl mb-4">Pending Pharmacy Verifications</h2>
            {loading ? <p>Loading...</p> : (
                <div className="grid gap-4">
                    {pendingPharmacies.map(p => (
                        <Card key={p.uid} className="p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{p.pharmacyName}</h3>
                                <p>License: {p.licenseId}</p>
                                <p>Owner: {p.ownerName}</p>
                                <p>Phone: {p.phone}</p>
                                <p>Location: {p.city}, {p.district}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => handleVerify(p.uid, 'verified')} className="bg-green-600 hover:bg-green-700">Approve</Button>
                                <Button onClick={() => handleVerify(p.uid, 'rejected')} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Reject</Button>
                            </div>
                        </Card>
                    ))}
                    {pendingPharmacies.length === 0 && <p>No pending verifications.</p>}
                </div>
            )}
        </div>
    );
}

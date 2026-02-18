import React, { useEffect, useState } from 'react';
import { getPendingPharmacies, verifyPharmacy } from '../../services/api';
import { PharmacyUser } from '../../types/auth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Eye, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [pendingPharmacies, setPendingPharmacies] = useState<PharmacyUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            loadPending();
        }
    }, [isAuthenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password === "CCS2311MediFind") {
            setIsLoggingIn(true);
            const adminEmail = "admin@medifind.com";
            try {
                // Try to sign in as admin
                await signInWithEmailAndPassword(auth, adminEmail, password);
                setIsAuthenticated(true);
            } catch (err: any) {
                // If user not found, create the admin user
                if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                    try {
                        await createUserWithEmailAndPassword(auth, adminEmail, password);
                        setIsAuthenticated(true);
                    } catch (createErr: any) {
                        console.error("Create admin error:", createErr);
                        setError("Failed to create admin user: " + createErr.message);
                    }
                } else {
                    console.error("Auth error:", err);
                    setError("Login failed: " + err.message);
                }
            } finally {
                setIsLoggingIn(false);
            }
        } else {
            alert("Incorrect Authorization Code");
        }
    };

    const loadPending = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching pending pharmacies...");
            const list = await getPendingPharmacies();
            console.log("Fetched list:", list);
            setPendingPharmacies(list);
        } catch (e: any) {
            console.error("Fetch error:", e);
            setError(e.message || "Failed to fetch pending verifications.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (uid: string, status: 'verified' | 'rejected') => {
        try {
            await verifyPharmacy(uid, status);
            loadPending(); // Refresh list
        } catch (e: any) {
            console.error(e);
            alert("Action failed: " + e.message);
        }
    };

    const handleViewLicense = (url?: string) => {
        if (!url) {
            alert("No license document uploaded.");
            return;
        }
        const win = window.open();
        if (win) {
            win.document.write(`<iframe src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Card className="w-full max-w-md p-8">
                    <div className="text-center mb-6">
                        <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-6 w-6 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
                        <p className="text-gray-500 mt-2">Enter authorization code to continue</p>
                    </div>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="password"
                            label="Authorization Code"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter code"
                            required
                        />
                        <Button type="submit" className="w-full" isLoading={isLoggingIn}>
                            Access Dashboard
                        </Button>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <h2 className="text-xl mb-4">Pending Pharmacy Verifications</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    Error: {error}
                </div>
            )}

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
                                <Button onClick={() => handleViewLicense(p.licenseDocumentUrl)} variant="outline" leftIcon={<Eye className="h-4 w-4" />}>
                                    View License
                                </Button>
                                <Button onClick={() => handleVerify(p.uid, 'verified')} className="bg-green-600 hover:bg-green-700">Approve</Button>
                                <Button onClick={() => handleVerify(p.uid, 'rejected')} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Reject</Button>
                            </div>
                        </Card>
                    ))}
                    {pendingPharmacies.length === 0 && !error && <p>No pending verifications.</p>}
                </div>
            )}
        </div>
    );
}

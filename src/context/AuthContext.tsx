import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AppUser } from '../types/auth';

interface AuthContextType {
    user: User | null;
    userData: AppUser | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
    logout: async () => { },
    refreshUserData: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async (uid: string) => {
        try {
            // Try patients collection first
            let docSnap = await getDoc(doc(db, 'patients', uid));
            if (docSnap.exists()) {
                setUserData(docSnap.data() as AppUser);
                return;
            }

            // Try pharmacies collection
            docSnap = await getDoc(doc(db, 'pharmacies', uid));
            if (docSnap.exists()) {
                setUserData(docSnap.data() as AppUser);
                return;
            }

            // If neither, set null (new user or data not created yet)
            setUserData(null);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setUserData(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await fetchUserData(firebaseUser.uid);
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setUserData(null);
    };

    const refreshUserData = async () => {
        if (user) {
            await fetchUserData(user.uid);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, logout, refreshUserData }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

import {
    createUserWithEmailAndPassword,
    updateProfile // auth profile
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    deleteDoc
} from "firebase/firestore";
import { ref, set, update } from "firebase/database";
import { auth, db, rtdb } from "../lib/firebase";
import { PersonalUser, PharmacyUser } from "../types/auth";

// --- Authentication & Registration ---

export const registerPersonalUser = async (email: string, password: string, data: Omit<PersonalUser, 'uid' | 'email' | 'role' | 'createdAt'>) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (data.fullName) {
        await updateProfile(user, {
            displayName: data.fullName
        });
    }

    const userData: PersonalUser = {
        uid: user.uid,
        email: user.email,
        role: 'personal',
        createdAt: Date.now(),
        ...data
    };

    try {
        await setDoc(doc(db, "patients", user.uid), userData);

        // Save to Realtime Database
        await set(ref(rtdb, 'users/' + user.uid), userData);

    } catch (e: any) {
        console.error("Firestore/RTDB write failed (non-fatal):", e);
        // We do NOT throw here. We allow the user to be created in Auth.
        // They can update their profile later in the UserProfile page.
    }
    return userData;
};

export const registerPharmacy = async (email: string, password: string, data: Omit<PharmacyUser, 'uid' | 'email' | 'role' | 'status' | 'createdAt'>) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (data.pharmacyName) {
        await updateProfile(user, {
            displayName: data.pharmacyName
        });
    }

    const pharmacyData: PharmacyUser = {
        uid: user.uid,
        email: user.email,
        role: 'pharmacy',
        status: 'pending', // Default status
        createdAt: Date.now(),
        ...data
    };

    try {
        await setDoc(doc(db, "pharmacies", user.uid), pharmacyData);

        // Save to Realtime Database
        await set(ref(rtdb, 'pharmacies/' + user.uid), pharmacyData);

    } catch (e: any) {
        console.error("Firestore/RTDB write failed (non-fatal):", e);
        // We do NOT throw here. We allow the user to be created in Auth.
        // They can update their profile later in the PharmacyProfile page.
    }
    return pharmacyData;
};

// --- Pharmacy Management (Admin) ---

export const getPendingPharmacies = async () => {
    const q = query(collection(db, "pharmacies"), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as PharmacyUser);
};

export const verifyPharmacy = async (uid: string, status: 'verified' | 'rejected') => {
    await updateDoc(doc(db, "pharmacies", uid), { status });

    // Update in Realtime Database
    await update(ref(rtdb, 'pharmacies/' + uid), { status });
};

// --- Inventory Management ---

export interface Medicine {
    id?: string;
    name: string;
    description: string;
    category: string;
}

export interface InventoryItem {
    id?: string;
    pharmacyId: string;
    medicineId: string; // Refers to a global medicine ID or just a name if unstructured
    medicineName: string; // Store name for easier search if not using relational ID
    price: number;
    stock: number;
    lowStockThreshold: number;
    available: boolean;
    lastUpdated: number;
    description?: string;
    category?: string;
}

export const addMedicineToInventory = async (pharmacyId: string, item: Omit<InventoryItem, 'id' | 'pharmacyId' | 'lastUpdated'>) => {
    const data = {
        ...item,
        pharmacyId,
        lastUpdated: Date.now()
    };
    const docRef = await addDoc(collection(db, "inventory"), data);
    return docRef.id;
};

export const updateInventoryItem = async (itemId: string, updates: Partial<InventoryItem>) => {
    await updateDoc(doc(db, "inventory", itemId), {
        ...updates,
        lastUpdated: Date.now()
    });
};

export const getPharmacyInventory = async (pharmacyId: string) => {
    const q = query(collection(db, "inventory"), where("pharmacyId", "==", pharmacyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem));
};

// --- Search ---

export const searchMedicines = async (searchTerm: string, userLocation?: { lat: number, lng: number }) => {
    // Basic implementation: fetch all (or filtered) and filter in memory since Firestore full-text search is limited
    // In production, use Algolia/Typesense.
    // Here we'll just query by name equality or startsWith if possible, but Firestore startsWith is case-sensitive.
    // For now, let's assume we pull a reasonable subset or rely on client filtering for prototype.

    // Better approach for prototype: Query 'inventory' collection.
    // Note: This is read-heavy.
    const q = query(collection(db, "inventory"),
        where("available", "==", true),
        where("medicineName", ">=", searchTerm),
        where("medicineName", "<=", searchTerm + '\uf8ff')
    );

    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem));

    // Enrich with pharmacy details (price, distance)
    // This requires fetching pharmacy details for each item.
    // To optimize, we might store partial pharmacy details in inventory or fetch unique pharmacy IDs.

    const pharmacyIds = [...new Set(items.map(i => i.pharmacyId))];
    const pharmacyPromises = pharmacyIds.map(id => getDoc(doc(db, "pharmacies", id)));
    const pharmacySnapshots = await Promise.all(pharmacyPromises);
    const pharmacies = new Map(pharmacySnapshots.filter(s => s.exists()).map(s => [s.id, s.data() as PharmacyUser]));

    return items.map(item => {
        const ph = pharmacies.get(item.pharmacyId);
        if (!ph) return null;

        // Calculate distance if userLocation provided
        let distance = null;
        if (userLocation && ph.location) {
            distance = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, ph.location.lat, ph.location.lng);
        }

        return {
            ...item,
            pharmacyName: ph.pharmacyName,
            location: ph.location,
            distance,
            pharmacyStatus: ph.status,
            // Enriched fields
            address: ph.address,
            phone: ph.phone,
            openingHours: ph.openingHours
        };
    }).filter(i => i && i.pharmacyStatus === 'verified');
};

// --- User Profile Management ---

export const updateUserProfile = async (uid: string, data: Partial<PersonalUser>) => {
    // Update Firestore
    await updateDoc(doc(db, "patients", uid), {
        ...data,
        updatedAt: Date.now()
    });

    // Update Realtime Database
    await update(ref(rtdb, 'users/' + uid), {
        ...data,
        updatedAt: Date.now()
    });

    // Optional: Update Auth Profile (DisplayName) validation
    if (data.fullName && auth.currentUser) {
        await updateProfile(auth.currentUser, {
            displayName: data.fullName
        });
    }
};

// --- Saved Medicines ---

export const getSavedMedicines = async (userId: string) => {
    const q = collection(db, "patients", userId, "saved");
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const saveMedicine = async (userId: string, item: any) => {
    await addDoc(collection(db, "patients", userId, "saved"), {
        ...item,
        savedAt: Date.now()
    });
};

export const removeSavedMedicine = async (userId: string, itemId: string) => {
    await deleteDoc(doc(db, "patients", userId, "saved", itemId));
};

// Helper for distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}

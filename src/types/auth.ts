export type UserRole = 'personal' | 'pharmacy' | 'admin';

export interface BaseUser {
    uid: string;
    email: string | null;
    role: UserRole;
    createdAt: number;
}

export interface PersonalUser extends BaseUser {
    role: 'personal';
    fullName: string;
    phone: string;
    district: string;
    city: string;
}

export interface PharmacyUser extends BaseUser {
    role: 'pharmacy';
    pharmacyName: string;
    licenseId: string;
    licenseDocumentUrl?: string;
    ownerName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    location?: {
        lat: number;
        lng: number;
    };
    openingHours?: string;
    description?: string;
    status: 'pending' | 'verified' | 'rejected';
}

export type AppUser = PersonalUser | PharmacyUser | (BaseUser & { role: 'admin' });

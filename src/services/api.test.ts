import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerPersonalUser, registerPharmacy } from './api';

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(() => Promise.resolve({
        user: {
            uid: 'test-uid',
            email: 'test@example.com'
        }
    })),
    updateProfile: vi.fn(),
}));

const mockSetDoc = vi.fn();
const mockDoc = vi.fn(() => 'mock-firestore-doc');

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    doc: (...args: any[]) => mockDoc(...args),
    setDoc: (...args: any[]) => mockSetDoc(...args),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    deleteDoc: vi.fn(),
    updateDoc: vi.fn(),
    getDoc: vi.fn(),
}));

const mocks = vi.hoisted(() => ({
    ref: vi.fn().mockReturnValue('mock-ref'),
    set: vi.fn(),
    update: vi.fn(),
}));

vi.mock('firebase/database', () => ({
    getDatabase: vi.fn(),
    ref: mocks.ref,
    set: mocks.set,
    update: mocks.update,
}));

// Mock local firebase lib
vi.mock('../lib/firebase', () => ({
    auth: {},
    db: {},
    rtdb: {},
}));

describe('Registration API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('registerPersonalUser should save city and district to Firestore', async () => {
        const inputData = {
            fullName: 'Test User',
            phone: '1234567890',
            district: 'Colombo',
            city: 'Colombo 03',
        };

        await registerPersonalUser('test@example.com', 'password', inputData);

        // Verify setDoc was called with the correct collection and data
        expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'patients', 'test-uid');
        expect(mockSetDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                uid: 'test-uid',
                role: 'personal',
                city: 'Colombo 03',
                district: 'Colombo',
            })
        );

        // Verify Realtime Database write
        expect(mocks.ref).toHaveBeenCalledWith(expect.anything(), 'users/test-uid');
        expect(mocks.set).toHaveBeenCalledWith(
            'mock-ref',
            expect.objectContaining({
                uid: 'test-uid',
                role: 'personal',
                city: 'Colombo 03'
            })
        );
    });

    it('registerPharmacy should save description and location to Firestore', async () => {
        const inputData = {
            pharmacyName: 'Test Pharmacy',
            licenseId: 'PH-123',
            ownerName: 'Test Owner',
            phone: '0987654321',
            address: '123 Main St',
            city: 'Kandy',
            district: 'Kandy',
            description: 'A test pharmacy description',
            location: { lat: 10, lng: 10 },
        };

        await registerPharmacy('pharmacy@example.com', 'password', inputData);

        // Verify setDoc was called with the correct collection and data
        expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'pharmacies', 'test-uid');
        expect(mockSetDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                uid: 'test-uid',
                role: 'pharmacy',
                pharmacyName: 'Test Pharmacy',
                description: 'A test pharmacy description',
                city: 'Kandy',
                district: 'Kandy',
                ownerName: 'Test Owner',
            })
        );

        // Verify Realtime Database write
        expect(mocks.ref).toHaveBeenCalledWith(expect.anything(), 'pharmacies/test-uid');
        expect(mocks.set).toHaveBeenCalledWith(
            'mock-ref',
            expect.objectContaining({
                uid: 'test-uid',
                role: 'pharmacy',
                pharmacyName: 'Test Pharmacy'
            })
        );
    });
});

// Data Service - Handles Unified Data Management
// Seamlessly operates in LIVE FIREBASE mode or LOCAL DEMO PERSISTENT mode (AsyncStorage)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { isFirebaseConfigured, auth, firestore } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  runTransaction
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  INITIAL_PARKING_AREAS,
  INITIAL_SLOTS,
  INITIAL_USERS,
  INITIAL_BOOKINGS,
  generateDefaultSlots
} from '../data/seedData';
import { hashPassword, generateId } from '../utils/crypto';

const STORAGE_KEYS = {
  PARKING_AREAS: '@smartparking_areas_v1',
  SLOTS: '@smartparking_slots_v1',
  USERS: '@smartparking_users_v1',
  BOOKINGS: '@smartparking_bookings_v1',
  ACTIVE_SESSION: '@smartparking_session_v1',
  INITIALIZED: '@smartparking_initialized_v1',
};

// Check if overlapping time slots
export const checkTimeOverlap = (startA, endA, startB, endB) => {
  // Helper to convert "10:00 AM" to minutes from midnight
  const parseTimeToMinutes = (tStr) => {
    if (!tStr) return 0;
    const [timePart, modifier] = tStr.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + (minutes || 0);
  };

  const aStart = parseTimeToMinutes(startA);
  const aEnd = parseTimeToMinutes(endA);
  const bStart = parseTimeToMinutes(startB);
  const bEnd = parseTimeToMinutes(endB);

  // Overlap condition: max(startA, startB) < min(endA, endB)
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
};

export class DataService {
  /**
   * Initializes baseline dataset if not present.
   * Safe to call multiple times; will never duplicate records.
   */
  static async initializeData() {
    try {
      const initialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (!initialized) {
        console.log('[DataService] First boot detected. Seeding demo parking, slots, users...');
        await AsyncStorage.setItem(STORAGE_KEYS.PARKING_AREAS, JSON.stringify(INITIAL_PARKING_AREAS));
        await AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(INITIAL_SLOTS));
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
        await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
        console.log('[DataService] Seed data populated successfully.');
      }
    } catch (err) {
      console.error('[DataService] Initialization error:', err);
    }
  }

  // ==================== AUTHENTICATION ====================

  static async authenticateUser(email, password) {
    await this.initializeData();
    const cleanEmail = email.trim().toLowerCase();
    const hashed = hashPassword(password);

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const uid = userCredential.user.uid;
        // Fetch role from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', uid));
        const userData = userDoc.exists() ? userDoc.data() : { role: 'user', name: userCredential.user.displayName || 'User' };
        
        const session = {
          userId: uid,
          email: cleanEmail,
          name: userData.name || cleanEmail.split('@')[0],
          role: userData.role || 'user',
          phone: userData.phone || '',
          isFirebaseUser: true,
        };
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
        return session;
      } catch (fbErr) {
        throw new Error(fbErr.message || 'Firebase login failed.');
      }
    }

    // Local Demo Mode Authentication
    const usersRaw = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersRaw ? JSON.parse(usersRaw) : INITIAL_USERS;

    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('No account found with this email address.');
    }

    if (user.passwordHash !== hashed) {
      throw new Error('Incorrect password. Please verify your credentials.');
    }

    const session = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone || '',
      isFirebaseUser: false,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    return session;
  }

  static async registerUser(name, email, password, phone = '', role = 'user') {
    await this.initializeData();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const hashed = hashPassword(password);

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const uid = cred.user.uid;
        const profile = {
          userId: uid,
          name: cleanName,
          email: cleanEmail,
          phone,
          role,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(firestore, 'users', uid), profile);
        const session = { ...profile, isFirebaseUser: true };
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
        return session;
      } catch (fbErr) {
        throw new Error(fbErr.message || 'Firebase registration error');
      }
    }

    // Local Demo Mode Registration
    const usersRaw = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersRaw ? JSON.parse(usersRaw) : [...INITIAL_USERS];

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      userId: generateId('usr'),
      name: cleanName,
      email: cleanEmail,
      passwordHash: hashed,
      phone,
      role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const session = {
      userId: newUser.userId,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      isFirebaseUser: false,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    return session;
  }

  static async getCurrentSession() {
    try {
      const sessionRaw = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      return sessionRaw ? JSON.parse(sessionRaw) : null;
    } catch {
      return null;
    }
  }

  static async logout() {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } catch (err) {
      console.warn('Logout error:', err);
    }
  }

  // ==================== PARKING AREAS ====================

  static async getParkingAreas() {
    await this.initializeData();

    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'parkingAreas'));
        const list = [];
        snap.forEach(d => list.push({ ...d.data(), parkingId: d.id }));
        if (list.length > 0) return list;
      } catch (e) {
        console.warn('Firestore fetch failed, using local storage:', e.message);
      }
    }

    const areasRaw = await AsyncStorage.getItem(STORAGE_KEYS.PARKING_AREAS);
    return areasRaw ? JSON.parse(areasRaw) : INITIAL_PARKING_AREAS;
  }

  static async getParkingAreaById(parkingId) {
    const list = await this.getParkingAreas();
    return list.find(p => p.parkingId === parkingId) || null;
  }

  static async addParkingArea(areaData) {
    await this.initializeData();
    const newId = areaData.parkingId || generateId('parking');
    const newArea = {
      ...areaData,
      parkingId: newId,
      status: areaData.status || 'ACTIVE',
      serviceFee: 5,
      rating: 4.5,
    };

    if (isFirebaseConfigured && firestore) {
      await setDoc(doc(firestore, 'parkingAreas', newId), newArea);
    }

    const areasRaw = await AsyncStorage.getItem(STORAGE_KEYS.PARKING_AREAS);
    const areas = areasRaw ? JSON.parse(areasRaw) : [...INITIAL_PARKING_AREAS];
    areas.push(newArea);
    await AsyncStorage.setItem(STORAGE_KEYS.PARKING_AREAS, JSON.stringify(areas));

    // Also generate slots for new parking
    const slotsRaw = await AsyncStorage.getItem(STORAGE_KEYS.SLOTS);
    const slotsMap = slotsRaw ? JSON.parse(slotsRaw) : { ...INITIAL_SLOTS };
    slotsMap[newId] = generateDefaultSlots(newId, newArea.totalSlots || 16);
    await AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slotsMap));

    return newArea;
  }

  static async updateParkingArea(parkingId, updatedFields) {
    if (isFirebaseConfigured && firestore) {
      await updateDoc(doc(firestore, 'parkingAreas', parkingId), updatedFields);
    }

    const areasRaw = await AsyncStorage.getItem(STORAGE_KEYS.PARKING_AREAS);
    let areas = areasRaw ? JSON.parse(areasRaw) : [...INITIAL_PARKING_AREAS];
    areas = areas.map(a => a.parkingId === parkingId ? { ...a, ...updatedFields } : a);
    await AsyncStorage.setItem(STORAGE_KEYS.PARKING_AREAS, JSON.stringify(areas));
    return true;
  }

  static async deleteParkingArea(parkingId) {
    // Check if there are active bookings
    const bookings = await this.getAllBookings();
    const hasActive = bookings.some(b => b.parkingId === parkingId && b.bookingStatus === 'CONFIRMED');
    if (hasActive) {
      throw new Error('Cannot delete this facility because it has active confirmed bookings.');
    }

    if (isFirebaseConfigured && firestore) {
      await deleteDoc(doc(firestore, 'parkingAreas', parkingId));
    }

    const areasRaw = await AsyncStorage.getItem(STORAGE_KEYS.PARKING_AREAS);
    let areas = areasRaw ? JSON.parse(areasRaw) : [...INITIAL_PARKING_AREAS];
    areas = areas.filter(a => a.parkingId !== parkingId);
    await AsyncStorage.setItem(STORAGE_KEYS.PARKING_AREAS, JSON.stringify(areas));
    return true;
  }

  // ==================== SLOTS MANAGEMENT & DYNAMIC AVAILABILITY ====================

  static async getSlots(parkingId, date, startTime, endTime) {
    await this.initializeData();

    // Fetch baseline slots
    const slotsRaw = await AsyncStorage.getItem(STORAGE_KEYS.SLOTS);
    const slotsMap = slotsRaw ? JSON.parse(slotsRaw) : INITIAL_SLOTS;
    let facilitySlots = slotsMap[parkingId] || [];

    if (facilitySlots.length === 0) {
      facilitySlots = generateDefaultSlots(parkingId, 16);
      slotsMap[parkingId] = facilitySlots;
      await AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slotsMap));
    }

    // Fetch all active bookings for this facility
    const allBookings = await this.getAllBookings();
    const activeBookings = allBookings.filter(
      b => b.parkingId === parkingId && b.bookingStatus === 'CONFIRMED'
    );

    // If date and times are specified, check overlap
    const evaluatedSlots = facilitySlots.map(slot => {
      let isOccupied = slot.isUnderMaintenance || false;
      let occupyingBooking = null;

      if (!isOccupied && date && startTime && endTime) {
        const conflict = activeBookings.find(b => {
          if (b.slotId !== slot.slotId) return false;
          if (b.bookingDate !== date) return false;
          return checkTimeOverlap(b.startTime, b.endTime, startTime, endTime);
        });
        if (conflict) {
          isOccupied = true;
          occupyingBooking = conflict.bookingId;
        }
      }

      return {
        ...slot,
        isOccupied,
        occupyingBooking,
      };
    });

    return evaluatedSlots;
  }

  static async toggleSlotMaintenance(parkingId, slotId) {
    const slotsRaw = await AsyncStorage.getItem(STORAGE_KEYS.SLOTS);
    const slotsMap = slotsRaw ? JSON.parse(slotsRaw) : { ...INITIAL_SLOTS };
    if (!slotsMap[parkingId]) return;

    slotsMap[parkingId] = slotsMap[parkingId].map(s => {
      if (s.slotId === slotId) {
        return { ...s, isUnderMaintenance: !s.isUnderMaintenance };
      }
      return s;
    });

    await AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slotsMap));
    return true;
  }

  // ==================== BOOKING SYSTEM & CONCURRENCY PROTECTION ====================

  static async createBooking(payload) {
    await this.initializeData();
    const {
      userId,
      userName,
      userEmail,
      parkingId,
      parkingName,
      slotId,
      bookingDate,
      startTime,
      endTime,
      durationHours,
      pricePerHour,
      parkingFee,
      serviceFee,
      totalAmount,
      paymentMethod = 'Demo Payment (Simulated)',
    } = payload;

    if (!slotId || !bookingDate || !startTime || !endTime) {
      throw new Error('Missing required booking parameters.');
    }

    // Step 1: Concurrency / Double-booking collision check
    const existingBookings = await this.getAllBookings();
    const collision = existingBookings.find(b => {
      return (
        b.parkingId === parkingId &&
        b.slotId === slotId &&
        b.bookingDate === bookingDate &&
        b.bookingStatus === 'CONFIRMED' &&
        checkTimeOverlap(b.startTime, b.endTime, startTime, endTime)
      );
    });

    if (collision) {
      throw new Error(`Slot ${slotId} was just booked by another user for this time window. Please select another slot.`);
    }

    // Step 2: Unique Sequential Booking ID
    const bookingCount = existingBookings.length + 1;
    const padded = String(bookingCount).padStart(4, '0');
    const bookingId = `SP-${new Date().getFullYear()}-${padded}`;
    const verificationCode = `V-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newBooking = {
      bookingId,
      userId,
      userName,
      userEmail,
      parkingId,
      parkingName,
      slotId,
      bookingDate,
      startTime,
      endTime,
      durationHours: Number(durationHours),
      pricePerHour: Number(pricePerHour),
      parkingFee: Number(parkingFee),
      serviceFee: Number(serviceFee),
      totalAmount: Number(totalAmount),
      paymentStatus: 'DEMO_PAID',
      paymentMethod,
      bookingStatus: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      verificationCode,
    };

    // Step 3: Persist to Firestore if configured
    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'bookings', bookingId), newBooking);
      } catch (fbErr) {
        console.warn('Firestore booking persist failed, saving locally:', fbErr.message);
      }
    }

    // Step 4: Persist to Local Storage
    const bookingsRaw = await AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS);
    const bookings = bookingsRaw ? JSON.parse(bookingsRaw) : [...INITIAL_BOOKINGS];
    bookings.unshift(newBooking);
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    return newBooking;
  }

  static async getUserBookings(userId) {
    const all = await this.getAllBookings();
    return all.filter(b => b.userId === userId);
  }

  static async getCurrentBooking(userId) {
    const userBookings = await this.getUserBookings(userId);
    // Find earliest confirmed booking
    return userBookings.find(b => b.bookingStatus === 'CONFIRMED') || null;
  }

  static async getAllBookings() {
    await this.initializeData();

    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'bookings'));
        const list = [];
        snap.forEach(d => list.push(d.data()));
        if (list.length > 0) return list;
      } catch (err) {
        console.warn('Firestore getAllBookings fallback:', err.message);
      }
    }

    const bookingsRaw = await AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return bookingsRaw ? JSON.parse(bookingsRaw) : INITIAL_BOOKINGS;
  }

  static async cancelBooking(bookingId) {
    const bookingsRaw = await AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS);
    let bookings = bookingsRaw ? JSON.parse(bookingsRaw) : [...INITIAL_BOOKINGS];

    let found = false;
    bookings = bookings.map(b => {
      if (b.bookingId === bookingId) {
        found = true;
        return {
          ...b,
          bookingStatus: 'CANCELLED',
          cancelledAt: new Date().toISOString(),
        };
      }
      return b;
    });

    if (!found) {
      throw new Error('Booking not found.');
    }

    if (isFirebaseConfigured && firestore) {
      try {
        await updateDoc(doc(firestore, 'bookings', bookingId), {
          bookingStatus: 'CANCELLED',
          cancelledAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Firestore update failed:', e.message);
      }
    }

    await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return true;
  }

  static async verifyBooking(queryId) {
    if (!queryId) return { valid: false, reason: 'Empty identifier' };
    const clean = queryId.trim();

    // Check if query is JSON string from QR code
    let searchId = clean;
    try {
      if (clean.startsWith('{') && clean.endsWith('}')) {
        const parsed = JSON.parse(clean);
        if (parsed.bookingId) searchId = parsed.bookingId;
      }
    } catch {}

    const all = await this.getAllBookings();
    const booking = all.find(b =>
      b.bookingId.toLowerCase() === searchId.toLowerCase() ||
      (b.verificationCode && b.verificationCode.toLowerCase() === searchId.toLowerCase())
    );

    if (!booking) {
      return {
        valid: false,
        status: 'NOT_FOUND',
        message: 'No booking record found with this ID or QR code.',
      };
    }

    return {
      valid: booking.bookingStatus === 'CONFIRMED',
      status: booking.bookingStatus,
      booking,
      message:
        booking.bookingStatus === 'CONFIRMED'
          ? 'Valid & Confirmed Booking'
          : `Booking is currently ${booking.bookingStatus}`,
    };
  }

  static async markBookingCompleted(bookingId) {
    const bookingsRaw = await AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS);
    let bookings = bookingsRaw ? JSON.parse(bookingsRaw) : [...INITIAL_BOOKINGS];

    bookings = bookings.map(b => {
      if (b.bookingId === bookingId) {
        return { ...b, bookingStatus: 'COMPLETED' };
      }
      return b;
    });

    await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return true;
  }

  // ==================== ADMIN METRICS & USERS ====================

  static async getAdminStats() {
    const areas = await this.getParkingAreas();
    const bookings = await this.getAllBookings();
    const users = await this.getUsers();

    const totalSlots = areas.reduce((sum, a) => sum + (Number(a.totalSlots) || 0), 0);
    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED');
    const cancelledBookings = bookings.filter(b => b.bookingStatus === 'CANCELLED');
    const completedBookings = bookings.filter(b => b.bookingStatus === 'COMPLETED');

    const occupiedSlotsCount = confirmedBookings.length;
    const availableSlots = Math.max(0, totalSlots - occupiedSlotsCount);

    const totalRevenue = confirmedBookings
      .concat(completedBookings)
      .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

    return {
      totalUsers: users.length,
      totalParkingLocations: areas.length,
      totalSlots,
      availableSlots,
      occupiedSlots: occupiedSlotsCount,
      totalBookings: bookings.length,
      confirmedBookings: confirmedBookings.length,
      cancelledBookings: cancelledBookings.length,
      completedBookings: completedBookings.length,
      totalRevenue,
    };
  }

  static async getUsers() {
    await this.initializeData();
    const usersRaw = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersRaw ? JSON.parse(usersRaw) : INITIAL_USERS;
    return users.map(u => ({
      userId: u.userId,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      status: u.status,
      createdAt: u.createdAt,
    }));
  }
}

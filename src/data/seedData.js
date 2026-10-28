export const INITIAL_PARKING_AREAS = [
  {
    parkingId: 'parking-kpriet',
    parkingName: 'KPRIET Campus Parking',
    address: 'SF 262, Arasur, Coimbatore, Tamil Nadu 641407',
    latitude: 11.0805,
    longitude: 77.1396,
    totalSlots: 16,
    pricePerHour: 20,
    serviceFee: 5,
    description: 'Official academic campus parking facility featuring 24/7 guarded security, high-res CCTV surveillance, covered multi-bay sections, and dedicated EV charging docks.',
    status: 'ACTIVE',
    rating: 4.8,
    operatingHours: '6:00 AM - 11:00 PM',
    amenities: ['24/7 Security', 'CCTV', 'Covered Slots', 'EV Fast Charger', 'Accessible Parking'],
  },
  {
    parkingId: 'parking-city-mall',
    parkingName: 'City Mall Parking',
    address: 'Brookefields Mall, Krishnaswamy Road, Coimbatore, Tamil Nadu 641001',
    latitude: 11.0118,
    longitude: 76.9577,
    totalSlots: 24,
    pricePerHour: 40,
    serviceFee: 5,
    description: 'Modern multi-level mall parking structured across basement floors with intelligent ultrasonic bay indicators, elevator accessibility, and valet support.',
    status: 'ACTIVE',
    rating: 4.6,
    operatingHours: '9:00 AM - 11:30 PM',
    amenities: ['Multi-level', 'Elevator Access', 'Disabled Friendly', 'CCTV', 'Valet Service'],
  },
  {
    parkingId: 'parking-central',
    parkingName: 'Central Parking',
    address: 'Town Hall / Railway Station Area, Coimbatore, Tamil Nadu 641001',
    latitude: 10.9989,
    longitude: 76.9634,
    totalSlots: 20,
    pricePerHour: 30,
    serviceFee: 5,
    description: 'Centrally positioned transit parking ideal for commuters near the railway junction and regional bus stands, with secure access control and round-the-clock attendants.',
    status: 'ACTIVE',
    rating: 4.5,
    operatingHours: '24 Hours Open',
    amenities: ['Transit Proximity', '24/7 Security', 'Well Lit', 'Restrooms Nearby'],
  },
];

// Helper to generate realistic slot layout
export const generateDefaultSlots = (parkingId, totalSlots) => {
  const slots = [];
  const rows = ['A', 'B', 'C', 'D'];
  let slotIndex = 0;

  for (let r = 0; r < rows.length; r++) {
    const rowLetter = rows[r];
    for (let c = 1; c <= 8; c++) {
      if (slotIndex >= totalSlots) break;
      const numStr = c < 10 ? `0${c}` : `${c}`;
      const slotId = `${rowLetter}${numStr}`;
      
      let type = 'Standard';
      if (c === 1 || c === 2) type = 'Compact';
      else if (c === 7 || c === 8) type = 'EV Charging';
      else if (c === 5 || c === 6) type = 'SUV';

      slots.push({
        slotId,
        parkingId,
        label: `Bay ${slotId}`,
        type,
        floor: r === 0 ? 'Ground Floor' : `Level ${r}`,
        isUnderMaintenance: false,
      });
      slotIndex++;
    }
    if (slotIndex >= totalSlots) break;
  }
  return slots;
};

export const INITIAL_SLOTS = {
  'parking-kpriet': generateDefaultSlots('parking-kpriet', 16),
  'parking-city-mall': generateDefaultSlots('parking-city-mall', 24),
  'parking-central': generateDefaultSlots('parking-central', 20),
};

// Hashed demo user credentials
// SHA-256 for user123: 0b9c2625dc21ef05f6ad44edd61426364a6039519e44fab9b11e4f48f5b5c74f
// SHA-256 for admin123: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
export const INITIAL_USERS = [
  {
    userId: 'usr-demo-001',
    name: 'College Demo User',
    email: 'user@smartparking.com',
    passwordHash: '0b9c2625dc21ef05f6ad44edd61426364a6039519e44fab9b11e4f48f5b5c74f', // hash of "user123"
    phone: '+91 98765 43210',
    role: 'user',
    status: 'ACTIVE',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    userId: 'adm-demo-001',
    name: 'Campus System Admin',
    email: 'admin@smartparking.com',
    passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // hash of "admin123"
    phone: '+91 98765 00001',
    role: 'admin',
    status: 'ACTIVE',
    createdAt: '2026-01-01T08:00:00Z',
  },
];

export const INITIAL_BOOKINGS = [
  {
    bookingId: 'SP-2026-0001',
    userId: 'usr-demo-001',
    userName: 'College Demo User',
    userEmail: 'user@smartparking.com',
    parkingId: 'parking-kpriet',
    parkingName: 'KPRIET Campus Parking',
    slotId: 'A03',
    bookingDate: '2026-10-12',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    durationHours: 2,
    pricePerHour: 20,
    parkingFee: 40,
    serviceFee: 5,
    totalAmount: 45,
    paymentStatus: 'DEMO_PAID',
    paymentMethod: 'Demo Payment (Simulated)',
    bookingStatus: 'CONFIRMED',
    createdAt: '2026-10-12T08:30:00Z',
    verificationCode: 'SP-KPR-A03-9182',
  },
  {
    bookingId: 'SP-2026-0002',
    userId: 'usr-demo-001',
    userName: 'College Demo User',
    userEmail: 'user@smartparking.com',
    parkingId: 'parking-city-mall',
    parkingName: 'City Mall Parking',
    slotId: 'B01',
    bookingDate: '2026-10-10',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    durationHours: 3,
    pricePerHour: 40,
    parkingFee: 120,
    serviceFee: 5,
    totalAmount: 125,
    paymentStatus: 'DEMO_PAID',
    paymentMethod: 'Demo Payment (Simulated)',
    bookingStatus: 'COMPLETED',
    createdAt: '2026-10-10T12:00:00Z',
    verificationCode: 'SP-CTY-B01-4421',
  },
];

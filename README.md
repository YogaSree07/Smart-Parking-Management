# Smart Parking Management System (Android Mobile Application)

> **Package Name:** `com.smartparking.management`  
> **Target OS:** Android 7.0 to Android 15+ (API Level 24 to 36)  
> **Build Mode:** Standalone Android Release APK (`Smart-Parking-Management.apk`)  
> **Academic & Portfolio Showcase:** Full-stack mobile application featuring IoT parking bay reservation, role-based admin access control, dynamic QR ticket generation, simulated payment checkout, and live GPS map navigation.

---

## 1. Project Overview

**Smart Parking Management** is a production-grade, standalone Android mobile application engineered to solve urban vehicular congestion, parking bay discovery, and reservation conflicts. Designed for academic demonstration, faculty review, and professional software engineering portfolios, the system enforces a strict dual-role architecture (**Customer/User** vs. **Administrator**), dynamic conflict-free slot booking with millisecond race-condition prevention, cryptographic booking pass generation, simulated checkout, and turn-by-turn navigation using Google Maps.

The application is completely self-contained. Once installed via the release APK, it operates **100% standalone on any Android phone** without requiring a laptop, Metro bundler, VS Code, or Expo Go development client.

---

## 2. Key Features

### User (Customer) Features
- **Splash & Intelligent Dispatch:** Auto-detects saved user/admin sessions and routes accordingly.
- **Secure Authentication:** Input validation, email sanitization, and SHA-256 client password hashing.
- **Interactive Home Dashboard:** Displays live reservations, quick actions, and nearby facilities.
- **Facility Discovery:** Search and browse parking facilities (e.g. *KPRIET Campus*, *City Mall*, *Central Parking*) with real GPS coordinates, distance, and hourly tariffs.
- **Live Interactive Map:** Interactive Leaflet/OpenStreetMap engine pinning user GPS location and parking bays with one-touch deep-link launch to **Google Maps Turn-by-Turn Navigation**.
- **Dynamic Slot Grid:** Visual bay layout (`A01`–`A08`, `B01`–`B08`, `EV Charging`, `SUV`, `Compact`) with color-coded states:
  - 🟢 **Green:** Available for the chosen date/time window.
  - 🔴 **Red:** Occupied by an existing active booking or under maintenance.
  - 🔵 **Blue:** Selected by user.
- **Transparent Fee Engine:** Computes fees based on selected duration, rate per hour, and service fee.
- **Simulated Demo Checkout:** Transparent sandbox payment with no real banking or personal UPI exposure.
- **Dynamic Booking QR Ticket:** High-contrast vector QR code generated directly on device, embedding cryptographically verifiable booking metadata.
- **Active Pass Management & Cancellation:** Live countdown, directions button, and real-time cancellation that immediately restores slot availability across the system.
- **Booking History:** Chronological ledger of confirmed, completed, and cancelled passes.

### Admin Features
- **Role-Protected Console:** Enforced at navigation and service layers; users cannot access admin tools by merely toggling buttons.
- **Live Statistics Dashboard:** Computes real metrics directly from database records (Total Facilities, Total Bays, Available Bays, Active Bookings, Registered Customers).
- **Facility Management:** Full CRUD (Add, Edit, Delete with active booking protection).
- **Slot Operations:** Toggle individual bay maintenance or service holds safely without corrupting active reservations.
- **Pass Verification Suite:**
  - 📷 **Device Camera Barcode Scanner:** Live hardware camera scanner using `expo-camera` to scan customer QR passes.
  - ⌨️ **Manual Booking Lookup Fallback:** Case-insensitive search by booking ID (`SP-2026-XXXX`) or verification code.
  - **Check-in Authorization:** One-tap action to mark ticket `COMPLETED` and authorize gate entry.
- **Customer Directory:** View registered user accounts and contact info with zero password exposure.

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native (Expo Bare Workflow SDK 57) |
| **Language** | JavaScript (ES6+ / Modern Modular) |
| **Native Build Tool** | Android Gradle Plugin (AGP), Gradle 9.3.1, Java 17 |
| **Navigation** | React Navigation v7 (Native Stack & Bottom Tabs) |
| **State & Auth** | React Context (`AuthContext`), AsyncStorage |
| **Backend & Cloud** | Google Cloud Firestore & Firebase Auth (Modular SDK v10/v11) |
| **Local Sandbox** | AsyncStorage persistent fallback with seed database |
| **Vector Barcode** | `react-native-qrcode-svg` & `react-native-svg` |
| **Camera Scanning** | `expo-camera` (CameraView barcode scanner) |
| **Location & Maps** | `expo-location`, `react-native-webview`, Google Maps Intents |

---

## 4. Architecture

```
                    ┌─────────────────────────────────┐
                    │       App Entry (App.js)        │
                    │  SafeAreaProvider + AuthContext │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │   RootNavigator Dispatcher      │
                    └──────┬───────────────────┬──────┘
                           │                   │
             ┌─────────────▼─────────┐   ┌─────▼────────────────┐
             │   Customer User Flow  │   │  Admin Console Flow  │
             │  (Bottom Tabs + Stack)│   │ (Role Protected)     │
             └─────────────┬─────────┘   └─────┬────────────────┘
                           │                   │
         ┌─────────────────┴───────────────────┴─────────────────┐
         │              Unified DataService Layer               │
         │  - Concurrency & Collision Check                      │
         │  - Atomic Booking Creation                            │
         │  - Dynamic Slot Availability Calculation              │
         └───────────────┬───────────────────────────┬───────────┘
                         │                           │
          ┌──────────────▼─────────────┐ ┌───────────▼─────────────┐
          │  Cloud Firestore (Live)    │ │ Local Sandbox (Offline) │
          │  - users                   │ │ - AsyncStorage fallback │
          │  - parkingAreas            │ │ - Initial Seed Data     │
          │  - bookings                │ │ - Instant Viva Readiness│
          └────────────────────────────┘ └─────────────────────────┘
```

---

## 5. User Workflow

1. **Launch:** Opens app on phone → Splash screen checks session.
2. **Login/Register:** Sign in with existing credentials or tap **Demo User** quick-fill button.
3. **Browse Facilities:** Select from *KPRIET Campus*, *City Mall*, or *Central Parking*.
4. **Inspect on Map:** View location pins, current GPS coordinates, and preview route.
5. **Slot Selection:** Choose Date (`Today`, `Tomorrow`), Time (`10:00 AM - 12:00 PM`), and tap an available green bay (`Bay A03`).
6. **Review Tariff:** Summary card calculates parking fee (₹40) + service fee (₹5) = ₹45.
7. **Demo Checkout:** Tap "Pay ₹45 — Demo" to simulate settlement.
8. **Digital QR Pass:** System outputs `SP-2026-XXXX` with dynamic QR pass for gate check-in.
9. **Navigation:** Tap "Directions" to open Google Maps turn-by-turn routing to the facility coordinates.

---

## 6. Admin Workflow

1. **Sign In:** Enter admin credentials (`admin@smartparking.com` / `admin123`) or tap **Demo Admin**.
2. **Dashboard Review:** Inspect live operational statistics calculated from database state.
3. **Facility Management:** Add new campus lots, edit rates, or delete facilities.
4. **Bay Maintenance:** Toggle bays under maintenance holds to prevent bookings.
5. **Customer Pass Verification:**
   - Tap "Verify Entry Pass" → Open device camera to scan vehicle QR.
   - Or enter booking ID manually (`SP-2026-0001`).
   - System checks status and provides one-tap "Authorize & Mark Completed".
6. **Audit Bookings & Users:** View all system reservations and registered customer profiles.

---

## 7. Demo Credentials

The application is pre-seeded with two authentic accounts:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Regular User** | `user@smartparking.com` | `user123` | Customer Reservation, Pass QR, Cancellation |
| **System Admin** | `admin@smartparking.com` | `admin123` | Admin Console, Stats, Facility CRUD, Verification |

*Note: You can also tap the convenient "Demo User" and "Demo Admin" quick-fill pills on the Login screen during college presentations.*

---

## 8. Real Maps and Google Navigation

- **Real Coordinates:** All initial locations use verified GPS coordinates:
  - *KPRIET Campus Parking:* `11.0805, 77.1396` (SF 262, Arasur, Coimbatore)
  - *City Mall Parking:* `11.0118, 76.9577` (Brookefields Mall, Coimbatore)
  - *Central Parking:* `10.9989, 76.9634` (Town Hall / Railway Junction Area)
- **Embedded Interactive Map:** Built with Leaflet & OpenStreetMap via WebView to eliminate Google Cloud billing requirements or gray-screen errors on Android.
- **Live Google Maps Turn-by-Turn:** Every facility card, booking pass, and map view includes a working "Navigate" button triggering Android native intent:
  `google.navigation:q=11.0805,77.1396` with automatic fallback to Google Maps web directions.

---

## 9. Firebase Setup & Cloud Configuration

The app uses Firebase Modular SDK v10/v11.

### Step 1: Create Firebase Project
1. Visit [Firebase Console](https://console.firebase.google.com/).
2. Create project: `smart-parking-management`.
3. Enable **Email/Password** under *Authentication > Sign-in method*.
4. Enable **Cloud Firestore** under *Firestore Database*.

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyYourActualApiKey
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=smart-parking-management.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=smart-parking-management
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=smart-parking-management.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:android:abcdef1234567890
```

### Step 3: Deploy Firestore Security Rules
Deploy the rules found in `firestore.rules`:
```bash
firebase deploy --only firestore:rules
```

---

## 10. Demo Mode (Zero-Config Offline Readiness)

If Firebase credentials are not provided or if testing offline during a university lab viva:
- The app automatically detects placeholder configuration and engages **DEMO MODE**.
- Data persists locally on the Android device via `AsyncStorage`.
- Both demo accounts (`user@smartparking.com` and `admin@smartparking.com`) are fully pre-populated.
- Resetting demo data is available under *Profile > Settings > Reset Demo Database*.

---

## 11. APK Build Instructions

To build the standalone release APK locally using Gradle:

```bash
# 1. Ensure ANDROID_HOME and local.properties are set
cd android

# 2. Compile Release APK
.\gradlew.bat assembleRelease

# The resulting APK will be located at:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 12. APK Installation Instructions

1. Transfer `Smart-Parking-Management.apk` to your Android phone (via USB cable, Google Drive, WhatsApp, or Telegram).
2. Tap the `.apk` file in your phone's File Manager.
3. If prompted, enable **"Allow from this source"** in Android Settings.
4. Tap **Install** → Tap **Open**.
5. Log in with `user@smartparking.com` / `user123` or tap the **Demo User** button!

---

## 13. Deliverables

1. **`Smart-Parking-Management.apk`:** Complete standalone release APK installable on Android.
2. **`Smart-Parking-Management.zip`:** Clean project archive containing complete source code and configurations (excluding `node_modules` and build caches).

---

## 14. Academic & Portfolio Summary

- **Architecture:** Decoupled, modular multi-tier architecture with role-based routing.
- **Robustness:** Concurrency collision prevention prevents double-booking of identical slots.
- **Hardware Integration:** Real Android camera barcode scanner and GPS navigation intent handlers.
- **Security:** Zero plain-text storage, SHA-256 client hashing, and strict role guards.

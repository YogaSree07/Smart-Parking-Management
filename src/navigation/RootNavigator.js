import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

// User Screens
import { SplashScreen } from '../screens/user/SplashScreen';
import { LoginScreen } from '../screens/user/LoginScreen';
import { RegisterScreen } from '../screens/user/RegisterScreen';
import { HomeScreen } from '../screens/user/HomeScreen';
import { FindParkingScreen } from '../screens/user/FindParkingScreen';
import { ParkingDetailsScreen } from '../screens/user/ParkingDetailsScreen';
import { MapViewScreen } from '../screens/user/MapViewScreen';
import { SlotSelectionScreen } from '../screens/user/SlotSelectionScreen';
import { BookingDetailsScreen } from '../screens/user/BookingDetailsScreen';
import { DemoPaymentScreen } from '../screens/user/DemoPaymentScreen';
import { PaymentSuccessScreen } from '../screens/user/PaymentSuccessScreen';
import { BookingConfirmationScreen } from '../screens/user/BookingConfirmationScreen';
import { DynamicBookingQRScreen } from '../screens/user/DynamicBookingQRScreen';
import { CurrentBookingScreen } from '../screens/user/CurrentBookingScreen';
import { BookingHistoryScreen } from '../screens/user/BookingHistoryScreen';
import { ProfileScreen } from '../screens/user/ProfileScreen';
import { SettingsScreen } from '../screens/user/SettingsScreen';

// Admin Screens
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminParkingManagementScreen } from '../screens/admin/AdminParkingManagementScreen';
import { AdminAddEditParkingScreen } from '../screens/admin/AdminAddEditParkingScreen';
import { AdminSlotManagementScreen } from '../screens/admin/AdminSlotManagementScreen';
import { AdminBookingVerificationScreen } from '../screens/admin/AdminBookingVerificationScreen';
import { AdminBookingsListScreen } from '../screens/admin/AdminBookingsListScreen';
import { AdminUsersListScreen } from '../screens/admin/AdminUsersListScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AdminNavStack = createNativeStackNavigator();

// User Bottom Tabs
function UserTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'FindParkingTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'MapTab') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'BookingsTab') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="FindParkingTab" component={FindParkingScreen} options={{ tabBarLabel: 'Find' }} />
      <Tab.Screen name="MapTab" component={MapViewScreen} options={{ tabBarLabel: 'Map' }} />
      <Tab.Screen name="BookingsTab" component={CurrentBookingScreen} options={{ tabBarLabel: 'My Pass' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Admin Stack Navigator
function AdminStackNavigator() {
  return (
    <AdminNavStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminNavStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <AdminNavStack.Screen name="AdminParkingManagement" component={AdminParkingManagementScreen} />
      <AdminNavStack.Screen name="AdminAddEditParking" component={AdminAddEditParkingScreen} />
      <AdminNavStack.Screen name="AdminSlotManagement" component={AdminSlotManagementScreen} />
      <AdminNavStack.Screen name="AdminVerify" component={AdminBookingVerificationScreen} />
      <AdminNavStack.Screen name="AdminBookingsList" component={AdminBookingsListScreen} />
      <AdminNavStack.Screen name="AdminUsersList" component={AdminUsersListScreen} />
    </AdminNavStack.Navigator>
  );
}

// Root Application Stack
export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Auth & Splash */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* User Flow */}
      <Stack.Screen name="UserTabs" component={UserTabNavigator} />
      <Stack.Screen name="ParkingDetails" component={ParkingDetailsScreen} />
      <Stack.Screen name="SlotSelection" component={SlotSelectionScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="DemoPayment" component={DemoPaymentScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <Stack.Screen name="DynamicBookingQR" component={DynamicBookingQRScreen} />
      <Stack.Screen name="CurrentBooking" component={CurrentBookingScreen} />
      <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />

      {/* Admin Flow */}
      <Stack.Screen name="AdminStack" component={AdminStackNavigator} />
    </Stack.Navigator>
  );
}

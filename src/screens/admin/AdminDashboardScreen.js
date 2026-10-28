import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, borderRadius, shadows } from '../../utils/theme';
import { DataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const AdminDashboardScreen = ({ navigation }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await DataService.getAdminStats();
      setStats(data);
    } catch (err) {
      console.warn('Admin stats error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const handleSwitchToUser = async () => {
    try {
      await switchDemoRole('user');
      navigation.replace('UserTabs');
    } catch (err) {
      Alert.alert('Role Switch Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.headerTitle}>Admin Console</Text>
          <Text style={styles.headerSubtitle}>System Operator: {user?.name || 'Administrator'}</Text>
        </View>

        <TouchableOpacity
          style={styles.switchRoleBtn}
          onPress={handleSwitchToUser}
          activeOpacity={0.8}
        >
          <Ionicons name="swap-horizontal" size={16} color={colors.primaryLight} />
          <Text style={styles.switchRoleText}>User View</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Verification Fast Action Banner */}
        <TouchableOpacity
          style={styles.verifyBanner}
          onPress={() => navigation.navigate('AdminVerify')}
          activeOpacity={0.85}
        >
          <View style={styles.verifyIcon}>
            <Ionicons name="qr-code-outline" size={28} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.verifyTitle}>Verify Entry Pass</Text>
            <Text style={styles.verifySub}>Scan vehicle QR barcode or enter booking code</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Real Live Metrics Section */}
        <Text style={styles.sectionHeading}>Real Database Metrics</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primaryLight} style={{ marginVertical: 30 }} />
        ) : (
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderLeftColor: colors.primaryLight }]}>
              <Text style={styles.statVal}>{stats?.totalParkingLocations || 0}</Text>
              <Text style={styles.statLbl}>Facilities</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#0EA5E9' }]}>
              <Text style={styles.statVal}>{stats?.totalSlots || 0}</Text>
              <Text style={styles.statLbl}>Total Bays</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: colors.available }]}>
              <Text style={[styles.statVal, { color: colors.available }]}>{stats?.availableSlots || 0}</Text>
              <Text style={styles.statLbl}>Available Now</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: colors.occupied }]}>
              <Text style={[styles.statVal, { color: colors.occupied }]}>{stats?.occupiedSlots || 0}</Text>
              <Text style={styles.statLbl}>Active Booked</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#8B5CF6' }]}>
              <Text style={styles.statVal}>{stats?.totalBookings || 0}</Text>
              <Text style={styles.statLbl}>Total Bookings</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
              <Text style={styles.statVal}>{stats?.totalUsers || 0}</Text>
              <Text style={styles.statLbl}>Registered Users</Text>
            </View>
          </View>
        )}

        {/* Admin Navigation Hub */}
        <Text style={styles.sectionHeading}>Management Controls</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminParkingManagement')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="business" size={20} color={colors.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Parking Facilities</Text>
              <Text style={styles.menuSub}>Add, edit, or remove parking locations</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminBookingsList')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="receipt" size={20} color="#15803D" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>All Bookings</Text>
              <Text style={styles.menuSub}>Inspect, filter, or check in tickets</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminUsersList')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="people" size={20} color="#B45309" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Registered Customers</Text>
              <Text style={styles.menuSub}>View user profiles and accounts</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            await logout();
            navigation.replace('Login');
          }}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutText}>Sign Out of Administrator Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  switchRoleBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  switchRoleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  verifyBanner: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    ...shadows.md,
  },
  verifyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  verifySub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  statLbl: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  menuSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.surfaceLight,
    marginHorizontal: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    gap: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
  },
});

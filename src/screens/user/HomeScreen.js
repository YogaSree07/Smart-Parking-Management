import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, borderRadius, shadows, typography } from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/dataService';
import { ParkingCard } from '../../components/ParkingCard';
import { StatusBadge } from '../../components/StatusBadge';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = ({ navigation }) => {
  const { user, isFirebase } = useAuth();
  const [parkingAreas, setParkingAreas] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const areas = await DataService.getParkingAreas();
      setParkingAreas(areas.slice(0, 3)); // show top 3 on home

      if (user?.userId) {
        const cur = await DataService.getCurrentBooking(user.userId);
        setCurrentBooking(cur);
      }
    } catch (err) {
      console.warn('Dashboard data load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const openNavigation = (latitude, longitude) => {
    const scheme = `google.navigation:q=${latitude},${longitude}`;
    const fallback = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.canOpenURL(scheme)
      .then((supported) => Linking.openURL(supported ? scheme : fallback))
      .catch(() => Linking.openURL(fallback));
  };

  return (
    <View style={styles.container}>
      {/* Top App Header */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'Customer'}</Text>
          <Text style={styles.subGreeting}>Find and reserve your parking spot</Text>
        </View>
        <View style={styles.badgeContainer}>
          <View style={[styles.modePill, isFirebase ? styles.modeFirebase : styles.modeDemo]}>
            <View style={[styles.modeDot, { backgroundColor: isFirebase ? '#10B981' : '#F59E0B' }]} />
            <Text style={styles.modeText}>{isFirebase ? 'Cloud DB' : 'Demo Mode'}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Quick Action Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#EFF6FF' }]}
            onPress={() => navigation.navigate('FindParking')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="search" size={22} color={colors.primaryLight} />
            </View>
            <Text style={styles.actionTitle}>Find Parking</Text>
            <Text style={styles.actionSub}>Browse bays</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#F0FDF4' }]}
            onPress={() => navigation.navigate('MapTab')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="map" size={22} color="#15803D" />
            </View>
            <Text style={styles.actionTitle}>Map View</Text>
            <Text style={styles.actionSub}>Live GPS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FEF3C7' }]}
            onPress={() => navigation.navigate('CurrentBooking')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#FDE68A' }]}>
              <Ionicons name="qr-code" size={22} color="#B45309" />
            </View>
            <Text style={styles.actionTitle}>My Pass QR</Text>
            <Text style={styles.actionSub}>Active ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#F3E8FF' }]}
            onPress={() => navigation.navigate('BookingHistory')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#E9D5FF' }]}>
              <Ionicons name="receipt" size={22} color="#7E22CE" />
            </View>
            <Text style={styles.actionTitle}>History</Text>
            <Text style={styles.actionSub}>Past logs</Text>
          </TouchableOpacity>
        </View>

        {/* Current Active Booking Banner */}
        {currentBooking && (
          <View style={styles.activeSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="radio" size={18} color={colors.available} />
              <Text style={styles.sectionTitle}>Active Reservation</Text>
            </View>

            <View style={styles.activeCard}>
              <View style={styles.activeTop}>
                <View>
                  <Text style={styles.activeParkingName}>{currentBooking.parkingName}</Text>
                  <Text style={styles.activeSlot}>Slot {currentBooking.slotId} • {currentBooking.bookingDate}</Text>
                  <Text style={styles.activeTime}>{currentBooking.startTime} - {currentBooking.endTime}</Text>
                </View>
                <StatusBadge status={currentBooking.bookingStatus} />
              </View>

              <View style={styles.activeDivider} />

              <View style={styles.activeActions}>
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => navigation.navigate('DynamicBookingQR', { booking: currentBooking })}
                >
                  <Ionicons name="qr-code-outline" size={16} color={colors.primaryLight} />
                  <Text style={styles.qrBtnText}>Show QR Pass</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('CurrentBooking')}
                >
                  <Text style={styles.detailsBtnText}>View Details</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Nearby Available Facilities */}
        <View style={styles.facilitiesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Featured Facilities</Text>
            <TouchableOpacity onPress={() => navigation.navigate('FindParking')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color={colors.primaryLight} style={{ marginVertical: 20 }} />
          ) : (
            parkingAreas.map((parking) => (
              <ParkingCard
                key={parking.parkingId}
                parking={parking}
                onPress={() => navigation.navigate('ParkingDetails', { parking })}
                onBookPress={() => navigation.navigate('SlotSelection', { parking })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subGreeting: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  modeFirebase: {
    backgroundColor: '#DCFCE7',
  },
  modeDemo: {
    backgroundColor: '#FEF3C7',
  },
  modeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  modeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    padding: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  actionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activeSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    ...shadows.sm,
  },
  activeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activeParkingName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  activeSlot: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryLight,
    marginTop: 4,
  },
  activeTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activeDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  activeActions: {
    flexDirection: 'row',
    gap: 10,
  },
  qrButton: {
    flex: 1,
    height: 38,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  qrBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  detailsButton: {
    flex: 1,
    height: 38,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  facilitiesSection: {
    marginBottom: 16,
  },
});

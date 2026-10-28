import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, borderRadius, shadows } from '../../utils/theme';
import { QRViewer } from '../../components/QRViewer';
import { CustomButton } from '../../components/CustomButton';
import { StatusBadge } from '../../components/StatusBadge';
import { DataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const CurrentBookingScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchActiveBooking = async () => {
    if (!user?.userId) return;
    try {
      const b = await DataService.getCurrentBooking(user.userId);
      setCurrentBooking(b);
    } catch (err) {
      console.warn('Current booking fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchActiveBooking();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveBooking();
  };

  const handleCancelBooking = () => {
    if (!currentBooking) return;

    Alert.alert(
      'Cancel Reservation',
      `Are you sure you want to cancel booking ${currentBooking.bookingId}? This will release Bay ${currentBooking.slotId} for other users.`,
      [
        { text: 'No, Keep Slot', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await DataService.cancelBooking(currentBooking.bookingId);
              Alert.alert('Booking Cancelled', 'Your reservation was cancelled and the slot has been made available.');
              fetchActiveBooking();
            } catch (err) {
              Alert.alert('Error', err.message || 'Could not cancel booking.');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const openNavigation = () => {
    if (!currentBooking) return;
    const q = encodeURIComponent(currentBooking.parkingName);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primaryLight} />
        <Text style={styles.loadingText}>Fetching active pass...</Text>
      </View>
    );
  }

  if (!currentBooking) {
    return (
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>Active Reservation</Text>
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
          </View>
          <Text style={styles.emptyTitle}>No Active Booking</Text>
          <Text style={styles.emptySubtitle}>
            You do not have any upcoming or confirmed parking reservations right now.
          </Text>
          <CustomButton
            title="Book a Slot Now"
            icon="car-outline"
            onPress={() => navigation.navigate('FindParking')}
            style={{ marginTop: 24, width: 220 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Active Reservation</Text>
        <StatusBadge status={currentBooking.bookingStatus} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Pass Card with QR */}
        <View style={styles.qrCard}>
          <Text style={styles.parkingName}>{currentBooking.parkingName}</Text>
          <Text style={styles.slotBadge}>Bay {currentBooking.slotId}</Text>
          
          <QRViewer booking={currentBooking} size={200} />
        </View>

        {/* Schedule & Financial Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Reservation Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Booking ID</Text>
            <Text style={styles.valHighlight}>{currentBooking.bookingId}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.val}>{currentBooking.bookingDate}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Time Window</Text>
            <Text style={styles.val}>{currentBooking.startTime} - {currentBooking.endTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.val}>{currentBooking.durationHours} Hours</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Payment Status</Text>
            <StatusBadge status={currentBooking.paymentStatus} size="sm" />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Amount Paid</Text>
            <Text style={styles.valPrice}>₹{currentBooking.totalAmount}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <CustomButton
            title="Directions in Google Maps"
            icon="navigate-outline"
            onPress={openNavigation}
          />

          <CustomButton
            title="Cancel Reservation"
            icon="trash-outline"
            variant="danger"
            loading={cancelling}
            onPress={handleCancelBooking}
            style={{ marginTop: 12 }}
          />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    marginBottom: 16,
  },
  parkingName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  slotBadge: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryLight,
    marginTop: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  val: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  valHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  valPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  actionButtons: {
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, borderRadius, typography } from '../../utils/theme';
import { StatusBadge } from '../../components/StatusBadge';
import { DataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const BookingHistoryScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    if (!user?.userId) return;
    try {
      const data = await DataService.getUserBookings(user.userId);
      setBookings(data);
    } catch (err) {
      console.warn('History fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Booking History</Text>
        <Text style={styles.headerCount}>{bookings.length} Total Records</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primaryLight} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.bookingId}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => {
                if (item.bookingStatus === 'CONFIRMED') {
                  navigation.navigate('DynamicBookingQR', { booking: item });
                }
              }}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.bookingId}>{item.bookingId}</Text>
                  <Text style={styles.parkingName}>{item.parkingName}</Text>
                </View>
                <StatusBadge status={item.bookingStatus} />
              </View>

              <View style={styles.divider} />

              <View style={styles.cardBody}>
                <View style={styles.metaRow}>
                  <Ionicons name="car-outline" size={15} color={colors.primaryLight} />
                  <Text style={styles.metaText}>Bay {item.slotId}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Ionicons name="calendar-outline" size={15} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{item.bookingDate}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={15} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{item.startTime} - {item.endTime} ({item.durationHours} hrs)</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.paymentMethod}>{item.paymentMethod || 'Demo Paid'}</Text>
                <Text style={styles.amount}>₹{item.totalAmount}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={colors.border} />
              <Text style={styles.emptyTitle}>No Booking Records</Text>
              <Text style={styles.emptySubtitle}>Completed and cancelled bookings will appear here.</Text>
            </View>
          }
        />
      )}
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
  headerCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingId: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 0.5,
  },
  parkingName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  cardBody: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  dot: {
    color: colors.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
  },
  paymentMethod: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

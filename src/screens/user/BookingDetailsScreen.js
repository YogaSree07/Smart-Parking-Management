import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, borderRadius, typography } from '../../utils/theme';
import { CustomButton } from '../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export const BookingDetailsScreen = ({ route, navigation }) => {
  const { parking, slot, bookingDate, startTime, endTime } = route.params;
  const { user } = useAuth();

  // Calculate duration in hours
  const parseTimeToMinutes = (tStr) => {
    if (!tStr) return 0;
    const [timePart, modifier] = tStr.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + (minutes || 0);
  };

  const startMin = parseTimeToMinutes(startTime);
  const endMin = parseTimeToMinutes(endTime);
  let durationMinutes = endMin - startMin;
  if (durationMinutes <= 0) durationMinutes = 60; // minimum 1 hr

  const durationHours = Math.max(1, Math.round(durationMinutes / 60));
  const pricePerHour = parking.pricePerHour || 20;
  const parkingFee = durationHours * pricePerHour;
  const serviceFee = parking.serviceFee || 5;
  const totalAmount = parkingFee + serviceFee;

  const handleProceedToPayment = () => {
    navigation.navigate('DemoPayment', {
      parking,
      slot,
      bookingDate,
      startTime,
      endTime,
      durationHours,
      pricePerHour,
      parkingFee,
      serviceFee,
      totalAmount,
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Booking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Facility Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Parking Facility</Text>
          <Text style={styles.facilityName}>{parking.parkingName}</Text>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.addressText}>{parking.address}</Text>
          </View>
        </View>

        {/* Selected Bay & Schedule Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Reservation Schedule</Text>
          
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Parking Bay</Text>
              <Text style={styles.valPrimary}>Bay {slot.slotId}</Text>
              <Text style={styles.subVal}>{slot.type} • {slot.floor}</Text>
            </View>
            <View style={styles.colRight}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.val}>{bookingDate}</Text>
              <Text style={styles.subVal}>{durationHours} Hour(s)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Check-in</Text>
              <Text style={styles.val}>{startTime}</Text>
            </View>
            <View style={styles.colRight}>
              <Text style={styles.label}>Check-out</Text>
              <Text style={styles.val}>{endTime}</Text>
            </View>
          </View>
        </View>

        {/* User Details */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Customer Information</Text>
          <View style={styles.userRow}>
            <Ionicons name="person-circle-outline" size={22} color={colors.primaryLight} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.userName}>{user?.name || 'Customer'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@smartparking.com'}</Text>
            </View>
          </View>
        </View>

        {/* Transparent Fee Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Tariff Breakdown</Text>
          
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>
              Parking Fee (₹{pricePerHour} × {durationHours} hr)
            </Text>
            <Text style={styles.feeVal}>₹{parkingFee}</Text>
          </View>

          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Convenience / Service Fee</Text>
            <Text style={styles.feeVal}>₹{serviceFee}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>₹{totalAmount}</Text>
          </View>

          <View style={styles.noticeBox}>
            <Ionicons name="information-circle-outline" size={16} color="#0369A1" />
            <Text style={styles.noticeText}>
              Next step is simulated Demo Payment. No real bank accounts or UPI involved.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomTotalLbl}>Total</Text>
          <Text style={styles.bottomTotalVal}>₹{totalAmount}</Text>
        </View>
        <CustomButton
          title="Proceed to Demo Pay"
          icon="lock-closed-outline"
          onPress={handleProceedToPayment}
          style={{ flex: 1.6 }}
        />
      </View>
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
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 14,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  facilityName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  addressText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
  },
  colRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  val: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  valPrimary: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryLight,
    marginTop: 2,
  },
  subVal: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  feeVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  noticeBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: borderRadius.sm,
    padding: 10,
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bottomInfo: {
    flex: 1,
  },
  bottomTotalLbl: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  bottomTotalVal: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryLight,
  },
});

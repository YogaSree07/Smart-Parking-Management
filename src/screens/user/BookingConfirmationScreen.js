import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { colors, borderRadius, typography } from '../../utils/theme';
import { QRViewer } from '../../components/QRViewer';
import { CustomButton } from '../../components/CustomButton';
import { StatusBadge } from '../../components/StatusBadge';
import { Ionicons } from '@expo/vector-icons';

export const BookingConfirmationScreen = ({ route, navigation }) => {
  const { booking } = route.params;

  const openNavigation = () => {
    // If coordinates are available or search by facility name
    const query = encodeURIComponent(booking.parkingName);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('UserTabs', { screen: 'HomeTab' })}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Confirmation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Dynamic QR Code Badge */}
        <View style={styles.qrCard}>
          <View style={styles.statusRow}>
            <StatusBadge status={booking.bookingStatus} />
            <Text style={styles.receiptDate}>{booking.bookingDate}</Text>
          </View>

          <QRViewer booking={booking} size={210} />
        </View>

        {/* Booking Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Reservation Summary</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Parking Location</Text>
            <Text style={styles.valBold}>{booking.parkingName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Reserved Bay</Text>
            <Text style={styles.valHighlight}>Bay {booking.slotId}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Slot Timing</Text>
            <Text style={styles.val}>{booking.startTime} - {booking.endTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.val}>{booking.durationHours} Hours</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Total Fee (Demo Paid)</Text>
            <Text style={styles.valPrice}>₹{booking.totalAmount}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnStack}>
          <CustomButton
            title="Directions to Location"
            icon="navigate-outline"
            onPress={openNavigation}
          />

          <CustomButton
            title="Go to Active Bookings"
            variant="outline"
            onPress={() => navigation.navigate('CurrentBooking')}
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
    paddingBottom: 40,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
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
    marginVertical: 6,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  val: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  valBold: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  valHighlight: {
    fontSize: 15,
    color: colors.primaryLight,
    fontWeight: '800',
  },
  valPrice: {
    fontSize: 18,
    color: colors.success,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  btnStack: {
    marginTop: 8,
  },
});

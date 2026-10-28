import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, borderRadius, typography } from '../../utils/theme';
import { CustomButton } from '../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

export const PaymentSuccessScreen = ({ route, navigation }) => {
  const { booking } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Circle */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Payment Completed!</Text>
        <Text style={styles.subTitle}>Demo Sandbox Transaction Approved</Text>

        {/* Transaction Summary Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Amount Paid (Simulated)</Text>
            <Text style={styles.valAmount}>₹{booking.totalAmount}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Booking ID</Text>
            <Text style={styles.valHighlight}>{booking.bookingId}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Facility</Text>
            <Text style={styles.val}>{booking.parkingName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Parking Slot</Text>
            <Text style={styles.val}>Bay {booking.slotId}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Schedule</Text>
            <Text style={styles.val}>{booking.startTime} - {booking.endTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.val}>{booking.bookingDate}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Payment Status</Text>
            <Text style={[styles.val, { color: colors.success, fontWeight: '700' }]}>
              {booking.paymentStatus}
            </Text>
          </View>
        </View>

        <View style={styles.btnStack}>
          <CustomButton
            title="View Booking QR Pass"
            icon="qr-code-outline"
            onPress={() => navigation.replace('BookingConfirmation', { booking })}
          />

          <CustomButton
            title="Return to Home"
            variant="outline"
            onPress={() => navigation.navigate('UserTabs', { screen: 'HomeTab' })}
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
  scrollContent: {
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
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
    fontWeight: '600',
    color: colors.text,
  },
  valHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  valAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  btnStack: {
    width: '100%',
  },
});

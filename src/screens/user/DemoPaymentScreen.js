import React, { useState } from 'react';
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
import { DataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

export const DemoPaymentScreen = ({ route, navigation }) => {
  const {
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
  } = route.params;

  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('demo_wallet');

  const handleConfirmDemoPayment = async () => {
    setProcessing(true);
    try {
      // Create confirmed booking using server/atomic logic
      const bookingPayload = {
        userId: user?.userId || 'usr-demo-001',
        userName: user?.name || 'Customer',
        userEmail: user?.email || 'user@smartparking.com',
        parkingId: parking.parkingId,
        parkingName: parking.parkingName,
        slotId: slot.slotId,
        bookingDate,
        startTime,
        endTime,
        durationHours,
        pricePerHour,
        parkingFee,
        serviceFee,
        totalAmount,
        paymentMethod: selectedMethod === 'demo_wallet' ? 'Demo Virtual Wallet' : 'Simulated UPI Gateway',
      };

      const confirmedBooking = await DataService.createBooking(bookingPayload);

      // Navigate to Payment Success screen
      navigation.replace('PaymentSuccess', {
        booking: confirmedBooking,
      });
    } catch (err) {
      Alert.alert(
        'Booking Failed',
        err.message || 'Slot collision occurred. Please pick another slot.',
        [
          {
            text: 'Choose Another Slot',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } finally {
      setProcessing(false);
    }
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
        <Text style={styles.headerTitle}>Simulated Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Prominent Demo Notice Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="shield-checkmark" size={24} color="#047857" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>ACADEMIC DEMO PAYMENT ONLY</Text>
            <Text style={styles.bannerText}>
              This is a safe sandbox environment for college evaluation. NO real currency, credit cards, or UPI IDs are charged.
            </Text>
          </View>
        </View>

        {/* Order Summary Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Facility</Text>
            <Text style={styles.summaryVal}>{parking.parkingName}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Reserved Slot</Text>
            <Text style={styles.summaryValHighlight}>Bay {slot.slotId}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryVal}>{durationHours} hrs ({startTime} - {endTime})</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Parking Fee</Text>
            <Text style={styles.priceVal}>₹{parkingFee}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceVal}>₹{serviceFee}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>₹{totalAmount}</Text>
          </View>
        </View>

        {/* Simulated Payment Modes */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select Demo Payment Channel</Text>

          <TouchableOpacity
            style={[
              styles.methodItem,
              selectedMethod === 'demo_wallet' && styles.methodItemActive,
            ]}
            onPress={() => setSelectedMethod('demo_wallet')}
            activeOpacity={0.8}
          >
            <View style={styles.methodIcon}>
              <Ionicons name="wallet-outline" size={20} color={colors.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitle}>Smart Parking Demo Wallet</Text>
              <Text style={styles.methodSub}>Instant sandbox settlement (Balance: ₹1,000)</Text>
            </View>
            <Ionicons
              name={selectedMethod === 'demo_wallet' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={selectedMethod === 'demo_wallet' ? colors.primaryLight : colors.border}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodItem,
              selectedMethod === 'demo_upi' && styles.methodItemActive,
            ]}
            onPress={() => setSelectedMethod('demo_upi')}
            activeOpacity={0.8}
          >
            <View style={styles.methodIcon}>
              <Ionicons name="qr-code-outline" size={20} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitle}>Simulated Mock UPI</Text>
              <Text style={styles.methodSub}>Auto-approves without banking redirect</Text>
            </View>
            <Ionicons
              name={selectedMethod === 'demo_upi' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={selectedMethod === 'demo_upi' ? colors.primaryLight : colors.border}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Confirmation Button */}
      <View style={styles.bottomBar}>
        <CustomButton
          title={`Pay ₹${totalAmount} — Demo`}
          icon="checkmark-circle-outline"
          loading={processing}
          onPress={handleConfirmDemoPayment}
          variant="success"
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
    paddingBottom: 90,
  },
  banner: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    borderRadius: borderRadius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  bannerIcon: {
    marginTop: 2,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
  },
  bannerText: {
    fontSize: 12,
    color: '#047857',
    marginTop: 4,
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  summaryValHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  priceVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  totalVal: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.success,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
    gap: 12,
  },
  methodItemActive: {
    borderColor: colors.primaryLight,
    backgroundColor: '#EFF6FF',
  },
  methodIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  methodSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
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
  },
});

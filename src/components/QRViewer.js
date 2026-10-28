import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, borderRadius, typography } from '../utils/theme';

export const QRViewer = ({
  booking,
  size = 200,
}) => {
  if (!booking) return null;

  const {
    bookingId,
    parkingName,
    slotId,
    bookingDate,
    startTime,
    endTime,
    bookingStatus,
    verificationCode,
    userEmail,
  } = booking;

  // Structured payload encoded into the dynamic QR code
  const qrPayload = JSON.stringify({
    app: 'SmartParkingManagement',
    bookingId,
    parkingName,
    slotId,
    date: bookingDate,
    startTime,
    endTime,
    status: bookingStatus,
    verifyCode: verificationCode,
  });

  return (
    <View style={styles.container}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={qrPayload}
          size={size}
          color={colors.primaryDark}
          backgroundColor="#FFFFFF"
          quietZone={8}
        />
      </View>
      <View style={styles.detailsBox}>
        <Text style={styles.bookingIdText}>{bookingId}</Text>
        <Text style={styles.helperText}>Scan by Parking Attendant for Entry/Exit</Text>
        {verificationCode && (
          <Text style={styles.codeText}>Passcode: {verificationCode}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBox: {
    marginTop: 12,
    alignItems: 'center',
  },
  bookingIdText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
});

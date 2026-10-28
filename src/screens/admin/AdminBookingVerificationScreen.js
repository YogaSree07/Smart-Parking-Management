import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors, borderRadius, shadows } from '../../utils/theme';
import { CustomButton } from '../../components/CustomButton';
import { StatusBadge } from '../../components/StatusBadge';
import { DataService } from '../../services/dataService';
import { Ionicons } from '@expo/vector-icons';

export const AdminBookingVerificationScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleVerify = async (idToVerify) => {
    const query = idToVerify || searchCode;
    if (!query.trim()) {
      Alert.alert('Input Required', 'Please enter a Booking ID or scan a pass QR.');
      return;
    }

    setLoading(true);
    try {
      const res = await DataService.verifyBooking(query);
      setVerificationResult(res);
      setIsScannerActive(false);
    } catch (err) {
      Alert.alert('Verification Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    handleVerify(data);
    setTimeout(() => setScanned(false), 2000);
  };

  const handleMarkCompleted = async () => {
    if (!verificationResult?.booking?.bookingId) return;
    const bid = verificationResult.booking.bookingId;
    try {
      await DataService.markBookingCompleted(bid);
      Alert.alert('Checked-In', `Pass ${bid} marked as COMPLETED. Vehicle authorized.`);
      handleVerify(bid);
    } catch (e) {
      Alert.alert('Error', e.message);
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
        <Text style={styles.headerTitle}>Pass Verification</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Toggle Scanner Button */}
        <View style={styles.scannerToggleBox}>
          <TouchableOpacity
            style={[styles.scannerBtn, isScannerActive && styles.scannerBtnActive]}
            onPress={async () => {
              if (!permission?.granted) {
                const res = await requestPermission();
                if (!res.granted) {
                  Alert.alert('Camera Permission', 'Camera access is required to scan passes. You can also enter the Booking ID manually below.');
                  return;
                }
              }
              setIsScannerActive(!isScannerActive);
            }}
          >
            <Ionicons
              name={isScannerActive ? 'close-circle-outline' : 'camera-outline'}
              size={22}
              color={isScannerActive ? '#FFFFFF' : colors.primaryLight}
            />
            <Text style={[styles.scannerBtnText, isScannerActive && { color: '#FFFFFF' }]}>
              {isScannerActive ? 'Close Camera Scanner' : 'Open Camera QR Scanner'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Live Camera Viewfinder */}
        {isScannerActive && (
          <View style={styles.cameraBox}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />
            <View style={styles.viewfinderOverlay}>
              <View style={styles.viewfinderBorder} />
              <Text style={styles.viewfinderText}>Align Booking Pass QR within frame</Text>
            </View>
          </View>
        )}

        {/* Manual Lookup Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manual Booking ID Lookup</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="e.g. SP-2026-0001"
              placeholderTextColor={colors.textMuted}
              value={searchCode}
              onChangeText={setSearchCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => handleVerify()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.searchBtnText}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            Case-insensitive search by Booking ID (SP-XXXX) or verification passcode.
          </Text>
        </View>

        {/* Result Card */}
        {verificationResult && (
          <View
            style={[
              styles.resultCard,
              verificationResult.valid
                ? styles.resultCardValid
                : styles.resultCardInvalid,
            ]}
          >
            <View style={styles.resultHeader}>
              <Ionicons
                name={
                  verificationResult.valid
                    ? 'checkmark-circle'
                    : verificationResult.status === 'COMPLETED'
                    ? 'information-circle'
                    : 'alert-circle'
                }
                size={28}
                color={
                  verificationResult.valid
                    ? colors.success
                    : verificationResult.status === 'COMPLETED'
                    ? colors.primaryLight
                    : colors.danger
                }
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.resultTitle}>{verificationResult.message}</Text>
                <StatusBadge status={verificationResult.status} size="sm" />
              </View>
            </View>

            {verificationResult.booking && (
              <View style={styles.bookingData}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Booking ID</Text>
                  <Text style={styles.dataValBold}>{verificationResult.booking.bookingId}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Customer</Text>
                  <Text style={styles.dataVal}>
                    {verificationResult.booking.userName} ({verificationResult.booking.userEmail})
                  </Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Facility</Text>
                  <Text style={styles.dataVal}>{verificationResult.booking.parkingName}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Reserved Bay</Text>
                  <Text style={styles.dataValHighlight}>Bay {verificationResult.booking.slotId}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Schedule</Text>
                  <Text style={styles.dataVal}>
                    {verificationResult.booking.bookingDate} • {verificationResult.booking.startTime} - {verificationResult.booking.endTime}
                  </Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Payment Status</Text>
                  <Text style={[styles.dataVal, { color: colors.success, fontWeight: '700' }]}>
                    {verificationResult.booking.paymentStatus}
                  </Text>
                </View>

                {verificationResult.valid && (
                  <CustomButton
                    title="Authorize & Mark Completed"
                    icon="checkmark-done-outline"
                    variant="success"
                    onPress={handleMarkCompleted}
                    style={{ marginTop: 14 }}
                  />
                )}
              </View>
            )}
          </View>
        )}
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
  scannerToggleBox: {
    marginBottom: 16,
  },
  scannerBtn: {
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  scannerBtnActive: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  scannerBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  cameraBox: {
    height: 280,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    backgroundColor: '#000000',
  },
  viewfinderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  viewfinderBorder: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: colors.success,
    borderRadius: borderRadius.md,
  },
  viewfinderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 20,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  resultCardValid: {
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
  },
  resultCardInvalid: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  bookingData: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  dataLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dataVal: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  dataValBold: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  dataValHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryLight,
  },
});

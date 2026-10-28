import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, borderRadius, typography } from '../../utils/theme';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../firebase/config';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = ({ navigation }) => {
  const { isFirebase, logout } = useAuth();

  const handleResetData = () => {
    Alert.alert(
      'Reset Demo Database',
      'This will reset parking locations, bookings, and slots back to the original academic seed data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Data',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Database Reset', 'Demo database restored to default seed records. Please log in again.');
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Settings & Diagnostics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Backend Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Backend & Database Mode</Text>

          <View style={styles.statusItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusLabel}>Active Storage</Text>
              <Text style={styles.statusSub}>
                {isFirebase
                  ? 'Connected to Google Cloud Firestore'
                  : 'Local Persistence (AsyncStorage Offline-Ready)'}
              </Text>
            </View>
            <StatusBadge status={isFirebase ? 'ACTIVE' : 'DEMO_PAID'} />
          </View>

          <View style={styles.divider} />

          <View style={styles.statusItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusLabel}>Google Maps Navigation</Text>
              <Text style={styles.statusSub}>Turn-by-turn native navigation via Google Maps intent</Text>
            </View>
            <StatusBadge status="ACTIVE" />
          </View>

          <View style={styles.divider} />

          <View style={styles.statusItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusLabel}>Dynamic QR Generator</Text>
              <Text style={styles.statusSub}>High-density vector barcode engine</Text>
            </View>
            <StatusBadge status="ACTIVE" />
          </View>
        </View>

        {/* Demo Mode Notice */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#0369A1" />
          <Text style={styles.infoBoxText}>
            Demo Mode guarantees 100% offline usability on any Android device without requiring an active Firebase billing account during college viva evaluation.
          </Text>
        </View>

        {/* Diagnostic Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Diagnostics</Text>

          <TouchableOpacity style={styles.actionRow} onPress={handleResetData}>
            <View style={styles.actionIcon}>
              <Ionicons name="refresh-circle-outline" size={22} color={colors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionTitle, { color: colors.danger }]}>Reset Demo Database</Text>
              <Text style={styles.actionSub}>Restores initial campus and mall slots</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* About App Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About Application</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLbl}>Application</Text>
            <Text style={styles.infoVal}>Smart Parking Management</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLbl}>Target OS</Text>
            <Text style={styles.infoVal}>Android 14 / 15 / 16 (API 24 - 36)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLbl}>Package</Text>
            <Text style={styles.infoVal}>com.smartparking.management</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLbl}>Build Type</Text>
            <Text style={styles.infoVal}>Production Standalone APK</Text>
          </View>
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
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  statusSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceLight,
    marginVertical: 10,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 8,
    marginBottom: 16,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 10,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  infoLbl: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});

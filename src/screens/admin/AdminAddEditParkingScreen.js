import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, borderRadius, typography } from '../../utils/theme';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { DataService } from '../../services/dataService';
import { Ionicons } from '@expo/vector-icons';

export const AdminAddEditParkingScreen = ({ route, navigation }) => {
  const existing = route?.params?.parking;
  const isEditing = Boolean(existing);

  const [name, setName] = useState(existing?.parkingName || '');
  const [address, setAddress] = useState(existing?.address || '');
  const [latitude, setLatitude] = useState(existing ? String(existing.latitude) : '11.0805');
  const [longitude, setLongitude] = useState(existing ? String(existing.longitude) : '77.1396');
  const [totalSlots, setTotalSlots] = useState(existing ? String(existing.totalSlots) : '16');
  const [pricePerHour, setPricePerHour] = useState(existing ? String(existing.pricePerHour) : '30');
  const [description, setDescription] = useState(existing?.description || '');
  const [status, setStatus] = useState(existing?.status || 'ACTIVE');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Facility name is required.';
    if (!address.trim()) errs.address = 'Full address is required.';
    if (isNaN(parseFloat(latitude))) errs.latitude = 'Enter a valid latitude coordinate.';
    if (isNaN(parseFloat(longitude))) errs.longitude = 'Enter a valid longitude coordinate.';
    if (isNaN(parseInt(totalSlots)) || parseInt(totalSlots) <= 0) errs.totalSlots = 'Enter a positive integer for bays.';
    if (isNaN(parseFloat(pricePerHour)) || parseFloat(pricePerHour) <= 0) errs.pricePerHour = 'Enter a valid hourly rate.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        parkingName: name.trim(),
        address: address.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        totalSlots: parseInt(totalSlots),
        pricePerHour: parseFloat(pricePerHour),
        description: description.trim() || 'Modern parking facility with dedicated bays.',
        status,
        amenities: existing?.amenities || ['24/7 Security', 'CCTV', 'Covered Slots'],
      };

      if (isEditing) {
        await DataService.updateParkingArea(existing.parkingId, payload);
        Alert.alert('Updated', 'Facility details saved successfully.');
      } else {
        await DataService.addParkingArea(payload);
        Alert.alert('Created', 'New parking facility and bays generated successfully.');
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Save Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Facility' : 'Add New Parking'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <CustomInput
            label="Facility Name"
            placeholder="e.g. Technology Park Parking"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: null });
            }}
            error={errors.name}
          />

          <CustomInput
            label="Full Address"
            placeholder="e.g. Avinashi Road, Coimbatore, Tamil Nadu"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              if (errors.address) setErrors({ ...errors, address: null });
            }}
            multiline={true}
            numberOfLines={2}
            error={errors.address}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <CustomInput
                label="Latitude"
                value={latitude}
                onChangeText={(text) => {
                  setLatitude(text);
                  if (errors.latitude) setErrors({ ...errors, latitude: null });
                }}
                keyboardType="numeric"
                error={errors.latitude}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <CustomInput
                label="Longitude"
                value={longitude}
                onChangeText={(text) => {
                  setLongitude(text);
                  if (errors.longitude) setErrors({ ...errors, longitude: null });
                }}
                keyboardType="numeric"
                error={errors.longitude}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <CustomInput
                label="Total Bays"
                value={totalSlots}
                onChangeText={(text) => {
                  setTotalSlots(text);
                  if (errors.totalSlots) setErrors({ ...errors, totalSlots: null });
                }}
                keyboardType="number-pad"
                error={errors.totalSlots}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <CustomInput
                label="Rate (₹/hour)"
                value={pricePerHour}
                onChangeText={(text) => {
                  setPricePerHour(text);
                  if (errors.pricePerHour) setErrors({ ...errors, pricePerHour: null });
                }}
                keyboardType="numeric"
                error={errors.pricePerHour}
              />
            </View>
          </View>

          <CustomInput
            label="Description"
            placeholder="Key features, level info, entry guidelines..."
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={3}
          />

          {/* Status selector */}
          <Text style={styles.statusLabel}>Operating Status</Text>
          <View style={styles.statusRow}>
            <TouchableOpacity
              style={[styles.statusOption, status === 'ACTIVE' && styles.statusOptionActive]}
              onPress={() => setStatus('ACTIVE')}
            >
              <Text style={[styles.statusText, status === 'ACTIVE' && styles.statusTextActive]}>
                Active & Open
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusOption, status === 'MAINTENANCE' && styles.statusOptionMaint]}
              onPress={() => setStatus('MAINTENANCE')}
            >
              <Text style={[styles.statusText, status === 'MAINTENANCE' && styles.statusTextMaint]}>
                Maintenance
              </Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title={isEditing ? 'Save Changes' : 'Create Facility'}
            onPress={handleSave}
            loading={loading}
            style={{ marginTop: 10 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statusOption: {
    flex: 1,
    height: 40,
    borderRadius: borderRadius.md,
    borderWidth: 1.2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
  },
  statusOptionActive: {
    borderColor: colors.success,
    backgroundColor: '#DCFCE7',
  },
  statusOptionMaint: {
    borderColor: colors.warning,
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#15803D',
    fontWeight: '700',
  },
  statusTextMaint: {
    color: '#B45309',
    fontWeight: '700',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { colors, borderRadius, shadows } from '../../utils/theme';
import { CustomButton } from '../../components/CustomButton';
import { StatusBadge } from '../../components/StatusBadge';
import { MapViewComponent } from '../../components/MapViewComponent';
import { Ionicons } from '@expo/vector-icons';

export const ParkingDetailsScreen = ({ route, navigation }) => {
  const { parking } = route.params;

  const openExternalNavigation = () => {
    const scheme = `google.navigation:q=${parking.latitude},${parking.longitude}`;
    const fallback = `https://www.google.com/maps/dir/?api=1&destination=${parking.latitude},${parking.longitude}`;
    Linking.canOpenURL(scheme)
      .then((supported) => Linking.openURL(supported ? scheme : fallback))
      .catch(() => Linking.openURL(fallback));
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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {parking.parkingName}
        </Text>
        <TouchableOpacity
          style={styles.mapBtn}
          onPress={openExternalNavigation}
          activeOpacity={0.7}
        >
          <Ionicons name="navigate-circle-outline" size={26} color={colors.primaryLight} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Interactive Map Preview */}
        <MapViewComponent
          parkingLocations={[parking]}
          selectedParking={parking}
          height={220}
        />

        {/* Title & Price Card */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.name}>{parking.parkingName}</Text>
              <View style={styles.badgeRow}>
                <StatusBadge status={parking.status || 'ACTIVE'} size="sm" />
                <View style={styles.ratingBox}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={styles.ratingText}>{parking.rating || 4.8}</Text>
                </View>
              </View>
            </View>

            <View style={styles.priceBox}>
              <Text style={styles.priceNum}>₹{parking.pricePerHour}</Text>
              <Text style={styles.priceSub}>per hour</Text>
            </View>
          </View>

          {/* Address */}
          <View style={styles.addressRow}>
            <Ionicons name="location" size={18} color={colors.primaryLight} style={{ marginRight: 6 }} />
            <Text style={styles.addressText}>{parking.address}</Text>
          </View>
        </View>

        {/* Quick Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Ionicons name="car-sport-outline" size={20} color={colors.primaryLight} />
            <Text style={styles.infoVal}>{parking.totalSlots}</Text>
            <Text style={styles.infoLbl}>Total Bays</Text>
          </View>
          <View style={styles.infoCol}>
            <Ionicons name="time-outline" size={20} color="#15803D" />
            <Text style={styles.infoVal}>{parking.operatingHours || '24 Hours'}</Text>
            <Text style={styles.infoLbl}>Timing</Text>
          </View>
          <View style={styles.infoCol}>
            <Ionicons name="card-outline" size={20} color="#B45309" />
            <Text style={styles.infoVal}>₹5</Text>
            <Text style={styles.infoLbl}>Service Fee</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>About Facility</Text>
          <Text style={styles.descriptionText}>{parking.description}</Text>
        </View>

        {/* Amenities */}
        {parking.amenities && parking.amenities.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Amenities & Features</Text>
            <View style={styles.amenitiesWrap}>
              {parking.amenities.map((item, idx) => (
                <View key={idx} style={styles.amenityChip}>
                  <Ionicons name="checkmark-circle" size={14} color="#15803D" />
                  <Text style={styles.amenityText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Footer */}
      <View style={styles.bottomBar}>
        <CustomButton
          title="Choose Parking Slot"
          icon="grid-outline"
          onPress={() => navigation.navigate('SlotSelection', { parking })}
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
    justifyContent: 'space-between',
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
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  mapBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  priceBox: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  priceNum: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  priceSub: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoCol: {
    flex: 1,
    alignItems: 'center',
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  infoLbl: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  amenityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
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
    ...shadows.md,
  },
});

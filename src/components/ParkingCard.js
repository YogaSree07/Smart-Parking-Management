import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { colors, borderRadius, shadows } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBadge } from './StatusBadge';

export const ParkingCard = ({
  parking,
  onPress,
  onBookPress,
  showNavigateBtn = true,
}) => {
  const {
    parkingId,
    parkingName,
    address,
    latitude,
    longitude,
    pricePerHour,
    totalSlots,
    status,
    rating = 4.7,
  } = parking;

  const openGoogleMaps = () => {
    // Open Google Maps navigation with exact coordinates
    const scheme = `google.navigation:q=${latitude},${longitude}`;
    const webFallback = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    Linking.canOpenURL(scheme)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(scheme);
        } else {
          return Linking.openURL(webFallback);
        }
      })
      .catch(() => {
        Linking.openURL(webFallback);
      });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name} numberOfLines={1}>
            {parkingName}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.dot}>•</Text>
            <StatusBadge status={status || 'ACTIVE'} size="sm" />
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceAmount}>₹{pricePerHour}</Text>
          <Text style={styles.pricePeriod}>/hr</Text>
        </View>
      </View>

      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={16} color={colors.textSecondary} style={styles.pinIcon} />
        <Text style={styles.address} numberOfLines={2}>
          {address}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="car-outline" size={16} color={colors.primaryLight} />
          <Text style={styles.metaText}>{totalSlots} Total Slots</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="navigate-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>{latitude.toFixed(4)}, {longitude.toFixed(4)}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        {showNavigateBtn && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={openGoogleMaps}
            activeOpacity={0.7}
          >
            <Ionicons name="navigate" size={16} color={colors.primaryLight} />
            <Text style={styles.navBtnText}>Navigate</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.bookButton}
          onPress={onBookPress || onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.bookBtnText}>Select Slot</Text>
          <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
    marginRight: 6,
  },
  dot: {
    color: colors.textMuted,
    marginRight: 6,
  },
  priceContainer: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  pricePeriod: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pinIcon: {
    marginRight: 6,
  },
  address: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navButton: {
    flex: 1,
    height: 40,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  bookButton: {
    flex: 1.5,
    height: 40,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  bookBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

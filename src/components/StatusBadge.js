import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../utils/theme';

export const StatusBadge = ({ status, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
      case 'ACTIVE':
      case 'AVAILABLE':
        return {
          bg: '#DCFCE7',
          text: '#15803D',
          label: status,
        };
      case 'COMPLETED':
        return {
          bg: '#E0F2FE',
          text: '#0369A1',
          label: status,
        };
      case 'CANCELLED':
      case 'OCCUPIED':
      case 'EXPIRED':
        return {
          bg: '#FEE2E2',
          text: '#B91C1C',
          label: status,
        };
      case 'DEMO_PAID':
        return {
          bg: '#ECFDF5',
          text: '#047857',
          label: 'PAID (DEMO)',
        };
      case 'MAINTENANCE':
        return {
          bg: '#FEF3C7',
          text: '#B45309',
          label: 'MAINTENANCE',
        };
      default:
        return {
          bg: colors.surfaceLight,
          text: colors.textSecondary,
          label: status || 'UNKNOWN',
        };
    }
  };

  const config = getBadgeConfig();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        isSmall && styles.badgeSmall,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: config.text },
          isSmall && styles.textSmall,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  textSmall: {
    fontSize: 10,
  },
});

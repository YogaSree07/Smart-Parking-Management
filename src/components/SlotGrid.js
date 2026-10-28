import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, typography } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

export const SlotGrid = ({
  slots = [],
  selectedSlotId,
  onSelectSlot,
  isLoading = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.available }]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.occupied }]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.selected }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {slots.map((slot) => {
          const isSelected = selectedSlotId === slot.slotId;
          const isOccupied = slot.isOccupied;

          let slotBg = colors.available;
          let textColor = '#FFFFFF';
          let borderColor = colors.available;

          if (isOccupied) {
            slotBg = '#FEE2E2';
            textColor = colors.occupied;
            borderColor = '#FECACA';
          } else if (isSelected) {
            slotBg = colors.selected;
            textColor = '#FFFFFF';
            borderColor = colors.primary;
          } else {
            slotBg = '#ECFDF5';
            textColor = '#047857';
            borderColor = '#A7F3D0';
          }

          return (
            <TouchableOpacity
              key={slot.slotId}
              style={[
                styles.slotItem,
                {
                  backgroundColor: slotBg,
                  borderColor: borderColor,
                },
                isSelected && styles.slotSelectedRing,
              ]}
              disabled={isOccupied || isLoading}
              onPress={() => onSelectSlot(slot)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isOccupied ? 'car' : isSelected ? 'checkmark-circle' : 'car-outline'}
                size={20}
                color={textColor}
              />
              <Text style={[styles.slotText, { color: textColor }]}>
                {slot.slotId}
              </Text>
              <Text style={[styles.typeBadge, { color: textColor }]}>
                {slot.type === 'EV Charging' ? 'EV' : slot.type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  slotItem: {
    width: '22%',
    aspectRatio: 0.95,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  slotSelectedRing: {
    borderWidth: 2.5,
    borderColor: colors.primaryDark,
    transform: [{ scale: 1.05 }],
  },
  slotText: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  typeBadge: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, borderRadius, typography } from '../../utils/theme';
import { DataService } from '../../services/dataService';
import { StatusBadge } from '../../components/StatusBadge';
import { Ionicons } from '@expo/vector-icons';

export const AdminSlotManagementScreen = ({ route, navigation }) => {
  const { parking } = route.params;
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      const data = await DataService.getSlots(parking.parkingId);
      setSlots(data);
    } catch (err) {
      console.warn('Error fetching slots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleToggleMaintenance = async (slot) => {
    const action = slot.isUnderMaintenance ? 'Enable' : 'Place under Maintenance';
    Alert.alert(
      `${action} Bay ${slot.slotId}`,
      `Do you want to change the operating status of Bay ${slot.slotId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            await DataService.toggleSlotMaintenance(parking.parkingId, slot.slotId);
            fetchSlots();
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
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {parking.parkingName}
          </Text>
          <Text style={styles.headerSubtitle}>Bay Management & Maintenance</Text>
        </View>
      </View>

      {/* Overview Card */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{slots.length}</Text>
          <Text style={styles.summaryLbl}>Total Bays</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNum, { color: colors.available }]}>
            {slots.filter((s) => !s.isUnderMaintenance && !s.isOccupied).length}
          </Text>
          <Text style={styles.summaryLbl}>Operational</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNum, { color: colors.warning }]}>
            {slots.filter((s) => s.isUnderMaintenance).length}
          </Text>
          <Text style={styles.summaryLbl}>Maintenance</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primaryLight} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item.slotId}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => {
            const isMaint = item.isUnderMaintenance;
            return (
              <View
                style={[
                  styles.slotCard,
                  isMaint && { borderColor: '#FDE68A', backgroundColor: '#FFFBEB' },
                ]}
              >
                <View style={styles.slotTop}>
                  <View style={styles.bayBadge}>
                    <Text style={styles.bayText}>{item.slotId}</Text>
                  </View>
                  <StatusBadge
                    status={isMaint ? 'MAINTENANCE' : item.isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
                    size="sm"
                  />
                </View>

                <Text style={styles.slotType}>{item.type}</Text>
                <Text style={styles.slotFloor}>{item.floor || 'Ground'}</Text>

                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    isMaint ? styles.toggleBtnReactivate : styles.toggleBtnMaint,
                  ]}
                  onPress={() => handleToggleMaintenance(item)}
                >
                  <Ionicons
                    name={isMaint ? 'checkmark-circle-outline' : 'construct-outline'}
                    size={14}
                    color={isMaint ? '#15803D' : '#B45309'}
                  />
                  <Text
                    style={[
                      styles.toggleBtnText,
                      { color: isMaint ? '#15803D' : '#B45309' },
                    ]}
                  >
                    {isMaint ? 'Reactivate' : 'Hold Maintenance'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNum: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  summaryLbl: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  slotCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  slotTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bayBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  bayText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  slotType: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  slotFloor: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  toggleBtnMaint: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  toggleBtnReactivate: {
    backgroundColor: '#DCFCE7',
    borderColor: '#BBF7D0',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

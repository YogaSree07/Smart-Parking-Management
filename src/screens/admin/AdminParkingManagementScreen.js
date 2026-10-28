import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, borderRadius, shadows } from '../../utils/theme';
import { DataService } from '../../services/dataService';
import { StatusBadge } from '../../components/StatusBadge';
import { Ionicons } from '@expo/vector-icons';

export const AdminParkingManagementScreen = ({ navigation }) => {
  const [parkingList, setParkingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchParkings = async () => {
    try {
      const data = await DataService.getParkingAreas();
      setParkingList(data);
    } catch (err) {
      console.warn('Fetch parkings error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchParkings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchParkings();
  };

  const handleDelete = (parking) => {
    Alert.alert(
      'Delete Facility',
      `Are you sure you want to delete "${parking.parkingName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await DataService.deleteParkingArea(parking.parkingId);
              Alert.alert('Deleted', 'Parking facility removed successfully.');
              fetchParkings();
            } catch (err) {
              Alert.alert('Cannot Delete', err.message);
            }
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
        <Text style={styles.headerTitle}>Parking Facilities</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AdminAddEditParking')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primaryLight} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={parkingList}
          keyExtractor={(item) => item.parkingId}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.name}>{item.parkingName}</Text>
                  <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
                </View>
                <StatusBadge status={item.status || 'ACTIVE'} size="sm" />
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  <Text style={{ fontWeight: '700', color: colors.text }}>{item.totalSlots}</Text> Bays
                </Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.metaText}>
                  <Text style={{ fontWeight: '700', color: colors.primaryLight }}>₹{item.pricePerHour}</Text>/hr
                </Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.metaText}>GPS: {item.latitude.toFixed(2)}, {item.longitude.toFixed(2)}</Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.slotBtn}
                  onPress={() => navigation.navigate('AdminSlotManagement', { parking: item })}
                >
                  <Ionicons name="grid-outline" size={15} color={colors.primaryLight} />
                  <Text style={styles.slotBtnText}>Manage Bays</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate('AdminAddEditParking', { parking: item })}
                >
                  <Ionicons name="create-outline" size={15} color={colors.text} />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item)}
                >
                  <Ionicons name="trash-outline" size={15} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  address: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dot: {
    marginHorizontal: 8,
    color: colors.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  slotBtn: {
    flex: 1,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  slotBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  editBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceLight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

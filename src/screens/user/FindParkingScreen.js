import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { colors, borderRadius, shadows } from '../../utils/theme';
import { DataService } from '../../services/dataService';
import { ParkingCard } from '../../components/ParkingCard';
import { Ionicons } from '@expo/vector-icons';

export const FindParkingScreen = ({ navigation }) => {
  const [parkingList, setParkingList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchParkings = async () => {
    try {
      const data = await DataService.getParkingAreas();
      setParkingList(data);
    } catch (err) {
      console.warn('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchParkings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchParkings();
  };

  const filteredList = parkingList.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.parkingName.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search campus, mall, station..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.mapToggleBtn}
          onPress={() => navigation.navigate('MapTab')}
          activeOpacity={0.8}
        >
          <Ionicons name="map-outline" size={20} color={colors.primaryLight} />
        </TouchableOpacity>
      </View>

      {/* Counter */}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>
          {filteredList.length} Facilities Available
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primaryLight} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.parkingId}
          renderItem={({ item }) => (
            <ParkingCard
              parking={item}
              onPress={() => navigation.navigate('ParkingDetails', { parking: item })}
              onBookPress={() => navigation.navigate('SlotSelection', { parking: item })}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={48} color={colors.border} />
              <Text style={styles.emptyTitle}>No facilities found</Text>
              <Text style={styles.emptySubtitle}>Try searching for another location</Text>
            </View>
          }
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
  searchHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flex: 1,
    height: 44,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  mapToggleBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#EFF6FF',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  listContent: {
    padding: 16,
    paddingTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

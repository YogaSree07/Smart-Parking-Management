import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../utils/theme';
import { MapViewComponent } from '../../components/MapViewComponent';
import { DataService } from '../../services/dataService';

export const MapViewScreen = ({ navigation }) => {
  const [parkingAreas, setParkingAreas] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);

  useEffect(() => {
    loadParkings();
  }, []);

  const loadParkings = async () => {
    try {
      const areas = await DataService.getParkingAreas();
      setParkingAreas(areas);
      if (areas.length > 0) setSelectedParking(areas[0]);
    } catch (e) {
      console.warn('Map load error:', e);
    }
  };

  const mapHeight = Dimensions.get('window').height - 110;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Parking Map</Text>
        <Text style={styles.headerSubtitle}>Tap any marker to inspect bays or navigate</Text>
      </View>

      <MapViewComponent
        parkingLocations={parkingAreas}
        selectedParking={selectedParking}
        onSelectParking={(item) => setSelectedParking(item)}
        height={mapHeight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

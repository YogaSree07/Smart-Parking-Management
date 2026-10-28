import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { colors, borderRadius, shadows } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

export const MapViewComponent = ({
  parkingLocations = [],
  selectedParking = null,
  onSelectParking = () => {},
  height = 360,
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locPermission, setLocPermission] = useState('undetermined');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    requestUserLocation();
  }, []);

  const requestUserLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocPermission(status);
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(coords);
      }
    } catch (err) {
      console.warn('Could not retrieve current location:', err.message);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Default center: Coimbatore / KPRIET region (11.05, 77.05)
  const defaultCenter = selectedParking
    ? [selectedParking.latitude, selectedParking.longitude]
    : userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [11.05, 77.05];

  // Generate Leaflet HTML
  const generateLeafletHtml = () => {
    const markersJs = parkingLocations
      .map((p) => {
        const isSelected = selectedParking?.parkingId === p.parkingId;
        const markerColor = isSelected ? '#2563EB' : '#1E3A8A';
        return `
          var pIcon_${p.parkingId.replace(/[^a-zA-Z0-9]/g, '_')} = L.divIcon({
            className: 'custom-pin',
            html: '<div style="background-color: ${markerColor}; color: white; padding: 6px 10px; border-radius: 14px; font-weight: bold; font-size: 11px; box-shadow: 0 2px 6px rgba(0,0,0,0.4); border: 2px solid white; display: flex; align-items: center; gap: 4px;">' +
                  '<span>🅿️</span> ₹${p.pricePerHour}/hr</div>',
            iconSize: [80, 30],
            iconAnchor: [40, 15]
          });

          var marker_${p.parkingId.replace(/[^a-zA-Z0-9]/g, '_')} = L.marker([${p.latitude}, ${p.longitude}], {
            icon: pIcon_${p.parkingId.replace(/[^a-zA-Z0-9]/g, '_')}
          }).addTo(map);

          marker_${p.parkingId.replace(/[^a-zA-Z0-9]/g, '_')}.bindPopup(
            '<b>${p.parkingName}</b><br/>${p.address}<br/><b>₹${p.pricePerHour}/hr</b> • ${p.totalSlots} Slots'
          );

          marker_${p.parkingId.replace(/[^a-zA-Z0-9]/g, '_')}.on('click', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'MARKER_CLICK',
              parkingId: '${p.parkingId}'
            }));
          });
        `;
      })
      .join('\n');

    const userMarkerJs = userLocation
      ? `
        var userIcon = L.divIcon({
          className: 'user-pin',
          html: '<div style="background: #10B981; border: 3px solid white; border-radius: 50%; width: 18px; height: 18px; box-shadow: 0 0 10px #10B981;"></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });
        L.marker([${userLocation.latitude}, ${userLocation.longitude}], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>Your Current Location</b>');
      `
      : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
          .leaflet-popup-content-wrapper { border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 12px; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { zoomControl: true }).setView([${defaultCenter[0]}, ${defaultCenter[1]}], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          ${markersJs}
          ${userMarkerJs}
        </script>
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MARKER_CLICK') {
        const found = parkingLocations.find((p) => p.parkingId === data.parkingId);
        if (found) onSelectParking(found);
      }
    } catch (e) {
      console.warn('Map message error:', e);
    }
  };

  const openTurnByTurnNavigation = (target) => {
    const dest = target || selectedParking || parkingLocations[0];
    if (!dest) {
      Alert.alert('Navigation', 'Please select a parking facility first.');
      return;
    }

    const scheme = `google.navigation:q=${dest.latitude},${dest.longitude}`;
    const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${dest.latitude},${dest.longitude}`;

    Linking.canOpenURL(scheme)
      .then((supported) => {
        if (supported) {
          Linking.openURL(scheme);
        } else {
          Linking.openURL(fallbackUrl);
        }
      })
      .catch(() => {
        Linking.openURL(fallbackUrl);
      });
  };

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: generateLeafletHtml() }}
        onMessage={handleWebViewMessage}
        onLoadEnd={() => setMapLoaded(true)}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      {/* Floating GPS button */}
      <TouchableOpacity
        style={styles.gpsButton}
        onPress={requestUserLocation}
        activeOpacity={0.8}
      >
        {loadingLocation ? (
          <ActivityIndicator size="small" color={colors.primaryLight} />
        ) : (
          <Ionicons
            name={locPermission === 'granted' ? 'locate' : 'locate-outline'}
            size={22}
            color={locPermission === 'granted' ? colors.success : colors.text}
          />
        )}
      </TouchableOpacity>

      {/* Active Selection / Navigation Card */}
      {selectedParking && (
        <View style={styles.floatingCard}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {selectedParking.parkingName}
              </Text>
              <Text style={styles.cardSub} numberOfLines={1}>
                {selectedParking.address}
              </Text>
            </View>
            <View style={styles.rateBadge}>
              <Text style={styles.rateText}>₹{selectedParking.pricePerHour}/hr</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.navActionBtn}
            onPress={() => openTurnByTurnNavigation(selectedParking)}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate" size={16} color="#FFFFFF" />
            <Text style={styles.navActionText}>Start Google Maps Navigation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  webView: {
    flex: 1,
  },
  gpsButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  floatingCard: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: 12,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  cardSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rateBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  rateText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  navActionBtn: {
    backgroundColor: colors.primaryLight,
    height: 38,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  navActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

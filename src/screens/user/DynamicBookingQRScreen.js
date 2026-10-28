import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { colors, borderRadius, typography } from '../../utils/theme';
import { QRViewer } from '../../components/QRViewer';
import { CustomButton } from '../../components/CustomButton';
import { StatusBadge } from '../../components/StatusBadge';
import { Ionicons } from '@expo/vector-icons';

export const DynamicBookingQRScreen = ({ route, navigation }) => {
  const { booking } = route.params;

  const openNavigation = () => {
    const query = encodeURIComponent(booking.parkingName);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
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
        <Text style={styles.headerTitle}>Digital Parking Pass</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pass Box */}
        <View style={styles.passCard}>
          <View style={styles.facilityHeader}>
            <Text style={styles.facilityName}>{booking.parkingName}</Text>
            <StatusBadge status={booking.bookingStatus} />
          </View>

          <View style={styles.bayContainer}>
            <Text style={styles.bayLabel}>Assigned Bay</Text>
            <Text style={styles.bayValue}>Bay {booking.slotId}</Text>
          </View>

          {/* QR Code */}
          <QRViewer booking={booking} size={230} />

          <View style={styles.scheduleRow}>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLbl}>Date</Text>
              <Text style={styles.scheduleVal}>{booking.bookingDate}</Text>
            </View>
            <View style={styles.scheduleItemRight}>
              <Text style={styles.scheduleLbl}>Time Window</Text>
              <Text style={styles.scheduleVal}>{booking.startTime} - {booking.endTime}</Text>
            </View>
          </View>
        </View>

        {/* Instructions banner */}
        <View style={styles.tipBox}>
          <Ionicons name="bulb-outline" size={20} color="#B45309" />
          <Text style={styles.tipText}>
            Present this QR code to the entrance scanner or system administrator at the parking gate.
          </Text>
        </View>

        <CustomButton
          title="Start Google Maps Navigation"
          icon="navigate-outline"
          onPress={openNavigation}
          style={{ marginTop: 16 }}
        />
      </ScrollView>
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
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 14,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  passCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    alignItems: 'center',
  },
  facilityHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  bayContainer: {
    backgroundColor: '#EFF6FF',
    width: '100%',
    padding: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: 10,
  },
  bayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  bayValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryLight,
    marginTop: 2,
  },
  scheduleRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
    marginTop: 8,
  },
  scheduleItem: {
    flex: 1,
  },
  scheduleItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  scheduleLbl: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  scheduleVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 10,
    marginTop: 16,
    width: '100%',
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
});

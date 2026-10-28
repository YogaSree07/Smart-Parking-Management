import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, borderRadius, typography } from '../../utils/theme';
import { SlotGrid } from '../../components/SlotGrid';
import { CustomButton } from '../../components/CustomButton';
import { DataService } from '../../services/dataService';
import { Ionicons } from '@expo/vector-icons';

export const SlotSelectionScreen = ({ route, navigation }) => {
  const { parking } = route.params;

  // Today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedStartTime, setSelectedStartTime] = useState('10:00 AM');
  const [selectedEndTime, setSelectedEndTime] = useState('12:00 PM');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Time slots options for selector
  const timeOptions = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  // Dates: Today, Tomorrow, Day after
  const dateOptions = [
    { label: 'Today', value: todayStr },
    {
      label: 'Tomorrow',
      value: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    },
    {
      label: 'Day After',
      value: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    },
  ];

  useEffect(() => {
    fetchSlots();
  }, [selectedDate, selectedStartTime, selectedEndTime]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    setSelectedSlot(null); // reset selected slot on time change
    try {
      const data = await DataService.getSlots(
        parking.parkingId,
        selectedDate,
        selectedStartTime,
        selectedEndTime
      );
      setSlots(data);
    } catch (err) {
      console.warn('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleProceed = () => {
    if (!selectedSlot) {
      Alert.alert('Selection Required', 'Please select an available parking bay.');
      return;
    }

    navigation.navigate('BookingDetails', {
      parking,
      slot: selectedSlot,
      bookingDate: selectedDate,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
    });
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
          <Text style={styles.title} numberOfLines={1}>
            {parking.parkingName}
          </Text>
          <Text style={styles.subtitle}>Select Date, Time & Parking Bay</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Date Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Select Booking Date</Text>
          <View style={styles.dateRow}>
            {dateOptions.map((d) => (
              <TouchableOpacity
                key={d.value}
                style={[
                  styles.datePill,
                  selectedDate === d.value && styles.datePillActive,
                ]}
                onPress={() => setSelectedDate(d.value)}
              >
                <Text
                  style={[
                    styles.dateLabel,
                    selectedDate === d.value && styles.dateLabelActive,
                  ]}
                >
                  {d.label}
                </Text>
                <Text
                  style={[
                    styles.dateVal,
                    selectedDate === d.value && styles.dateValActive,
                  ]}
                >
                  {d.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Select Time Duration</Text>
          <View style={styles.timeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                {timeOptions.slice(0, 8).map((t) => (
                  <TouchableOpacity
                    key={`start-${t}`}
                    style={[
                      styles.timePill,
                      selectedStartTime === t && styles.timePillActive,
                    ]}
                    onPress={() => setSelectedStartTime(t)}
                  >
                    <Text
                      style={[
                        styles.timePillText,
                        selectedStartTime === t && styles.timePillTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.timeLabel}>End Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
              {timeOptions.slice(2).map((t) => (
                <TouchableOpacity
                  key={`end-${t}`}
                  style={[
                    styles.timePill,
                    selectedEndTime === t && styles.timePillActive,
                  ]}
                  onPress={() => setSelectedEndTime(t)}
                >
                  <Text
                    style={[
                      styles.timePillText,
                      selectedEndTime === t && styles.timePillTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Slots Grid */}
        <View style={styles.section}>
          <View style={styles.slotsHeaderRow}>
            <Text style={styles.sectionTitle}>3. Choose Available Bay</Text>
            {loadingSlots && <ActivityIndicator size="small" color={colors.primaryLight} />}
          </View>

          <SlotGrid
            slots={slots}
            selectedSlotId={selectedSlot?.slotId}
            onSelectSlot={(slot) => setSelectedSlot(slot)}
            isLoading={loadingSlots}
          />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.selectedBayText}>
            {selectedSlot ? `Bay ${selectedSlot.slotId} (${selectedSlot.type})` : 'No Bay Selected'}
          </Text>
          <Text style={styles.rateSummary}>
            ₹{parking.pricePerHour}/hr • Rate
          </Text>
        </View>
        <CustomButton
          title="Proceed"
          disabled={!selectedSlot}
          onPress={handleProceed}
          style={{ flex: 1 }}
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  datePill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
  },
  datePillActive: {
    borderColor: colors.primaryLight,
    backgroundColor: '#EFF6FF',
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  dateLabelActive: {
    color: colors.primaryLight,
  },
  dateVal: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },
  dateValActive: {
    color: colors.primaryLight,
  },
  timeRow: {
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  timeScroll: {
    flexDirection: 'row',
  },
  timePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceLight,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timePillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  timePillText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  timePillTextActive: {
    color: '#FFFFFF',
  },
  slotsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bottomInfo: {
    flex: 1,
  },
  selectedBayText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  rateSummary: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

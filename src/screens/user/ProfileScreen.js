import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, borderRadius, typography } from '../../utils/theme';
import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen = ({ navigation }) => {
  const { user, role, logout, switchDemoRole, isFirebase } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const handleSwitchToAdmin = async () => {
    try {
      await switchDemoRole('admin');
      navigation.replace('AdminStack');
    } catch (err) {
      Alert.alert('Role Switch Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>User Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color={colors.primaryLight} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Customer'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          <View style={styles.roleBadgeContainer}>
            <StatusBadge status={role === 'admin' ? 'ACTIVE' : 'CONFIRMED'} size="sm" />
            <Text style={styles.roleText}>{role === 'admin' ? 'System Administrator' : 'Verified Customer'}</Text>
          </View>
        </View>

        {/* Demo Fast-Switch Box */}
        <View style={styles.demoCard}>
          <View style={styles.demoHeader}>
            <Ionicons name="shield-outline" size={18} color="#B45309" />
            <Text style={styles.demoTitle}>Role Authorization Switcher</Text>
          </View>
          <Text style={styles.demoSub}>
            Currently authenticated as {role === 'admin' ? 'Admin' : 'Regular User'}. Switch role instantly to evaluate admin permissions:
          </Text>
          {role !== 'admin' ? (
            <TouchableOpacity style={styles.switchBtn} onPress={handleSwitchToAdmin}>
              <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
              <Text style={styles.switchBtnText}>Switch to Admin Console</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.switchBtn, { backgroundColor: colors.primaryLight }]}
              onPress={async () => {
                await switchDemoRole('user');
                navigation.replace('UserTabs');
              }}
            >
              <Ionicons name="person" size={16} color="#FFFFFF" />
              <Text style={styles.switchBtnText}>Switch to Customer View</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Account Details Form */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardSectionTitle}>Account Information</Text>
            <TouchableOpacity onPress={() => setEditing(!editing)}>
              <Text style={styles.editBtnText}>{editing ? 'Done' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          <CustomInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            editable={editing}
            icon="person-outline"
          />

          <CustomInput
            label="Email Address (Read-only)"
            value={user?.email || ''}
            editable={false}
            icon="mail-outline"
          />

          <CustomInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            editable={editing}
            placeholder="+91 98765 43210"
            icon="call-outline"
            keyboardType="phone-pad"
          />
        </View>

        {/* App Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>System Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLbl}>Storage Backend</Text>
            <Text style={styles.infoVal}>{isFirebase ? 'Cloud Firestore' : 'Local Sandbox (AsyncStorage)'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLbl}>Package Name</Text>
            <Text style={styles.infoVal}>com.smartparking.management</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLbl}>Version</Text>
            <Text style={styles.infoVal}>1.0.0 (Release Build)</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <CustomButton
          title="Sign Out"
          variant="danger"
          icon="log-out-outline"
          onPress={handleLogout}
          style={{ marginTop: 8 }}
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
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  demoCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  demoSub: {
    fontSize: 12,
    color: '#B45309',
    lineHeight: 16,
    marginBottom: 12,
  },
  switchBtn: {
    backgroundColor: '#B45309',
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  switchBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  infoLbl: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});

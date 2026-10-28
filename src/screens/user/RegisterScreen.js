import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, borderRadius, typography } from '../../utils/theme';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // default to user
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required.';

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const session = await register(name, email, password, phone, role);
      Alert.alert(
        'Registration Successful',
        `Welcome to Smart Parking, ${session.name}!`,
        [
          {
            text: 'Continue',
            onPress: () => {
              if (session.role === 'admin') {
                navigation.replace('AdminStack');
              } else {
                navigation.replace('UserTabs');
              }
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'Could not register user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Smart Parking Management System</Text>
        </View>

        {/* Card Form */}
        <View style={styles.card}>
          <CustomInput
            label="Full Name"
            placeholder="e.g. John Doe"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: null });
            }}
            icon="person-outline"
            error={errors.name}
          />

          <CustomInput
            label="Email Address"
            placeholder="e.g. john@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <CustomInput
            label="Phone Number (Optional)"
            placeholder="e.g. +91 98765 43210"
            value={phone}
            onChangeText={setPhone}
            icon="call-outline"
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            icon="lock-closed-outline"
            isPassword={true}
            error={errors.password}
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
            }}
            icon="lock-closed-outline"
            isPassword={true}
            error={errors.confirmPassword}
          />

          {/* Role selector */}
          <Text style={styles.roleLabel}>Account Role</Text>
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[styles.roleOption, role === 'user' && styles.roleOptionActive]}
              onPress={() => setRole('user')}
            >
              <Ionicons
                name="person"
                size={16}
                color={role === 'user' ? '#FFFFFF' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'user' && { color: '#FFFFFF', fontWeight: '700' },
                ]}
              >
                User (Customer)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleOption, role === 'admin' && styles.roleOptionActiveAdmin]}
              onPress={() => setRole('admin')}
            >
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={role === 'admin' ? '#FFFFFF' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'admin' && { color: '#FFFFFF', fontWeight: '700' },
                ]}
              >
                Administrator
              </Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: 12 }}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already registered? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign in here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    paddingTop: 40,
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
    position: 'relative',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  roleOption: {
    flex: 1,
    height: 42,
    borderRadius: borderRadius.md,
    borderWidth: 1.2,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceLight,
  },
  roleOptionActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  roleOptionActiveAdmin: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  roleText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primaryLight,
    fontWeight: '700',
    fontSize: 14,
  },
});

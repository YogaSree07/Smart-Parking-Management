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

export const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 5) {
      errs.password = 'Password must be at least 5 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const session = await login(email, password);
      if (session.role === 'admin') {
        navigation.replace('AdminStack');
      } else {
        navigation.replace('UserTabs');
      }
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helpers for faculty presentation
  const fillDemoUser = () => {
    setEmail('user@smartparking.com');
    setPassword('user123');
    setErrors({});
  };

  const fillDemoAdmin = () => {
    setEmail('admin@smartparking.com');
    setPassword('admin123');
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="car" size={36} color={colors.primaryLight} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your Smart Parking account</Text>
        </View>

        {/* Demo Credentials Quick Fill Box */}
        <View style={styles.demoBox}>
          <View style={styles.demoHeader}>
            <Ionicons name="information-circle" size={16} color={colors.accent} />
            <Text style={styles.demoTitle}>Quick Demo Logins (Faculty Presentation)</Text>
          </View>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity style={styles.demoPill} onPress={fillDemoUser}>
              <Ionicons name="person-circle-outline" size={15} color={colors.primaryLight} />
              <Text style={styles.demoPillText}>Demo User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.demoPill, styles.demoAdminPill]} onPress={fillDemoAdmin}>
              <Ionicons name="shield-checkmark-outline" size={15} color="#B45309" />
              <Text style={[styles.demoPillText, { color: '#B45309' }]}>Demo Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <CustomInput
            label="Email Address"
            placeholder="e.g. user@smartparking.com"
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
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            icon="lock-closed-outline"
            isPassword={true}
            error={errors.password}
          />

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: 10 }}
          />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register here</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
  },
  demoBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: borderRadius.md,
    padding: 12,
    marginBottom: 20,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  demoAdminPill: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  demoPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primaryLight,
    fontWeight: '700',
    fontSize: 14,
  },
});

export const colors = {
  primary: '#1E3A8A', // Deep Navy
  primaryLight: '#2563EB', // Royal Blue
  primaryDark: '#0F172A', // Slate 900
  accent: '#3B82F6', // Blue Accent
  background: '#F8FAFC', // Crisp background
  card: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  available: '#10B981', // Green for available slots
  occupied: '#EF4444', // Red for occupied slots
  selected: '#2563EB', // Blue for selected
  warning: '#F59E0B',
  success: '#10B981',
  danger: '#EF4444',
  info: '#0EA5E9',
  surfaceLight: '#F1F5F9',
  overlay: 'rgba(15, 23, 42, 0.6)',
};

export const typography = {
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};

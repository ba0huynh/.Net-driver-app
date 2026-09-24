import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useSession } from '@/hooks/use-session';
import { useTheme } from '@/hooks/use-theme';

type FormErrors = { driverId?: string; password?: string; form?: string };

export default function SignInScreen() {
  const theme = useTheme();
  const { signIn } = useSession();
  const passwordRef = useRef<TextInput>(null);

  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const nextErrors: FormErrors = {};
    if (!driverId.trim()) nextErrors.driverId = 'Enter your driver ID';
    if (!password) nextErrors.password = 'Enter your password';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signIn(driverId.trim(), password);
    } catch {
      setErrors({ form: 'Could not sign in. Check your details and try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Brand header */}
          <View style={[styles.hero, { backgroundColor: theme.primary }]}>
            <SafeAreaView edges={['top']} style={styles.heroInner}>
              <View style={styles.logoBadge}>
                <SymbolView
                  name={{ ios: 'bus.fill', android: 'directions_bus', web: 'directions_bus' }}
                  size={40}
                  tintColor={theme.primary}
                />
              </View>
              <ThemedText type="subtitle" style={[styles.heroTitle, { color: theme.onPrimary }]}>
                Driver Dispatch
              </ThemedText>
              <ThemedText style={[styles.heroSubtitle, { color: theme.onPrimary }]}>
                Sign in to view your routes and start your shift
              </ThemedText>
            </SafeAreaView>
          </View>

          {/* Form */}
          <SafeAreaView edges={['bottom']} style={styles.body}>
            <ThemedView type="background" style={styles.card}>
              <FormField
                label="Driver ID"
                icon={{ ios: 'person.text.rectangle', android: 'badge', web: 'badge' }}
                placeholder="e.g. DRV-1024"
                value={driverId}
                onChangeText={(text) => {
                  setDriverId(text);
                  if (errors.driverId) setErrors((e) => ({ ...e, driverId: undefined }));
                }}
                error={errors.driverId}
                autoCapitalize="characters"
                autoCorrect={false}
                autoComplete="username"
                textContentType="username"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => passwordRef.current?.focus()}
                editable={!submitting}
              />

              <FormField
                ref={passwordRef}
                label="Password"
                icon={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                }}
                error={errors.password}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
                editable={!submitting}
                trailing={
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                    <SymbolView
                      name={
                        showPassword
                          ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
                          : { ios: 'eye', android: 'visibility', web: 'visibility' }
                      }
                      size={20}
                      tintColor={theme.textSecondary}
                    />
                  </Pressable>
                }
              />

              <View style={styles.optionsRow}>
                <View style={styles.rememberMe}>
                  <Switch
                    value={rememberMe}
                    onValueChange={setRememberMe}
                    trackColor={{ true: theme.primary, false: theme.backgroundSelected }}
                    accessibilityLabel="Keep me signed in"
                  />
                  <ThemedText type="small">Keep me signed in</ThemedText>
                </View>
                <Pressable hitSlop={8} accessibilityRole="link">
                  <ThemedText type="smallBold" style={{ color: theme.primary }}>
                    Forgot password?
                  </ThemedText>
                </Pressable>
              </View>

              {errors.form ? (
                <View style={[styles.formError, { borderColor: theme.danger }]}>
                  <SymbolView
                    name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
                    size={18}
                    tintColor={theme.danger}
                  />
                  <ThemedText type="small" style={[styles.flex, { color: theme.danger }]}>
                    {errors.form}
                  </ThemedText>
                </View>
              ) : null}

              <Pressable
                onPress={handleSubmit}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityState={{ busy: submitting }}
                style={({ pressed }) => [
                  styles.submitButton,
                  {
                    backgroundColor: pressed ? theme.primaryPressed : theme.primary,
                    opacity: submitting ? 0.8 : 1,
                  },
                ]}>
                {submitting ? (
                  <ActivityIndicator color={theme.onPrimary} />
                ) : (
                  <>
                    <ThemedText style={[styles.submitLabel, { color: theme.onPrimary }]}>
                      Sign in
                    </ThemedText>
                    <SymbolView
                      name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                      size={20}
                      tintColor={theme.onPrimary}
                    />
                  </>
                )}
              </Pressable>
            </ThemedView>

            {/* Support */}
            <ThemedView type="backgroundElement" style={styles.supportCard}>
              <SymbolView
                name={{ ios: 'headphones', android: 'support_agent', web: 'support_agent' }}
                size={24}
                tintColor={theme.primary}
              />
              <View style={styles.flex}>
                <ThemedText type="smallBold">Trouble signing in?</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Contact the dispatch office for account help.
                </ThemedText>
              </View>
              <Pressable hitSlop={8} accessibilityRole="button">
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  Call
                </ThemedText>
              </Pressable>
            </ThemedView>

            <ThemedText type="small" themeColor="textSecondary" style={styles.version}>
              Version 1.0.0
            </ThemedText>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: Spacing.six,
  },
  heroInner: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    gap: Spacing.two,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderCurve: 'continuous',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
  heroTitle: {
    textAlign: 'center',
  },
  heroSubtitle: {
    textAlign: 'center',
    opacity: 0.9,
  },
  body: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth / 1.5,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    marginTop: -Spacing.five,
  },
  card: {
    gap: Spacing.four - Spacing.one,
    padding: Spacing.four,
    borderRadius: 24,
    borderCurve: 'continuous',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  formError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    minHeight: 56,
    borderRadius: 14,
    borderCurve: 'continuous',
  },
  submitLabel: {
    fontSize: 17,
    fontWeight: 700,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 16,
    borderCurve: 'continuous',
  },
  version: {
    textAlign: 'center',
    paddingVertical: Spacing.three,
  },
});

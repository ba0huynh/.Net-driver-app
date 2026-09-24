import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useState, type ReactNode, type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FormFieldProps = TextInputProps & {
  ref?: Ref<TextInput>;
  label: string;
  icon: SymbolViewProps['name'];
  error?: string;
  /** Rendered at the trailing edge of the input, e.g. a show/hide password toggle. */
  trailing?: ReactNode;
};

export function FormField({ ref, label, icon, error, trailing, style, onFocus, onBlur, ...rest }: FormFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? theme.danger : focused ? theme.primary : theme.border;

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View
        style={[
          styles.inputRow,
          { backgroundColor: theme.backgroundElement, borderColor },
        ]}>
        <SymbolView
          name={icon}
          size={20}
          tintColor={focused ? theme.primary : theme.textSecondary}
        />
        <TextInput
          ref={ref}
          placeholderTextColor={theme.textSecondary}
          selectionColor={theme.primary}
          style={[styles.input, { color: theme.text }, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {trailing}
      </View>
      {error ? (
        <ThemedText type="small" style={{ color: theme.danger }}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
    minHeight: 56,
    paddingHorizontal: Spacing.three,
    borderRadius: 14,
    borderWidth: 1.5,
    borderCurve: 'continuous',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.three,
  },
});

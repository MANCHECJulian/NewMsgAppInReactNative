import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CheckboxProps = {
  text?: string;
};

export function Checkbox({ text }: CheckboxProps) {
  const [checked, setChecked] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => setChecked(!checked)}
    >
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <Text style={styles.label}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },

  checkmark: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  label: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#B0B0B0',
  },
});
import type { ReactNode } from 'react';
import { View, StyleSheet, TextInput as ReactTextInput } from 'react-native';

import { Spacing } from '@/constants/theme';

type TextInputProps = {
  title?: string;
  hint?: ReactNode;
  placeholder?: string;
  hide?: boolean;
};

export function TextInput( { placeholder = '', hide = false }: TextInputProps) {
  return (
    <ReactTextInput
      style={styles.textInput}
      placeholder={placeholder}
      secureTextEntry={hide}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    height: 70,
    borderRadius: 40,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    paddingHorizontal: 24,
    fontSize: 16,
    fontWeight: '400',
    color: '#6B6B6B',
    textAlign: 'center',
  },
});

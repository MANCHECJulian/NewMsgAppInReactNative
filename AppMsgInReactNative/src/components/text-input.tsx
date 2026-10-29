import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput as ReactTextInput } from 'react-native';

type TextInputProps = {
  title?: string;
  hint?: ReactNode;
  placeholder?: string;
  placeholderTextColor?: string;
  hide?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  validate?: (text: string) => string | null;
};

export function TextInput({
  placeholder,
  placeholderTextColor,
  hide = false,
  value,
  onChangeText,
}: TextInputProps) {
  return (
    <ReactTextInput
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={hide}
      value={value}
      onChangeText={onChangeText}
      style={styles.textInput}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    height: 80,
    borderRadius: 50,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    paddingHorizontal: 24,
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
  },
  error: {
    borderColor: 'red',
  },
});

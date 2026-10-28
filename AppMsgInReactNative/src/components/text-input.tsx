import type { ReactNode } from 'react';
import { StyleSheet, TextInput as ReactTextInput } from 'react-native';

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
});

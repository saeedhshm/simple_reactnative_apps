import { ReactNode, Ref, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';



function FormField({ label, error, inputRef, right, ...inputProps }: FormFieldProps) {
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrap, error ? styles.inputWrapError : null]}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholderTextColor="#999"
        {...inputProps}
      />
      {right}
    </View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
}


function fakeRegester(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.trim().toLocaleLowerCase() === 'taken@example.com') {
        reject(new Error('the email is already exists'))
      } else {
        resolve()
      }
    }, 1200)
  })
}



export default function App() {

 


  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  })
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Text>Full name</Text>
      <TextInput
        style={styles.input}
        placeholder='Enter your name'
        value={name}
        onChangeText={setName}
        autoCapitalize='words'
      />
      <Text>Email</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
    backgroundColor: '#f2f2f7'
  },

  flex: { flex: 1, backgroundColor: '#f2f2f7' },
  content: { padding: 20, paddingTop: 70, paddingBottom: 40 },
  title: { fontSize: 34, fontWeight: 'bold', marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 16,
  },
  inputWrapError: { borderColor: '#ff3b30' },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    fontSize: 16,
  },
  // input: { flex: 1, paddingVertical: 14, fontSize: 16 },
  showText: { color: '#007aff', fontWeight: '600', marginLeft: 12 },
  error: { color: '#ff3b30', fontSize: 13, marginTop: 6 },
  switchRow: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { marginLeft: 12, fontSize: 16, flex: 1 },
  submit: { backgroundColor: '#007aff', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: 'white', fontSize: 17, fontWeight: '600' },
});

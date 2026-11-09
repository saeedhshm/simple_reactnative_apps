import { ReactNode, Ref, useRef, useState, ComponentRef } from 'react';
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

type Values = {
  name: string;
  email: string;
  password: string;
  confirm: string;
  agree: boolean;
};
type InputHandle = ComponentRef<typeof TextInput>;
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const INITIAL: Values = { name: '', email: '', password: '', confirm: '', agree: false };
const ORDER: Field[] = ['name', 'email', 'password', 'confirm', 'agree'];

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = 'Enter your full name.';
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) errors.email = 'Enter a valid email address.';
  if (v.password.length < 8) errors.password = 'Use at least 8 characters.';
  else if (!/\d/.test(v.password)) errors.password = 'Include at least one number.';
  if (v.confirm !== v.password) errors.confirm = 'Passwords do not match.';
  if (!v.agree) errors.agree = 'You must accept the terms.';
  return errors;
}

function fakeRegister(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.trim().toLowerCase() === 'taken@example.com') {
        reject(new Error('That email is already registered.'));
      } else {
        resolve();
      }
    }, 1200);
  });
}

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  inputRef?:  Ref<InputHandle>;
  right?: ReactNode;
};

function FormField({ label, error, inputRef, right, ...inputProps }: FormFieldProps) {
  return (
    <View style={styles.field}>
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
  );
}

export default function App() {
  const [values, setValues] = useState<Values>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const inputRefs = useRef<Partial<Record<Field, InputHandle | null>>>({});

  const errors = validate(values);
  const errorFor = (f: Field): string | undefined =>
    touched[f] || submitted ? errors[f] : undefined;

  const setField = <K extends Field>(field: K, value: Values[K]) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const touch = (field: Field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const focusField = (field: Field) => inputRefs.current[field]?.focus();

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitted(true);

    const firstInvalid = ORDER.find((f) => errors[f]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);
    try {
      await fakeRegister(values.email);
      Alert.alert('Account created', `Welcome, ${values.name.trim()}!`);
      setValues(INITIAL);
      setTouched({});
      setSubmitted(false);
    } catch (e) {
      Alert.alert('Sign-up failed', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={styles.title}>Create account</Text>

        <FormField
          label="Full name"
          inputRef={(el) => { inputRefs.current.name = el; }}
          value={values.name}
          onChangeText={(t) => setField('name', t)}
          onBlur={() => touch('name')}
          error={errorFor('name')}
          placeholder="Ada Lovelace"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => focusField('email')}
        />

        <FormField
          label="Email"
          inputRef={(el) => { inputRefs.current.email = el; }}
          value={values.email}
          onChangeText={(t) => setField('email', t)}
          onBlur={() => touch('email')}
          error={errorFor('email')}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => focusField('password')}
        />

        <FormField
          label="Password"
          inputRef={(el) => { inputRefs.current.password = el; }}
          value={values.password}
          onChangeText={(t) => setField('password', t)}
          onBlur={() => touch('password')}
          error={errorFor('password')}
          placeholder="At least 8 characters"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => focusField('confirm')}
          right={
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)} hitSlop={10}>
              <Text style={styles.showText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          }
        />

        <FormField
          label="Confirm password"
          inputRef={(el) => { inputRefs.current.confirm = el; }}
          value={values.confirm}
          onChangeText={(t) => setField('confirm', t)}
          onBlur={() => touch('confirm')}
          error={errorFor('confirm')}
          placeholder="Repeat your password"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <View style={styles.field}>
          <View style={styles.switchRow}>
            <Switch
              value={values.agree}
              onValueChange={(v) => {
                setField('agree', v);
                touch('agree');
              }}
            />
            <Text style={styles.switchLabel}>I accept the terms and conditions</Text>
          </View>
          {errorFor('agree') ? <Text style={styles.error}>{errorFor('agree')}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.submit, submitting && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>{submitting ? 'Creating account...' : 'Sign up'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  input: { flex: 1, paddingVertical: 14, fontSize: 16 },
  showText: { color: '#007aff', fontWeight: '600', marginLeft: 12 },
  error: { color: '#ff3b30', fontSize: 13, marginTop: 6 },
  switchRow: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { marginLeft: 12, fontSize: 16, flex: 1 },
  submit: { backgroundColor: '#007aff', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: 'white', fontSize: 17, fontWeight: '600' },
});
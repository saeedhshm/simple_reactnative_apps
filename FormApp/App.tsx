import { ReactNode, Ref, useRef, useState, forwardRef } from 'react';
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
  ActivityIndicator,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ComponentRef } from 'react';
import { AvatarPicker } from './components/AvatarPicker';

type FormFieldProps = TextInputProps & {
  label: string,
  error: string,
  children?: ReactNode
}

const FormField = forwardRef<
  React.ComponentRef<typeof TextInput>,
  FormFieldProps
>(({ label, error, value, style, children, onBlur, onFocus, ...rest }, ref) => {

  const [isFocused, setIsFocised] = useState(false)

  return <View style={[styles.field]}>
    <Text>{label}</Text>
    <View style={[styles.inputRow, isFocused && styles.inputFocused, error !== '' && styles.inputError]}>
      <TextInput
        {...rest}
        ref={ref}
        style={[styles.input, { flex: 1 }, style]}
        onFocus={(event) => {
          setIsFocised(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setIsFocised(false)
          onBlur?.(event)
        }}
      />
      {children && (
        <View style={styles.actionContainer}>
          {children}
        </View>
      )}
    </View>

    {error !== '' && <Text style={styles.error}>{error}</Text>}
  </View>
});

type FormValues = {
  name: string,
  email: string,
  password: string,
  confirm: string
}
type FormErrors = Record<keyof FormValues, string>;

const fakeRegister = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Server error'));
    }, 4000);
  });
};

export default function App() {


  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    password: '',
    confirm: ''
  })

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    password: '',
    confirm: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isLoading, setLoading] = useState(false)

  const [avatar, setAvatar] = useState<string | null>(null);

  const nameRef = useRef<ComponentRef<typeof TextInput>>(null);
  const emailRef = useRef<ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const confirmRef = useRef<ComponentRef<typeof TextInput>>(null);

  const [visited, setVisited] = useState<Record<keyof FormValues, boolean>>({
    name: false,
    email: false,
    password: false,
    confirm: false
  })

  const updateField = (field: keyof FormValues, text: string) => {
    setValues((prevs) => ({
      ...prevs,
      [field]: text
    }))

    const error = getFieldError(field, text);
    setErrors(prev => ({
      ...prev,
      [field]: error,
      ...(field === 'password'
        ? {
          confirm:
            values.confirm === text
              ? ''
              : 'Passwords do not match',
        }
        : {}),

    }));
  }
  const updateError = (field: keyof FormValues, text: string) => {
    setErrors((prevs) => ({
      ...prevs,
      [field]: text
    }))
  }
  function getFieldError(
    field: keyof FormValues,
    text: string,
  ): string {
    switch (field) {
      case 'name':
        if (text.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        return '';

      case 'email':
        if (!text.includes('@')) {
          return 'Invalid email';
        }
        return '';

      case 'password':
        if (text.length < 8) {
          return 'Password must be at least 8 characters';
        }
        return '';

      case 'confirm':
        if (text !== values.password) {
          return 'Passwords do not match';
        }
        return '';
    }
  }
  const validateForm = () => {
    const newErrors: FormErrors = {
      name: '',
      email: '',
      password: '',
      confirm: '',
    };

    if (values.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!values.email.includes('@')) {
      newErrors.email = 'Invalid email';
    }

    if (values.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    if (values.confirm !== values.password) {
      newErrors.confirm = 'Passwords do not match';
    }

    setErrors(newErrors);

    return newErrors;
  };

  const validateField = (field: keyof FormValues) => {
    switch (field) {
      case 'name':
        if (values.name.trim().length < 2) {
          updateError('name', 'Name must be at least 2 characters');
        } else {
          updateError('name', '');
        }
        break;

      case 'email':
        if (!values.email.includes('@')) {
          updateError('email', 'Invalid email');
        } else {
          updateError('email', '');
        }
        break;

      case 'password':
        if (values.password.length < 4) {
          updateError('password', 'Password must be at least 4 characters');
        } else {
          updateError('password', '');
        }
        break;

      case 'confirm':
        if (values.confirm !== values.password) {
          updateError('confirm', 'Passwords do not match');
        } else {
          updateError('confirm', '');
        }
        break;
    }
  };

  const focusFirstError = (formErrors: FormErrors) => {

    if (formErrors.name !== '') {
      nameRef.current?.focus()
      return
    }

    if (formErrors.email !== '') {
      emailRef.current?.focus()
      return
    }

    if (formErrors.password !== '') {
      passwordRef.current?.focus()
      return
    }

    if (formErrors.confirm !== '') {
      confirmRef.current?.focus()
      return
    }

  }


  const handleSubmit = async () => {
    if (isLoading) return;
    const formErrors = validateForm();

    const hasError = Object.values(formErrors).some(
      (error) => error !== ''
    );

    if (hasError) {
      focusFirstError(formErrors)
    }
    if (!acceptedTerms) {
      setSubmitError('You must accept terms');
    }

    if (hasError || !acceptedTerms) {
      return;
    }

    setSubmitError('');
    setLoading(true)
    try {
      await fakeRegister();
      Alert.alert('Success', 'Registration completed successfully');
    } catch (error) {
      setSubmitError('Registration failed. Please try again.');
    } finally {
      setLoading(false)
    }


  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create account</Text>
        <AvatarPicker
          avatar={avatar}
          onChange={setAvatar}
        />
        <FormField
          label='Full name'
          ref={nameRef}
          error={visited.name ? errors.name : ''}
          value={values.name}
          placeholder='Enter your name'
          onChangeText={(text) => {
            updateField('name', text)

          }}
          onBlur={() => {
            setVisited(prev => ({
              ...prev,
              name: true,
            }));
            validateField('name')
          }}
          autoCapitalize='words'
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />




        <FormField
          label='Email'
          error={visited.email ? errors.email : ''}
          style={styles.input}
          placeholder="Enter your email"
          value={values.email}
          ref={emailRef}
          onChangeText={(text) => {
            updateField('email', text)
          }}
          keyboardType='email-address'
          autoCapitalize='none'
          onBlur={() => {
            setVisited(prev => ({
              ...prev,
              email: true,
            }));
            validateField('email')
          }}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />


        <FormField
          error={visited.password ? errors.password : ''}
          label='Password'
          style={styles.input}
          ref={passwordRef}
          placeholder="Enter your password"
          value={values.password}
          onChangeText={(text) => {
            updateField('password', text)
          }}
          onBlur={() => {
            setVisited(prev => ({
              ...prev,
              password: true,
            }));
            validateField('password')
          }}
          secureTextEntry={!showPassword}
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
        >
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Text>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>

        </FormField>

        <FormField
          label='Confirm password'
          error={visited.confirm ? errors.confirm : ''}
          ref={confirmRef}
          style={styles.input}
          placeholder="Confirm your password"
          value={values.confirm}
          onChangeText={(text) => {
            updateField('confirm', text)
          }}
          secureTextEntry={!showPassword}
          onBlur={() => {
            setVisited(prev => ({
              ...prev,
              confirm: true,
            }));
            validateField('confirm')
          }}
          returnKeyType="done"
          onSubmitEditing={() => confirmRef.current?.blur()}
        />


        <View style={styles.switchRow}>
          <Switch value={acceptedTerms} onValueChange={(value) => {
            setAcceptedTerms(value);

            if (value) {
              setSubmitError('');
            }
          }}
          />
          <Text style={styles.switchLabel}>I agree to the terms and conditions</Text>
        </View>

        {submitError !== '' && <Text style={styles.error}>{submitError}</Text>}

        <TouchableOpacity style={[styles.button, isLoading && styles.submitDisabled]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007aff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  // input: { flex: 1, paddingVertical: 14, fontSize: 16 },
  showText: { color: '#007aff', fontWeight: '600', marginLeft: 12 },
  error: { color: '#ff3b30', fontSize: 13, marginTop: 6 },
  switchRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 16,
    gap: 8,
  },
  switchLabel: { marginLeft: 12, fontSize: 16, flex: 1 },
  submit: { backgroundColor: '#007aff', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: 'white', fontSize: 17, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginTop: 5
  },
  actionContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  inputFocused: {
    borderColor: 'blue',
  },

  inputError: {
    borderColor: 'red',
  },
});

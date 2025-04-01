import React, { useState, useContext } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { AuthContext } from '../contexts/AuthContext';
import { staticIpAddr } from '../statics/StaticConsts'

interface valueSet {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const SignUp = () => {
  const { setToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const signUpSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too short!').required('First name is required'),
    lastName: Yup.string().min(2, 'Too short!').required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string()
      .matches(/^\d{10,15}$/, 'Invalid phone number')
      .required('Phone number is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Must include a lowercase letter')
      .matches(/[A-Z]/, 'Must include an uppercase letter')
      .matches(/[0-9]/, 'Must include a number')
      .matches(/[@$!%*?&#]/, 'Must include a special character')
      .required('Password is required'),
  });

  const handleSignUp = async (values: valueSet) => {
    setLoading(true);
    setServerError('');
    try {
      const response = await fetch('http://' + staticIpAddr + ':5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      if (response.ok && data.token) {
        await SecureStore.setItemAsync('token', data.token);
        setToken(data.token);
        router.push('/home');
      } else {
        setServerError(data.msg || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setServerError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '', phoneNumber: '', password: '' }}
        validationSchema={signUpSchema}
        onSubmit={(values) => handleSignUp(values)}
      >
        {({ handleChange, handleBlur, setFieldValue, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
            />
            {touched.firstName && errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}
            
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              value={values.lastName}
            />
            {touched.lastName && errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={(e) => { setFieldValue('email', e.toLowerCase()); handleChange('email'); }}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              value={values.phoneNumber}
            />
            {touched.phoneNumber && errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber}</Text>}
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
            
            {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
            
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  error: { color: 'red', marginBottom: 10 },
});

export default SignUp;

import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import { AuthContext } from '../contexts/AuthContext';
import { staticIpAddr } from '../statics/StaticConsts'

const signInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function SignIn() {
  const router = useRouter();
  const { setToken } = useContext(AuthContext);
  const [serverError, setServerError] = useState('');

  const handleSignIn = async (values) => {
    try {
      const response = await fetch('http://' + staticIpAddr + ':5000/api/users/signin', {
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
        console.log(data.msg || 'Sign in failed');
        setServerError(data.msg || 'Sign in failed');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      setServerError('Error during sign in:', error)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Formik initialValues={{ email: '', password: '' }} validationSchema={signInSchema} onSubmit={handleSignIn}>
        {({ handleChange, setFieldValue, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput style={styles.input} placeholder="Email" onChangeText={(e) => { setFieldValue('email', e.toLowerCase()); handleChange('email'); }} onBlur={handleBlur('email')} value={values.email} keyboardType="email-address" />
            {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} />
            {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}

            {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: 300, height: 40, padding: 10, borderWidth: 1, borderColor: '#ccc', marginVertical: 10, borderRadius: 5, backgroundColor: '#fff' },
  error: { color: 'red', fontSize: 12 },
  button: { backgroundColor: '#007aff', padding: 12, borderRadius: 8, width: 300, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

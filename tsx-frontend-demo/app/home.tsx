import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

interface JwtProp {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
}

export default function Home() {
  const router = useRouter();
  const { token, setToken } = useContext(AuthContext);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenFromStorage = await SecureStore.getItemAsync('token');
        if (tokenFromStorage) {
          setToken(tokenFromStorage);
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, [setToken]);

  useEffect(() => {
    if (loading) return;

    if (!token) {
      router.replace('/signin');
      return;
    }

    try {
      const decoded: JwtProp = jwtDecode(token);
      setUserName(decoded?.firstName ?? 'User');
    } catch (error) {
      console.error('Invalid token:', error);
      SecureStore.deleteItemAsync('token'); 
      setToken('');
      router.replace('/signin');
    }
  }, [token, loading]);

  // Section E stopped here 

  const handleSignOut = async () => {
    await SecureStore.deleteItemAsync('token');
    setToken('');
    router.replace('/signin');
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {userName}!</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  button: {
    backgroundColor: '#FF0000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

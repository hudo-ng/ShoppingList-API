import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext'; // adjust import path

export default function Layout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_CREDENTIALS_KEY = '@admin_credentials';

export default function AdminLogin({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [storedCredentials, setStoredCredentials] = useState(null);

  useEffect(() => {
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = async () => {
    try {
      const stored = await AsyncStorage.getItem(ADMIN_CREDENTIALS_KEY);
      if (stored) {
        setStoredCredentials(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  const handleLogin = () => {
    console.log('Login attempt:', { username, password });
    
    // Trim whitespace and convert to lowercase for username
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();
    
    console.log('Trimmed values:', { trimmedUsername, trimmedPassword });
    
    // Default credentials
    const defaultCredentials = [
      { username: 'admin', password: 'admin123' },
      { username: 'admin', password: '188JALALIYYA188' },
      { username: 'jalaliyya', password: 'admin123' }
    ];
    
    // Check stored credentials first, then default ones
    const allCredentials = storedCredentials 
      ? [storedCredentials, ...defaultCredentials]
      : defaultCredentials;
    
    const isValid = allCredentials.some(cred => 
      trimmedUsername === cred.username.toLowerCase() && trimmedPassword === cred.password
    );
    
    if (isValid) {
      console.log('Login successful!');
      navigation.replace('AdminDashboard');
    } else {
      console.log('Login failed!');
      Alert.alert(
        'Invalid Credentials',
        'Please check your username and password.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Admin Access</Text>
        <Text style={styles.subtitle}>Sign in to manage PDFs</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Return to App</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F3',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B1933',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  loginButton: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    color: '#666',
    fontSize: 16,
  }
});

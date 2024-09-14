import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { supabase } from '@/services/supaBaseConfig';

const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleRegister = async () => {
    if (username === '' || email === '' || password === '' || confirmPassword === '') {
      showSnackbar('Please fill out all fields.');
    } else if (password !== confirmPassword) {
      showSnackbar('Passwords do not match.');
    } else {
      // Check if passwords match
      if (password !== confirmPassword) {
        showSnackbar('Passwords do not match');
        return;
      }

      // Clear any previous errors

      try {
        // Register the user with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        // Handle successful registration (e.g., navigate to login screen)
        Alert.alert('Success', 'Registration successful! ');
        router.push('/(auth)/login');
      } catch (error: any) {
        showSnackbar(error.message);
      }
      showSnackbar('Registered successfully!');
      // Handle registration logic here
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View >
        <LottieView
          source={require('../animation/register.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
      <Text style={styles.title}>Register</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-check" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Button
          mode="text"
          onPress={() => router.push('/(auth)/login')}
          uppercase={false}
          labelStyle={styles.signInButton}
        >
          Sign In
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Close',
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    marginBottom: 10,
    color: '#333',
  },
  signInButton: {
    color: '#007bff',
  },
});

export default RegisterScreen;

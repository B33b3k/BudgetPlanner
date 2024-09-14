import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { supabase } from '@/services/supaBaseConfig';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    checkStoredCredentials();
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const checkStoredCredentials = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedPassword = await AsyncStorage.getItem('password');
      if (storedUsername && storedPassword) {
        setUsername(storedUsername);
        setPassword(storedPassword);
        // router.replace('/login');
      }
    } catch (error) {
      showSnackbar('Failed to load credentials.');
      console.error(error);
    }
  };

  const handleLogin = async () => {
    if (username === '' || password === '') {
      showSnackbar('Please enter both username and password.');
    } else {
      try {

        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password,
        });


        if (data && !error) {


          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('password', password);
          showSnackbar('Logged in successfully!');
          router.replace('/(tabs)/');
        }
        else {
          showSnackbar('Failed to login.');
        }

      } catch (error) {
        showSnackbar('Failed to save credentials.');
        console.error(error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.animationContainer}>
        <Text style={styles.title}>Login</Text>
        <LottieView
          source={require('../animation/login.json')}
          style={{ width: '100%', height: 300 }}
          autoPlay
          loop

        />
      </View>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Button
          mode="text"
          onPress={() => router.push('/(auth)/register')}
          uppercase={false}
          labelStyle={styles.signInButton}
        >
          Sign Up
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
  animationContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    //professional
    fontSize: 40,
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

export default LoginScreen;

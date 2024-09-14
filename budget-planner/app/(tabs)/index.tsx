import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { supabase } from '../../services/supaBaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Link } from '@react-navigation/native';
import CategoryList from '@/CategoryList';

const HomeScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('Unknown');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const router = useRouter();

  const getUserInfo = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/login');
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user info:', error.message);
      router.replace('/login');
      return;
    }

    setUsername(user?.email ?? 'Unknown');
  };

  useEffect(() => {
    const initialize = async () => {
      console.log('Initializing app...');
      try {

        await getUserInfo();
      } catch (e) {
        console.warn(e);
      } finally {
        console.log('Initialization complete.');


      }
    };

    initialize();
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Avatar.Icon size={40} icon="account-circle" style={styles.avatar} />
        <Text style={styles.welcomeText}>Welcome, {username}</Text>
      </View>

      <CategoryList />

      <View style={styles.addButtonContainer}>
        <Link to={'/AddCategory'}>
          <Ionicons name='add-circle' size={60} color='green' />
        </Link>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: '#f2f2f2',
  },
  appBar: {
    borderRadius: 20,
    borderBottomColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    marginTop: 20,
    backgroundColor: 'green',
    marginLeft: 10,
    padding: 5,
  },
  welcomeText: {
    marginLeft: 10,
    marginTop: 20,
    color: 'black',
    fontSize: 20,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: '200',
    padding: 10,
    fontFamily: 'Lato-Bold',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  snackbar: {
    backgroundColor: '#333',
  },
});

export default HomeScreen;

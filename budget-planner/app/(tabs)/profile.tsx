import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import { supabase } from '@/services/supaBaseConfig'; // Adjust the import path as necessary
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface UserMetadata {
    full_name?: string;
    profile_picture?: string;
    about_me?: string;
    phone?: string;
    address?: string;
}

interface User {
    id: string;
    email?: string;
    user_metadata: UserMetadata;
}

const ProfileScreen: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) throw error;

                setUser(data.user as User); // Type assertion to User interface
            } catch (error: any) {
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            //remove data from async storage
            await AsyncStorage.removeItem('username');
            await AsyncStorage.removeItem('password');
            router.replace('/login');
        } catch (error: any) {
            console.error('Error during logout:', error.message);
        }
    };

    if (loading) {
        return <Text style={styles.loadingText}>Loading...</Text>;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!user) {
        return <Text style={styles.errorText}>No user data available</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: user.user_metadata.profile_picture || `https://avatar.iran.liara.run/public/3${user.id[0]}` }} // Replace with a default profile picture URL
                    style={styles.profilePicture}
                />
                <Text style={styles.name}>{user.user_metadata.full_name || ''}</Text>
                <Text style={styles.email}>{user.email || 'john.doe@example.com'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About Me</Text>
                <Text style={styles.sectionContent}>
                    {user.user_metadata.about_me || 'Budget planner user with a passion for saving money.'}

                </Text>
            </View>

            {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <Text style={styles.contactItem}>Phone: {user.user_metadata.phone || '(123) 456-7890'}</Text>
                <Text style={styles.contactItem}>Address: {user.user_metadata.address || '123 Main Street, City, Country'}</Text>
            </View> */}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Edit Profile</Text>
                    <IconButton icon="chevron-right" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Change Password</Text>
                    <IconButton icon="chevron-right" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Privacy Settings</Text>
                    <IconButton icon="chevron-right" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
            >
                <Text style={styles.logoutText}>Loogout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    sectionContent: {
        fontSize: 16,
        color: '#666',
    },
    contactItem: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        marginTop: 30,
        backgroundColor: '#ff5252',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 50,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 20,
        color: 'red',
        marginTop: 50,
    },
});

export default ProfileScreen;

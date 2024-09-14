import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/services/supaBaseConfig';
import Snackbar from '@/components/snackBar'; // Ensure this component is correctly imported
import { useLocalSearchParams, useRouter } from 'expo-router';
import { decode } from 'base64-arraybuffer';


const AddCategoryItem: React.FC<any> = () => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [cost, setCost] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const params: { [key: string]: any } = useLocalSearchParams();
    const navigation = useRouter();
    const [categoryId, setCategoryId] = useState(null);

    useEffect(() => {
        const categoryObject = JSON.parse(params['category']);
        const categoryId = categoryObject?.id;
        setCategoryId(categoryId);
    }, [params]);







    // Request permissions for accessing the camera and photo library
    const requestPermissions = async () => {
        try {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
                Alert.alert('Permission Required', 'We need camera and photo library permissions to proceed.');
            }
        } catch (err) {
            Alert.alert('Permission Error', 'An error occurred while requesting permissions.');
        }
    };

    // Convert image to Base64
    const uriToBase64 = async (uri: string) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const reader = new FileReader();

            return new Promise<string>((resolve, reject) => {
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (err: any) {
            console.log('Error converting image to Base64:', err.message);
            throw new Error('Failed to convert image to Base64');
        }
    };

    const uploadImage = async (uri: string, name: string) => {
        try {
            const base64 = await uriToBase64(uri);
            const base64Data = base64.split(',')[1]; // Get only the Base64 data, not the metadata

            const { data, error } = await supabase.storage.from('YoJana').upload(name, decode(base64Data), {
                contentType: 'image/jpeg',
                cacheControl: '3600', // Cache control setting
                upsert: true, // Optionally overwrite if exists
            });

            if (error) throw new Error(error.message);

            return data.path;
        } catch (err: any) {
            console.log('Error uploading image:', err.message);
            throw new Error(`Image upload failed: ${err.message}`);
        }
    };

    // Pick an image from the gallery
    const pickImage = async () => {
        await requestPermissions(); // Ensure permissions are granted

        try {
            const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0]?.uri || null);
            }
        } catch (err) {
            Alert.alert('Image Picker Error', 'An error occurred while picking an image.');
        }
    };

    const addItem = async () => {


        console.log('params:', categoryId);
        if (!name || !cost || !imageUri) {
            setError('All fields are required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const imagePath = await uploadImage(imageUri, `${name}-${Date.now()}.jpg`);
            const finalUrl = 'https://vvofzbnnqtsfmfkdnohy.supabase.co/storage/v1/object/public/YoJana/' + imagePath;

            // Add new item to CategoryItems table
            const { error: insertError } = await supabase
                .from('CategoryItems')
                .insert({
                    name,
                    note,
                    cost: parseFloat(cost),
                    url: finalUrl,
                    category_id: categoryId
                });

            if (insertError) throw new Error(insertError.message);

            Snackbar({ message: "Item added successfully" });
            navigation.back();

        } catch (err: any) {
            setError(`Failed to add item: ${err.message}`);
            Snackbar({ message: `Error: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add New Category Item</Text>
            <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Note (optional)"
                value={note}
                onChangeText={setNote}
            />
            <TextInput
                style={styles.input}
                placeholder="Cost"
                value={cost}
                onChangeText={setCost}
                keyboardType="numeric"
            />
            <View style={styles.imageContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <Button title="Pick an Image" onPress={pickImage} />
                )}
            </View>

            <Button title="Add Item" onPress={addItem} disabled={loading} />
            {error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f2f2f2',
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        fontSize: 18,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        height: 200,
        backgroundColor: '#eee',
        borderRadius: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default AddCategoryItem;

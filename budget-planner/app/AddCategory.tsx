import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { supabase } from '@/services/supaBaseConfig';
import Snackbar from '@/components/snackBar';
import { getData } from '@/services/services';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const predefinedColors = [
    '#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F6', '#F6FF33',
    '#33F3FF', '#F333FF', '#FF8C33', '#33FF8C', '#8C33FF', '#FF3333'
];

const ColorOption: React.FC<{ color: string, onSelect: (color: string) => void }> = React.memo(({ color, onSelect }) => (
    <TouchableOpacity
        style={[styles.colorOption, { backgroundColor: color }]}
        onPress={() => onSelect(color)}
    />
));

const AddCategory: React.FC<{ onAddCategory: (category: any) => void }> = ({ onAddCategory }) => {
    const [categoryName, setCategoryName] = useState<string>('');
    const [categoryColor, setCategoryColor] = useState<string>('#FFFFFF');
    const [categoryIcon, setCategoryIcon] = useState<string>('');
    const [assignedBudget, setAssignedBudget] = useState<string>('');
    const [isEmojiSelectorVisible, setEmojiSelectorVisible] = useState<boolean>(false);

    const handleAddCategory = async () => {
        if (categoryName.trim() && assignedBudget.trim()) {
            const category = {
                name: categoryName,
                color: categoryColor,
                icon: categoryIcon,
                assigned_budget: parseFloat(assignedBudget),
            };
            const { data, error } = await supabase.from('Category').insert([{
                name: categoryName,
                color: categoryColor,
                icon: categoryIcon,
                assigned_budget: parseFloat(assignedBudget),
                created_by: await AsyncStorage.getItem('username')
            }]).select('*');

            if (data) {
                console.log('Category added:', data);
                router.replace('/(tabs)/');
            }
            if (error) {
                console.error('Error adding category:', error.message);
                Snackbar({ message: "Error adding category" });
            } else {
                Snackbar({ message: "Category added successfully" });
                onAddCategory(category);
                setCategoryName('');
                setCategoryColor('#FFFFFF');
                setCategoryIcon('');
                setAssignedBudget('');
            }
        } else {
            Snackbar({ message: "Please fill all fields" });
        }
    };

    const handleEmojiSelect = useCallback((emoji: string) => {
        setCategoryIcon(emoji);
        setEmojiSelectorVisible(false);
    }, []);

    const renderColorOption: ListRenderItem<string> = ({ item }) => (
        <ColorOption color={item} onSelect={setCategoryColor} />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Category</Text>

            <View style={styles.previewContainer}>
                <View style={[styles.previewButton, { backgroundColor: categoryColor }]}>
                    <Text style={styles.previewEmoji}>{categoryIcon || '📁'}</Text>
                    <Text style={styles.previewText}>{categoryName || 'No Name'}</Text>
                </View>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Enter category name"
                value={categoryName}
                onChangeText={setCategoryName}
            />
            <Text style={styles.colorText}>Choose Color</Text>

            <FlatList
                data={predefinedColors}
                keyExtractor={(item) => item}
                renderItem={renderColorOption}
                contentContainerStyle={styles.colorPickerContainer}
                horizontal={true} // Enable horizontal scrolling
                scrollEnabled={true}
                numColumns={1}
                showsHorizontalScrollIndicator={false} // Optionally hide the horizontal scroll indicator
            />

            <TouchableOpacity style={styles.emojiButton} onPress={() => setEmojiSelectorVisible(true)}>
                <Text style={styles.emojiText}>{categoryIcon || 'Choose Icon'}</Text>
            </TouchableOpacity>
            <View style={{ height: 180 }} >


                {isEmojiSelectorVisible && (
                    <EmojiSelector
                        onEmojiSelected={handleEmojiSelect}
                        showSearchBar={false}
                        showSectionTitles={false}
                        showTabs={false}




                    />
                )}
            </View>




            <TextInput
                style={styles.input}
                placeholder="Enter assigned budget"
                keyboardType="numeric"
                value={assignedBudget}
                onChangeText={setAssignedBudget}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                <MaterialCommunityIcons name="check" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Add Category</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    previewContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    previewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: '#DDD',
        borderWidth: 1,
        backgroundColor: '#FFF',
    },
    previewText: {
        color: '#333',
        fontSize: 18,
        marginLeft: 10,
    },
    previewEmoji: {
        fontSize: 24,
    },
    colorText: {
        color: '#333',
        fontSize: 16,
        marginVertical: 10,
    },
    colorPickerContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 5,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#FFF',
    },
    emojiButton: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#FFF',

    },
    emojiText: {
        color: '#333',
        fontSize: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#007BFF',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        marginLeft: 10,
    },
});

export default AddCategory;

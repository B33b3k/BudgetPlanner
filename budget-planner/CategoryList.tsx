import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '@/services/supaBaseConfig';
import { useRouter } from 'expo-router';
import CirculatChart from './components/CirculatChart';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CategoryItem = {
    id: number;
    item_name: string;
    item_description: string;
    item_value: number;
};

type Category = {
    id: number;
    name: string;
    color: string;
    icon: string;
    assigned_budget: number;
    item_count: number;
    CategoryItems: CategoryItem[];
};

type CategoryListProps = {
    onSelectCategory?: (category: Category) => void;
};

const CategoryList: React.FC<CategoryListProps> = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const router = useRouter();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('Category')
                .select('*, CategoryItems(*)')
                .eq('created_by', await AsyncStorage.getItem('username'));
            if (error) {
                throw error;
            }
            setCategories(data ?? []);
            console.log('Categories:', data);
        } catch (error) {
            setError('Error fetching categories');
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        console.log(categories)
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchCategories();
    }, []);

    const onSelectCategory = (category: Category) => {
        // Navigate to CategoryDetail screen and pass category data
        router.push({
            pathname: `/categoryDetail`,
            params: {
                category: JSON.stringify(category),
            },
        });
    };

    const renderItem: ListRenderItem<Category> = ({ item }) => (
        <>

            <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => onSelectCategory(item)}
            >
                <View style={[styles.iconContainer, { backgroundColor: item.color || '#ffffff' }]}>
                    <Text style={styles.categoryIcon}>{item.icon || '📁'}</Text>
                </View>
                <View style={styles.categoryDetails}>
                    <Text style={styles.categoryName}>{item.name}</Text>
                    <Text style={styles.categoryCount}>{item.CategoryItems.length} items</Text>
                </View>
                <View style={styles.categoryCostContainer}>
                    <Text style={styles.categoryBudget}>$ {item.assigned_budget}</Text>
                </View>
            </TouchableOpacity>
        </>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <>
            <CirculatChart categories={categories} />
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()} // Use ID for unique keys
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007BFF']}
                    />
                }
            />
        </>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 10,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginBottom: 12,
        borderColor: '#E0E0E0',
        borderWidth: 1,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        backgroundColor: '#ffffff',
    },
    categoryIcon: {
        fontSize: 28,
        color: '#333',
    },
    categoryDetails: {
        flex: 1,
    },
    categoryName: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
    },
    categoryCount: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    categoryCostContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    categoryBudget: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default CategoryList;

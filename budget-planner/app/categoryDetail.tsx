import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert, Image } from 'react-native';
import { IconButton, ProgressBar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/services/supaBaseConfig';
import Snackbar from '../components/snackBar';

const screenWidth = Dimensions.get('window').width;

type CategoryItem = {
  id: number;
  name: string;
  note: string;
  cost: number;
  url: string;
  color: string;
};

type Category = {
  id: number;
  name: string;
  icon: string;
  color: string;
  assigned_budget: number;
  CategoryItems: CategoryItem[];
};

const CategoryDetail: React.FC = () => {
  const { category } = useLocalSearchParams();
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useRouter();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);

      if (category) {
        try {
          const parsedCategory = JSON.parse(category as string);
          setCategoryData(parsedCategory);
        } catch (err) {
          setError('Failed to parse category data');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [category]);

  const handleDeleteItem = async (itemId: number) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const { data, error } = await supabase.from('CategoryItems').delete().eq('id', itemId);
            if (!error) {

              Snackbar({ message: 'Item deleted successfully' });

              setCategoryData((prevData) => {
                if (!prevData) return null;
                const updatedItems = prevData.CategoryItems.filter((item) => item.id !== itemId);
                return { ...prevData, CategoryItems: updatedItems };
              });
            }
          } catch (err: any) {
            console.error('Unexpected error deleting item:', err.message);
          }
        },
      },
    ]);
  };

  const handleDeleteCategory = async () => {
    Alert.alert('Delete Category', 'Are you sure you want to delete this category?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const { data, error } = await supabase.from('Category').delete().eq('id', categoryData?.id);
            // if (error) {
            //   console.error('Error deleting category:', error.message);
            //   return;
            // }

            if (data) {
              Snackbar({ message: 'Category deleted successfully' });
              navigation.back();
            }
          } catch (err: any) {
            console.error('Unexpected error deleting category:', err.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!categoryData) {
    return <Text style={styles.noItemsText}>No category data available</Text>;
  }

  const { CategoryItems, assigned_budget, name, color, icon } = categoryData;
  const totalSpent = CategoryItems.reduce((acc, item) => acc + item.cost, 0);
  const remainingBudget = assigned_budget - totalSpent;
  const progress = totalSpent / assigned_budget;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Category Header */}
      <View style={[styles.categoryHeader, { backgroundColor: color }]}>
        <View style={styles.headerIconContainer}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
        </View>
        <Text style={styles.categoryName}>{name}</Text>
        <TouchableOpacity onPress={handleDeleteCategory} style={styles.deleteCategoryButton}>
          <IconButton icon="delete" size={24} />
        </TouchableOpacity>
      </View>

      {/* Budget Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Total Budget: ${assigned_budget}</Text>
        <ProgressBar progress={progress} color={color} style={styles.progressBar} />
        <Text style={{


          color: remainingBudget < 0 ? 'red' : 'green',
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'left',
          padding: 5,



        }}>$ {totalSpent}</Text>
      </View>

      <Text style={styles.itemListTitle}>Item List</Text>
      {CategoryItems.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <View style={[styles.itemIconContainer, { backgroundColor: item.color }]}>
            <Image
              source={{ uri: item.url }}
              style={styles.itemImage}
              onError={() => console.log('Failed to load image')}
              onLoad={() => console.log('Image loaded successfully')}
            />
          </View>
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.note ? <Text style={styles.itemNote}>{item.note}</Text> : null}
          </View>
          <Text style={styles.itemCost}>${item.cost}</Text>
          <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.deleteButton}>
            <IconButton icon="delete" size={24} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.push({
            pathname: '/add-new-category-item',
            params: { category: category },
          })
        }
      >
        <Text style={styles.addButtonText}>Add New Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  categoryHeader: {
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 30,
    color: '#000',
  },
  categoryName: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  deleteCategoryButton: {
    marginLeft: 'auto',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  itemIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemNote: {
    fontSize: 14,
    color: '#666',
  },
  itemCost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noItemsText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: 'red',
  },
});

export default CategoryDetail;

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';

import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';



export default function RootLayout() {
  // Load color scheme
  const colorScheme = useColorScheme();

  // Load fonts
  const [loaded] = useFonts({
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
    'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
  });

  // Show loading screen while loading fonts
  if (!loaded) {
    return null;
  }



  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
      <Stack

        screenOptions={{


          headerShown: false, // Apply globally to all screens by default
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            // Customize the header for specific screens if needed
            // This screen will have header hidden by default as set above
          }}
        />
        <Stack.Screen
          name="AddCategory"
          options={{
            headerShown: true, // Explicitly show header for this screen
            presentation: 'modal',
            headerTitle: 'Add New Category',
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#4CAF50' },
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            headerShown: false, // Explicitly hide header for this screen
          }}
        />
        <Stack.Screen
          name="categoryDetail"
          options={{
            headerShown: true,
            headerTitle: 'Category Detail',
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#4CAF50' },

          }}
        />
        <Stack.Screen
          name="add-new-category-item"
          options={{
            headerShown: true,
            headerTitle: 'Category Item Detail',
            headerTintColor: 'white',
            headerStyle: { backgroundColor: '#4CAF50' },

          }}
        />
      </Stack>

    </ThemeProvider>
  );
}

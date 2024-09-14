// // SplashScreen.tsx
// import React, { useEffect } from 'react';
// import { StyleSheet, View, Text, StatusBar } from 'react-native';
// import LottieView from 'lottie-react-native';

// const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
//   useEffect(() => {
//     if (!onFinish) {
//       return;
//     }
//     const timer = setTimeout(() => {
//       onFinish(); // Call the onFinish callback after 3 seconds
//     }, 3000); // Adjust the duration as needed

//     return () => clearTimeout(timer); // Clean up on unmount
//   }, [onFinish]);

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
//       <LottieView
//         source={require('./animation/register.json')} // Path to your Lottie animation
//         autoPlay
//         loop
//         style={styles.animation}
//       />
//       <Text style={styles.title}>Budget Tracker</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#004d40', // Background color
//   },
//   animation: {
//     width: 200,
//     height: 200,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#ffffff', // Title color
//     marginTop: 20,
//   },
// });

// export default SplashScreen;

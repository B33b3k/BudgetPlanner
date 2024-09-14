import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SnackbarProps {
    message: string;
    duration?: number;
    onClose?: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsVisible(false);
            if (onClose) {
                onClose();
            }
        }, duration);

        return () => clearTimeout(timeoutId);
    }, [duration, onClose]);

    return (
        <View style={[styles.snackbarContainer, isVisible ? { opacity: 1 } : { opacity: 0 }]}>
            <Text style={styles.snackbarText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    snackbarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    snackbarText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Snackbar;
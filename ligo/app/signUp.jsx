import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
    const [Firstname, setFirstName] = useState('');
    const [Lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/music')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#A0A0A0"
                value={Firstname}
                onChangeText={setFirstName}
            />

            <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#A0A0A0"
                value={Lastname}
                onChangeText={setLastName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                value={ConfirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.switchText}>
                Already have an account? <Link href="/signIn" style={styles.linkText}>Sign In</Link>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#061325',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#1c1c1e',
        borderStyle: 'solid',
        borderWidth: '1',
        borderColor: 'green',
        borderRadius: 20,
        padding: 10,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2EC4B6',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    switchText: {
        marginTop: 30,
        color: '#E0E0E0',
        fontSize: 14,
        textAlign: 'center',
    },
    linkText: {
        color: '#2EC4B6',
        textDecorationLine: 'underline',
    },
});

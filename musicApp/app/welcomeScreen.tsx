import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ligo.</Text>
      <Text style={styles.subtitle}>Entertainment is everything</Text>
      <Text style={styles.description}>Organic relationships in your pocket</Text>

      {/* Using Link to navigate to the "Music" page */}
      <Link href="/" style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Link>

      <Text style={styles.loginText}>
        Already have an account? <Link href="/" style={styles.loginLink}>Login here</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F29',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#29B6F6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    color: '#FFFFFF',
  },
  loginLink: {
    color: '#29B6F6',
    textDecorationLine: 'underline',
  },
});

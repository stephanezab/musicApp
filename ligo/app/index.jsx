import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <LinearGradient
      colors={['#000000', '#000000','#000000', '#1c6c4f', '#5ac18e']} // Adjusted gradient colors for a smooth blend
      style={styles.container}
    >
      {/* Logo Text */}
      <Text style={styles.logoText}>Ligo.</Text>

      {/* Title and Description */}
      <Text style={styles.title}>Entertainment is everything</Text>
      <Text style={styles.subtitle}>Organic relationships in your pocket</Text>

      {/* Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/spotifyAuth')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      {/* Login Text */}
      <Text style={styles.loginText}>
        Already have an account? <Link href="/signIn" style={styles.loginLink}>Login here</Link>
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoText: {
    fontSize: 64,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 50,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2EC4B6',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginText: {
    marginTop: 30,
    color: '#E0E0E0',
    fontSize: 14,
  },
  loginLink: {
    color: '#2EC4B6',
    textDecorationLine: 'underline',
  },
});

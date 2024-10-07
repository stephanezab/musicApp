import React from 'react';
import { Stack } from 'expo-router';

export default function StackLayout() {

  return (
    <Stack
    >
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="music" options={{ title: 'Music Page' }} />
    </Stack>
  );
}

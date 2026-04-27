import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';

export default function CounterScreen() {
  const [count, setCount] = useState(0);

  const increment = () => {
    Vibration.vibrate(50);
    setCount(c => c + 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tally Counter</Text>
      <TouchableOpacity style={styles.button} onPress={increment}>
        <Text style={styles.countText}>{count}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetButton} onPress={reset}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 40 },
  button: {
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#1976D2',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 40
  },
  countText: { fontSize: 48, color: 'white', fontWeight: 'bold' },
  resetButton: { padding: 15, backgroundColor: '#f44336', borderRadius: 8 },
  resetText: { color: 'white', fontSize: 18 }
});

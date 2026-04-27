import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Linking, TouchableOpacity } from 'react-native';

export default function PdfViewerScreen({ route, navigation }) {
  const { pdf } = route.params || {};

  useEffect(() => {
    if (pdf && pdf.url && Platform.OS === 'web') {
      // On web, just open the PDF in a new tab
      window.open(pdf.url, '_blank');
      navigation.goBack();
    } else if (pdf && pdf.url) {
      // On mobile, we can also use Linking to open the native PDF viewer
      Linking.openURL(pdf.url);
      navigation.goBack();
    }
  }, [pdf, navigation]);

  if (!pdf || !pdf.url) {
    return (
      <View style={styles.container}>
        <Text>Error: No PDF URL found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Opening PDF...</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { fontSize: 18, marginBottom: 20 },
  button: { padding: 15, backgroundColor: '#1976D2', borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

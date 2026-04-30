import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import { ThemeContext } from '../context/ThemeContext';
import { ArrowLeft } from 'lucide-react-native';
import { addRecentPDF } from '../services/localStorage';

export default function PdfViewerScreen({ route, navigation }) {
  const { pdf } = route.params || {};
  const { isCounterEnabled, theme } = useContext(ThemeContext);
  const [tallyCount, setTallyCount] = useState(0);

  if (!pdf || !pdf.url) {
    return (
      <View style={styles.container}>
        <Text>Error: No PDF URL found.</Text>
      </View>
    );
  }

  // Update navigation bar title with category name
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: pdf.category || 'PDF Viewer',
    });
  }, [navigation, pdf.category]);

  // Track this PDF as recently viewed
  React.useEffect(() => {
    const trackRecent = async () => {
      await addRecentPDF(pdf);
    };
    trackRecent();
  }, [pdf]);

  // Use Google Docs Viewer for Android/Web to display PDF, iOS can handle raw PDF url
  const pdfSource = Platform.OS === 'ios' 
    ? { uri: pdf.url } 
    : { uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdf.url)}` };

  // Inject JavaScript to optimize PDF display for mobile
  const injectedJavaScript = `
    (function() {
      // Force PDF to fit screen width
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes');
      document.getElementsByTagName('head')[0].appendChild(meta);
      
      // Style iframe to fit screen
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
      }
      
      // Style body for better mobile viewing
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';
      
      true; // Required for iOS
    })();
  `;

  const handleTally = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTallyCount(prev => prev + 1);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTallyCount(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.NAVY }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{pdf.title}</Text>
      </View>

      <WebView 
        source={pdfSource}
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsFullscreen={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        injectedJavaScript={injectedJavaScript}
        scalesPageToFit={Platform.OS === 'ios' ? false : true}
        originWhitelist={['*']}
        onNavigationStateChange={(navState) => {
          // Prevent navigation away from PDF
          if (navState.url !== pdfSource.uri) {
            return false;
          }
        }}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading PDF...</Text>
          </View>
        )}
      />

      {isCounterEnabled && (
        <View style={styles.counterOverlay}>
          <TouchableOpacity 
            style={[styles.tallyButton, { backgroundColor: theme.NAVY, shadowColor: theme.NAVY }]} 
            onPress={handleTally}
            activeOpacity={0.7}
          >
            <Text style={styles.tallyText}>{tallyCount}</Text>
            <Text style={styles.tallyLabel}>TAP</Text>
          </TouchableOpacity>
          
          {tallyCount > 0 && (
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'android' ? 20 : 15,
  },
  backBtn: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  counterOverlay: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    alignItems: 'center',
  },
  tallyButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  tallyText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  tallyLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: -2,
  },
  resetButton: {
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  resetText: {
    color: '#fff',
    fontSize: 12,
  }
});

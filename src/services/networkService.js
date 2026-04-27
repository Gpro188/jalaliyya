// Network Service - Handles internet connectivity checks
import NetInfo from '@react-native-community/netinfo';

/**
 * Check if device is currently connected to internet
 */
export const checkInternetConnection = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable !== false;
  } catch (error) {
    console.error('Error checking internet connection:', error);
    return false;
  }
};

/**
 * Add a listener for network state changes
 * Returns unsubscribe function
 */
export const addNetworkListener = (callback) => {
  const unsubscribe = NetInfo.addEventListener(state => {
    callback({
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type
    });
  });
  
  return unsubscribe;
};

/**
 * Get detailed network information
 */
export const getNetworkInfo = async () => {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type, // wifi, cellular, etc.
      isWifi: state.type === 'wifi',
      isCellular: state.type === 'cellular'
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return {
      isConnected: false,
      isInternetReachable: false,
      type: 'unknown',
      isWifi: false,
      isCellular: false
    };
  }
};

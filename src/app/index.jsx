
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

function H2OasisLogo() {
  return (
    <Svg width={88} height={88} viewBox="0 0 88 88">
      {/* Light circular outline */}
      <Circle
        cx="44"
        cy="44"
        r="38"
        stroke="#D7E2DC"
        strokeWidth="6"
        fill="none"
      />

      {/* Teal circular outline */}
      <Path
        d="M44 6 A38 38 0 1 1 12 24"
        stroke="#477C78"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Small water droplet */}
      <Circle
        cx="11"
        cy="25"
        r="5"
        fill="#28545A"
      />

      {/* Upper water wave */}
      <Path
        d="M25 39 Q36 27 47 39 T69 39"
        stroke="#28545A"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Lower water wave */}
      <Path
        d="M25 51 Q36 39 47 51 T69 51"
        stroke="#477C78"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('Splash screen loaded');

    const timer = setTimeout(() => {
      console.log('Navigating to Welcome');
      router.replace('/welcome');
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F3F6F1"
      />

      <View style={styles.content}>
        <H2OasisLogo />

        <Text style={styles.title}>H2oasis</Text>

        <Text style={styles.subtitle}>
          Your Hydration companion
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#28545A',
    marginTop: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#607572',
    marginTop: 8,
    letterSpacing: 0.4,
  },
});

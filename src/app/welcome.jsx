
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

function H2OasisLogo() {
  return (
    <Svg width={68} height={68} viewBox="0 0 88 88">
      <Circle
        cx="44"
        cy="44"
        r="38"
        stroke="#D7E2DC"
        strokeWidth="6"
        fill="none"
      />
      <Path
        d="M44 6 A38 38 0 1 1 12 24"
        stroke="#477C78"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx="11" cy="25" r="5" fill="#28545A" />
      <Path
        d="M25 39 Q36 27 47 39 T69 39"
        stroke="#28545A"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
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

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F3F6F1"
        translucent={false}
      />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.branding}>
            <H2OasisLogo />

            <Text style={styles.logoTitle}>H2oasis</Text>

            <Text style={styles.logoSubtitle}>
              Your Hydration companion
            </Text>
          </View>

          <View style={styles.introduction}>
            <Text style={styles.heading}>
              Find Your Flow.
            </Text>

            <Text style={styles.subheading}>
              Stay Hydrated. Feel Refreshed.
            </Text>

            <Text style={styles.description}>
              Make hydration a simple daily habit, track your
              drink and keep your Body Refreshed
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.startButton}
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.startButtonText}>
                Get Started  →
              </Text>
            </Pressable>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
              </Text>

              <Pressable
                onPress={() => router.replace('/login')}
                hitSlop={8}
              >
                <Text style={styles.loginLink}>Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F6F1',
  },

  container: {
    flex: 1,
    backgroundColor: '#F3F6F1',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 16,
  },

  branding: {
    alignItems: 'center',
  },

  logoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#28545A',
    marginTop: 18,
  },

  logoSubtitle: {
    fontSize: 13,
    color: '#607572',
    marginTop: 4,
  },

  introduction: {
    width: '100%',
    alignItems: 'center',
    marginTop: 100,
  },

  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#203A3A',
    textAlign: 'center',
  },

  subheading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#477C78',
    textAlign: 'center',
    marginTop: 5,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    color: '#607572',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 2,
  },

  actions: {
    width: '100%',
    marginTop: 45,
    paddingTop: 0,
    paddingBottom: 12,
  },

  startButton: {
    height: 48,
    backgroundColor: '#28545A',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#28545A',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },

  loginText: {
    fontSize: 12,
    color: '#607572',
  },

  loginLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#28545A',
  },
});

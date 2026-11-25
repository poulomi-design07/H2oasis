
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

function H2OasisLogo() {
  return (
    <Svg width={58} height={58} viewBox="0 0 88 88">
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

function OTPFields() {
  return (
    <View style={styles.otpRow}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <TextInput
          key={item}
          style={styles.otpInput}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
        />
      ))}
    </View>
  );
}

function PhoneOTPSection({
  phoneNumber,
  onPhoneChange,
  secondsRemaining,
  onSendOTP,
}) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  };

  return (
    <>
      <Text style={styles.fieldLabel}>
        Phone Number *
      </Text>

      <View style={styles.phoneRow}>
        <View style={styles.countryCode}>
          <Text style={styles.countryText}>IN  +91</Text>
        </View>

        <TextInput
          style={[styles.input, styles.phoneInput]}
          placeholder="9823456789"
          placeholderTextColor="#899B96"
          keyboardType="phone-pad"
          maxLength={10}
          value={phoneNumber}
          onChangeText={onPhoneChange}
        />

        <Pressable
          style={styles.otpButton}
          onPress={onSendOTP}
        >
          <Text style={styles.otpButtonText}>
            Send OTP
          </Text>
        </Pressable>
      </View>

      <View style={styles.otpHeading}>
        <Text style={styles.fieldLabel}>
          Enter 6-digit Code
        </Text>
      </View>

      <OTPFields />

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>
          {secondsRemaining > 0
            ? `◷ Resend code in ${formatTime(secondsRemaining)}`
            : '◷ You can request a new code'}
        </Text>

        <Pressable
          onPress={onSendOTP}
          disabled={secondsRemaining > 0}
        >
          <Text
            style={[
              styles.resendLink,
              secondsRemaining > 0 && styles.disabledResend,
            ]}
          >
            Resend
          </Text>
        </Pressable>
      </View>
    </>
  );
}

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const router = useRouter();

  // Manage the OTP countdown.
  useEffect(() => {
    if (secondsRemaining <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSecondsRemaining((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsRemaining]);

  // Start the 45-second countdown.
  const handleSendOTP = () => {
    setSecondsRemaining(45);

    // Actual OTP sending will be connected to the backend later.
  };

  // Reset the countdown when the phone number changes.
  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    setSecondsRemaining(0);
  };

  // Temporary frontend navigation.
  // Actual OTP verification will be connected by your partner.
  const handleVerificationSuccess = () => {
    router.push('/calibration');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
          translucent={false}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Branding */}
          <View style={styles.branding}>
            <H2OasisLogo />

            <Text style={styles.logoTitle}>
              H2<Text style={styles.smallO}>o</Text>asis
            </Text>

            <Text style={styles.logoSubtitle}>
              Your Hydration companion
            </Text>
          </View>

          {/* Login / Signup Toggle */}
          <View style={styles.toggleContainer}>
            <Pressable
              style={[
                styles.toggleButton,
                activeTab === 'login' && styles.activeToggle,
              ]}
              onPress={() => setActiveTab('login')}
            >
              <Text
                style={[
                  styles.toggleText,
                  activeTab === 'login' && styles.activeToggleText,
                ]}
              >
                Log In
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.toggleButton,
                activeTab === 'signup' && styles.activeToggle,
              ]}
              onPress={() => setActiveTab('signup')}
            >
              <Text
                style={[
                  styles.toggleText,
                  activeTab === 'signup' && styles.activeToggleText,
                ]}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                Welcome Back!
              </Text>

              <Text style={styles.formSubtitle}>
                Hydrate, refresh, and maintain your daily rhythm.
              </Text>

              <Text style={styles.fieldLabel}>
                Full Name *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#899B96"
              />

              <Text style={styles.fieldLabel}>
                Email Address
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#899B96"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <PhoneOTPSection
                phoneNumber={phoneNumber}
                onPhoneChange={handlePhoneChange}
                secondsRemaining={secondsRemaining}
                onSendOTP={handleSendOTP}
              />

              <Pressable
                style={styles.verifyButton}
                onPress={handleVerificationSuccess}
              >
                <Text style={styles.verifyButtonText}>
                  Verify & Log In  →
                </Text>
              </Pressable>
            </View>
          )}

          {/* SIGN UP FORM */}
          {activeTab === 'signup' && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                Create Your Account
              </Text>

              <Text style={styles.formSubtitle}>
                Start your journey towards better hydration.
              </Text>

              <PhoneOTPSection
                phoneNumber={phoneNumber}
                onPhoneChange={handlePhoneChange}
                secondsRemaining={secondsRemaining}
                onSendOTP={handleSendOTP}
              />

              <View style={styles.noPassword}>
                <Text style={styles.noPasswordIcon}>✓</Text>

                <Text style={styles.noPasswordText}>
                  No password needed! Your phone number
                  keeps your account secure.
                </Text>
              </View>

              <Pressable
                style={styles.verifyButton}
                onPress={handleVerificationSuccess}
              >
                <Text style={styles.verifyButtonText}>
                  Verify & Sign Up  →
                </Text>
              </Pressable>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our
            </Text>

            <View style={styles.footerLinks}>
              <Text style={styles.footerLink}>Terms of Service</Text>
              <Text style={styles.footerText}> and </Text>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: '#F3F6F1',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 75,
    paddingBottom: 120,
  },

  branding: {
    alignItems: 'center',
  },

  logoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#28545A',
    marginTop: 8,
  },

  smallO: {
    fontSize: 22,
  },

  logoSubtitle: {
    fontSize: 12,
    color: '#607572',
    marginTop: 3,
  },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAF1ED',
    borderRadius: 30,
    padding: 4,
    marginTop: 20,
    height: 44,
  },

  toggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },

  activeToggle: {
    backgroundColor: '#28545A',
  },

  toggleText: {
    fontSize: 13,
    color: '#607572',
  },

  activeToggleText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#203A3A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  formTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#203A3A',
  },

  formSubtitle: {
    fontSize: 11,
    color: '#607572',
    marginTop: 5,
    marginBottom: 12,
    lineHeight: 17,
  },

  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#28545A',
    marginBottom: 6,
    marginTop: 9,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#D7E2DC',
    borderRadius: 24,
    paddingHorizontal: 14,
    fontSize: 12,
    color: '#203A3A',
    backgroundColor: '#FFFFFF',
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  countryCode: {
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 24,
    backgroundColor: '#EAF1ED',
    justifyContent: 'center',
  },

  countryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#203A3A',
  },

  phoneInput: {
    flex: 1,
    paddingHorizontal: 10,
    minWidth: 0,
  },

  otpButton: {
    height: 44,
    paddingHorizontal: 11,
    borderRadius: 24,
    backgroundColor: '#B5E8E3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  otpButtonText: {
    fontSize: 10,
    color: '#28545A',
    fontWeight: '600',
  },

  otpHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 6,
  },

  otpInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#D7E2DC',
    borderRadius: 14,
    fontSize: 15,
    color: '#203A3A',
    backgroundColor: '#FFFFFF',
  },

  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 13,
  },

  resendText: {
    fontSize: 10,
    color: '#607572',
  },

  resendLink: {
    fontSize: 10,
    color: '#28545A',
    fontWeight: '700',
  },

  disabledResend: {
    color: '#AAB9B3',
  },

  noPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF1ED',
    borderRadius: 12,
    padding: 11,
    marginTop: 16,
  },

  noPasswordIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34765C',
    marginRight: 9,
  },

  noPasswordText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 16,
    color: '#607572',
  },

  verifyButton: {
    height: 47,
    backgroundColor: '#28545A',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    elevation: 3,
    shadowColor: '#28545A',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  verifyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  footer: {
    alignItems: 'center',
    marginTop: 20,
  },

  footerText: {
    fontSize: 10,
    color: '#607572',
  },

  footerLinks: {
    flexDirection: 'row',
    marginTop: 5,
  },

  footerLink: {
    fontSize: 10,
    color: '#28545A',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

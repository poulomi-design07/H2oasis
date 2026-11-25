
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#F3F6F1',
  white: '#FFFFFF',
  section: '#EAF1ED',
  border: '#D7E2DC',
  primary: '#28545A',
  accent: '#477C78',
  muted: '#607572',
  text: '#203A3A',
  lightText: '#82938D',
};

const hydrators = [
  { id: 'water', name: 'Water', icon: '💧' },
  { id: 'milk', name: 'Milk', icon: '🥛' },
  { id: 'tea', name: 'Tea', icon: '🍵' },
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'juice', name: 'Juice', icon: '🧃' },
  { id: 'coconut', name: 'Coconut Water', icon: '🥥' },
  { id: 'smoothie', name: 'Smoothie', icon: '🥤' },
  { id: 'other', name: 'Other', icon: '🍹' },
];

export default function CalibrationScreen() {
  const router = useRouter();

  // Receive account details from Login / Sign Up.
  const params = useLocalSearchParams();

  const getParamValue = (value) => {
    return Array.isArray(value) ? value[0] : value || '';
  };

  const fullName = getParamValue(params.fullName);
  const email = getParamValue(params.email);
  const phone = getParamValue(params.phone);

  const profileInitial = fullName.trim()
    ? fullName.trim().charAt(0).toUpperCase()
    : 'P';

  const [age, setAge] = useState(20);
  const [weightGroup, setWeightGroup] = useState('50–60 kg');

  const [selectedDrinks, setSelectedDrinks] = useState([
    'water',
    'tea',
    'milk',
  ]);

  const [preferredDrink, setPreferredDrink] = useState('water');
  const [goalType, setGoalType] = useState('smart');
  const [manualGoal, setManualGoal] = useState('2500');

  const toggleDrink = (id) => {
    setSelectedDrinks((current) => {
      if (current.includes(id)) {
        const updated = current.filter((drink) => drink !== id);

        if (preferredDrink === id) {
          setPreferredDrink(updated[0] || '');
        }

        return updated;
      }

      return [...current, id];
    });
  };

  const handleContinue = () => {
    if (selectedDrinks.length < 3) {
      Alert.alert(
        'Choose more drinks',
        'Please select at least 3 drinks that you consume frequently.'
      );
      return;
    }

    if (!preferredDrink) {
      Alert.alert(
        'Choose your preferred drink',
        'Please select your preferred hydrator.'
      );
      return;
    }

    const goal =
      goalType === 'smart'
        ? 2500
        : Number(manualGoal);

    if (!goal || goal < 500 || goal > 10000) {
      Alert.alert(
        'Invalid hydration goal',
        'Please enter a goal between 500 ml and 10,000 ml.'
      );
      return;
    }

    router.replace({
      pathname: '/dashboard',
      params: {
        fullName,
        email,
        phone,
      },
    });
  };

  const openProfile = () => {
    router.push({
      pathname: '/profile',
      params: {
        fullName,
        email,
        phone,
      },
    });
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.white}
        translucent={false}
      />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backArrow}>‹</Text>
            </Pressable>

            <Text style={styles.logoText}>
              H2<Text style={styles.logoO}>o</Text>asis
            </Text>

            <Pressable
              style={styles.avatar}
              onPress={openProfile}
            >
              <Text style={styles.avatarText}>
                {profileInitial}
              </Text>
            </Pressable>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>
            Personalize Your Hydration
          </Text>

          <Text style={styles.subtitle}>
            Let's understand your daily habits to create a hydration plan
            that feels right for you.
          </Text>

          {/* Your details */}
          <View style={styles.card}>
            <View style={styles.cardHeadingRow}>
              <View style={styles.headingIcon}>
                <Text style={styles.headingEmoji}>👤</Text>
              </View>

              <View>
                <Text style={styles.cardTitle}>Your Details</Text>
                <Text style={styles.cardSubtitle}>
                  A little about you
                </Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <Text style={styles.fieldLabel}>Full Name</Text>
            <Text style={styles.accountDetail}>
              {fullName || 'Not provided'}
            </Text>

            <View style={styles.detailDivider} />

            <Text style={styles.fieldLabel}>Email Address</Text>
            <Text style={styles.accountDetail}>
              {email || 'Not provided'}
            </Text>

            <View style={styles.detailDivider} />

            <Text style={styles.fieldLabel}>Phone Number</Text>
            <Text style={styles.accountDetail}>
              {phone || 'Not provided'}
            </Text>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View>
                <Text style={styles.fieldLabel}>Your Age</Text>
                <Text style={styles.fieldHint}>
                  Helps us personalize your goal
                </Text>
              </View>

              <View style={styles.counter}>
                <Pressable
                  style={styles.counterButton}
                  onPress={() =>
                    setAge((value) => Math.max(13, value - 1))
                  }
                >
                  <Text style={styles.counterSymbol}>−</Text>
                </Pressable>

                <Text style={styles.ageValue}>{age}</Text>

                <Pressable
                  style={styles.counterButton}
                  onPress={() =>
                    setAge((value) => Math.min(100, value + 1))
                  }
                >
                  <Text style={styles.counterSymbol}>+</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <Text style={styles.fieldLabel}>Weight Group</Text>
            <Text style={styles.fieldHint}>
              Select your approximate weight
            </Text>

            <View style={styles.weightOptions}>
              {[
                'Below 50 kg',
                '50–60 kg',
                '60–70 kg',
                '70–80 kg',
                '80+ kg',
              ].map((weight) => {
                const selected = weightGroup === weight;

                return (
                  <Pressable
                    key={weight}
                    onPress={() => setWeightGroup(weight)}
                    style={[
                      styles.weightOption,
                      selected && styles.selectedOption,
                    ]}
                  >
                    <Text
                      style={[
                        styles.weightText,
                        selected && styles.selectedOptionText,
                      ]}
                    >
                      {weight}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Frequent hydrators */}
          <View style={styles.card}>
            <View style={styles.cardHeadingRow}>
              <View style={styles.headingIcon}>
                <Text style={styles.headingEmoji}>🥤</Text>
              </View>

              <View style={styles.headingTextContainer}>
                <Text style={styles.cardTitle}>
                  Most Consumed Hydrators
                </Text>
                <Text style={styles.cardSubtitle}>
                  What do you usually drink during the day?
                </Text>
              </View>
            </View>

            <View style={styles.selectionInfo}>
              <Text style={styles.selectionHint}>
                Select at least 3 drinks
              </Text>

              <Text style={styles.selectionCount}>
                {selectedDrinks.length} selected
              </Text>
            </View>

            <View style={styles.drinkGrid}>
              {hydrators.map((drink) => {
                const selected = selectedDrinks.includes(drink.id);

                return (
                  <Pressable
                    key={drink.id}
                    onPress={() => toggleDrink(drink.id)}
                    style={[
                      styles.drinkTile,
                      selected && styles.selectedDrinkTile,
                    ]}
                  >
                    <View style={styles.drinkTopRow}>
                      <Text style={styles.drinkEmoji}>
                        {drink.icon}
                      </Text>

                      {selected && (
                        <View style={styles.checkCircle}>
                          <Text style={styles.checkMark}>✓</Text>
                        </View>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.drinkName,
                        selected && styles.selectedDrinkName,
                      ]}
                    >
                      {drink.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Preferred hydrator */}
          <View style={styles.card}>
            <View style={styles.cardHeadingRow}>
              <View style={styles.headingIcon}>
                <Text style={styles.headingEmoji}>💚</Text>
              </View>

              <View>
                <Text style={styles.cardTitle}>
                  Your Preferred Hydrator
                </Text>

                <Text style={styles.cardSubtitle}>
                  Which drink do you reach for the most?
                </Text>
              </View>
            </View>

            <View style={styles.preferredOptions}>
              {hydrators
                .filter((drink) =>
                  selectedDrinks.includes(drink.id)
                )
                .map((drink) => {
                  const selected = preferredDrink === drink.id;

                  return (
                    <Pressable
                      key={drink.id}
                      onPress={() => setPreferredDrink(drink.id)}
                      style={[
                        styles.preferredOption,
                        selected && styles.selectedPreferredOption,
                      ]}
                    >
                      <Text style={styles.preferredEmoji}>
                        {drink.icon}
                      </Text>

                      <Text
                        style={[
                          styles.preferredText,
                          selected && styles.selectedPreferredText,
                        ]}
                      >
                        {drink.name}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>
          </View>

          {/* Hydration goal */}
          <View style={styles.card}>
            <View style={styles.cardHeadingRow}>
              <View style={styles.headingIcon}>
                <Text style={styles.headingEmoji}>🎯</Text>
              </View>

              <View>
                <Text style={styles.cardTitle}>
                  Set Your Daily Goal
                </Text>

                <Text style={styles.cardSubtitle}>
                  Choose how you want to set your target
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setGoalType('manual')}
              style={[
                styles.goalOption,
                goalType === 'manual' && styles.selectedGoalOption,
              ]}
            >
              <View style={styles.goalRadio}>
                {goalType === 'manual' && (
                  <View style={styles.goalRadioInner} />
                )}
              </View>

              <View style={styles.goalTextContainer}>
                <Text style={styles.goalTitle}>Set It Myself</Text>

                <Text style={styles.goalDescription}>
                  I already have a daily hydration target.
                </Text>
              </View>

              <Text style={styles.goalIcon}>✍️</Text>
            </Pressable>

            {goalType === 'manual' && (
              <View style={styles.manualGoalContainer}>
                <Text style={styles.fieldLabel}>
                  Daily hydration goal (ml)
                </Text>

                <TextInput
                  value={manualGoal}
                  onChangeText={setManualGoal}
                  keyboardType="numeric"
                  placeholder="Enter amount in ml"
                  placeholderTextColor={COLORS.lightText}
                  style={styles.goalInput}
                  maxLength={5}
                />
              </View>
            )}

            <Pressable
              onPress={() => setGoalType('smart')}
              style={[
                styles.goalOption,
                styles.smartGoalOption,
                goalType === 'smart' && styles.selectedGoalOption,
              ]}
            >
              <View style={styles.goalRadio}>
                {goalType === 'smart' && (
                  <View style={styles.goalRadioInner} />
                )}
              </View>

              <View style={styles.goalTextContainer}>
                <View style={styles.smartTitleRow}>
                  <Text style={styles.goalTitle}>Smart Goal</Text>

                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>
                      RECOMMENDED
                    </Text>
                  </View>
                </View>

                <Text style={styles.goalDescription}>
                  Let H2Oasis suggest a starting target for you.
                </Text>

                <Text style={styles.suggestedGoal}>
                  2,500 ml / day
                </Text>
              </View>

              <Text style={styles.goalIcon}>✨</Text>
            </Pressable>

            <View style={styles.infoStrip}>
              <Text style={styles.infoIcon}>ⓘ</Text>

              <Text style={styles.infoText}>
                Your suggested goal is a starting estimate. You can
                adjust it anytime as your hydration habits change.
              </Text>
            </View>
          </View>

          {/* Continue */}
          <Pressable
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
            <Text style={styles.continueArrow}>→</Text>
          </Pressable>

          <Text style={styles.footerText}>
            You can update your preferences anytime.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  backArrow: {
    fontSize: 32,
    lineHeight: 35,
    color: COLORS.primary,
    marginTop: -4,
  },

  // Dashboard-matching H2oasis wordmark
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#28545A',
    letterSpacing: -0.5,
  },

  logoO: {
    fontWeight: '800',
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCEAE3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },

  heading: {
    fontSize: 27,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.8,
    marginBottom: 9,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
    marginBottom: 25,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },

  headingIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  headingEmoji: {
    fontSize: 20,
  },

  headingTextContainer: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },

  cardSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },

  detailDivider: {
    height: 1,
    backgroundColor: '#EDF1EE',
    marginVertical: 15,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },

  fieldHint: {
    fontSize: 11,
    color: COLORS.lightText,
    marginTop: 4,
  },

  accountDetail: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
    marginTop: 5,
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.section,
    borderRadius: 12,
    padding: 4,
  },

  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterSymbol: {
    fontSize: 21,
    color: COLORS.primary,
    fontWeight: '600',
  },

  ageValue: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },

  weightOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 13,
  },

  weightOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  weightText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.muted,
  },

  selectedOptionText: {
    color: COLORS.white,
  },

  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },

  selectionHint: {
    fontSize: 11,
    color: COLORS.muted,
  },

  selectionCount: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
  },

  drinkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },

  drinkTile: {
    width: '48.5%',
    minHeight: 91,
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
  },

  selectedDrinkTile: {
    backgroundColor: '#EDF5F0',
    borderColor: COLORS.accent,
    borderWidth: 1.5,
  },

  drinkTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  drinkEmoji: {
    fontSize: 25,
  },

  checkCircle: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkMark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },

  drinkName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
    marginTop: 10,
  },

  selectedDrinkName: {
    color: COLORS.primary,
    fontWeight: '800',
  },

  preferredOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  preferredOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  selectedPreferredOption: {
    backgroundColor: '#EDF5F0',
    borderColor: COLORS.accent,
  },

  preferredEmoji: {
    fontSize: 16,
    marginRight: 7,
  },

  preferredText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
  },

  selectedPreferredText: {
    color: COLORS.primary,
    fontWeight: '800',
  },

  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },

  selectedGoalOption: {
    borderColor: COLORS.accent,
    backgroundColor: '#F0F6F2',
  },

  smartGoalOption: {
    marginBottom: 0,
  },

  goalRadio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.lightText,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  goalRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  goalTextContainer: {
    flex: 1,
  },

  goalTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },

  goalDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: COLORS.muted,
    marginTop: 4,
  },

  goalIcon: {
    fontSize: 20,
    marginLeft: 8,
  },

  smartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
  },

  recommendedBadge: {
    backgroundColor: '#DCECE2',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  recommendedText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#34765C',
    letterSpacing: 0.5,
  },

  suggestedGoal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.accent,
    marginTop: 8,
  },

  manualGoalContainer: {
    backgroundColor: COLORS.section,
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
  },

  goalInput: {
    height: 44,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 9,
    color: COLORS.text,
    fontSize: 14,
  },

  infoStrip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.section,
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
  },

  infoIcon: {
    fontSize: 16,
    color: COLORS.accent,
    marginRight: 9,
    fontWeight: '700',
  },

  infoText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 16,
    color: COLORS.muted,
  },

  continueButton: {
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    elevation: 3,
  },

  continueText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },

  continueArrow: {
    color: COLORS.white,
    fontSize: 20,
    marginLeft: 10,
  },

  footerText: {
    textAlign: 'center',
    color: COLORS.lightText,
    fontSize: 10,
    marginTop: 14,
  },
});

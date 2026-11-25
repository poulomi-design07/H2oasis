
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
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
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

const COLORS = {
  background: '#F3F6F1',
  white: '#FFFFFF',
  section: '#EAF1ED',
  border: '#D7E2DC',
  primary: '#28545A',
  accent: '#477C78',
  secondary: '#83A9A0',
  text: '#203A3A',
  muted: '#78908A',
  lightText: '#9AADA6',
};

const drinks = [
  { id: 'water', name: 'Water', icon: '🥛', factor: '1.0x', amount: 250 },
  { id: 'milk', name: 'Milk', icon: '🥛', factor: '0.9x', amount: 200 },
  { id: 'tea', name: 'Tea', icon: '🍵', factor: '0.8x', amount: 150 },
];

// H2Oasis logo - outer circle removed
function H2OasisLogo({ size = 58 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 88 88">
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

function NotificationBell() {
  return (
    <Svg width="19" height="19" viewBox="0 0 24 24">
      <Path
        d="M18 9 A6 6 0 0 0 6 9 C6 16 3 16 3 18 H21 C21 16 18 16 18 9Z"
        stroke={COLORS.primary}
        strokeWidth="1.6"
        fill="none"
        strokeLinejoin="round"
      />
      <Path
        d="M10 21 H14"
        stroke={COLORS.primary}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function HomeIcon({ active }) {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Path
        d="M3 10.5 L12 3 L21 10.5 V21 H14 V15 H10 V21 H3 Z"
        fill={active ? COLORS.primary : COLORS.lightText}
      />
    </Svg>
  );
}

function ProgressIcon({ active }) {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Path
        d="M4 19 V12 H8 V19 M10 19 V6 H14 V19 M16 19 V3 H20 V19"
        stroke={active ? COLORS.primary : COLORS.lightText}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Dynamic hydration bottle and circular progress
function HydrationIllustration({ hydration, goal }) {
  const bottleProgress = Math.max(
    0,
    Math.min(hydration / Math.max(goal, 1), 1)
  );

  const waterTop = 219 - bottleProgress * 150;

  const waterPath = `M64 ${waterTop} Q90 ${waterTop - 5} 114 ${waterTop} Q140 ${waterTop + 5} 164 ${waterTop} V219 Q164 235 148 235 H80 Q64 235 64 219 Z`;

  const waterSurface = `M64 ${waterTop} Q90 ${waterTop - 5} 114 ${waterTop} Q140 ${waterTop + 5} 164 ${waterTop}`;

  const ringRadius = 77;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - bottleProgress);

  return (
    <View style={styles.illustrationArea}>
      <Svg
        width={170}
        height={170}
        viewBox="0 0 170 170"
        style={styles.progressRing}
      >
        <Circle
          cx="85"
          cy="85"
          r={ringRadius}
          stroke="#DDEAE3"
          strokeWidth="6"
          fill="none"
        />

        <Circle
          cx="85"
          cy="85"
          r={ringRadius}
          stroke={COLORS.accent}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${ringCircumference} ${ringCircumference}`}
          strokeDashoffset={ringOffset}
          transform="rotate(-90 85 85)"
        />
      </Svg>

      <View style={styles.smallBubbleOne} />
      <View style={styles.smallBubbleTwo} />
      <View style={styles.smallBubbleThree} />

      <Svg width="100%" height="205" viewBox="0 0 220 260">
        {/* Bottle cap */}
        <Rect
          x="78"
          y="24"
          width="57"
          height="17"
          rx="6"
          fill={COLORS.primary}
        />

        <Rect
          x="84"
          y="29"
          width="43"
          height="6"
          rx="3"
          fill="#82AAA0"
        />

        {/* Bottle neck */}
        <Path
          d="M87 41 V58 Q87 67 78 73"
          stroke={COLORS.primary}
          strokeWidth="3"
          fill="none"
        />

        <Path
          d="M126 41 V58 Q126 67 135 73"
          stroke={COLORS.primary}
          strokeWidth="3"
          fill="none"
        />

        {/* Bottle body */}
        <Rect
          x="62"
          y="69"
          width="104"
          height="168"
          rx="17"
          fill="#F9FCFA"
          stroke="#C7D9D2"
          strokeWidth="3"
        />

        {/* Dynamic water level */}
        <Path
          d={waterPath}
          fill="#78A9A3"
          opacity="0.9"
        />

        {/* Water surface */}
        <Path
          d={waterSurface}
          stroke="#B8D6CF"
          strokeWidth="6"
          fill="none"
        />

        {/* Bottle shine */}
        <Rect
          x="75"
          y="83"
          width="6"
          height="137"
          rx="3"
          fill="#FFFFFF"
          opacity="0.55"
        />

        {/* Water bubbles */}
        <Circle cx="91" cy="190" r="4" fill="#D8EBE5" />
        <Circle cx="137" cy="207" r="3" fill="#D8EBE5" />
        <Circle cx="108" cy="224" r="4" fill="#D8EBE5" />

        {/* Measurement marks */}
        <Line x1="145" y1="103" x2="155" y2="103" stroke="#9AADA6" />
        <Line x1="145" y1="125" x2="155" y2="125" stroke="#9AADA6" />
        <Line x1="145" y1="147" x2="155" y2="147" stroke="#9AADA6" />
      </Svg>

      <View style={styles.illustrationAmount}>
        <Text style={styles.illustrationAmountText}>
          ≈ {hydration.toLocaleString()} ml
        </Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();

  const {
    age: ageParam,
    fullName: fullNameParam,
    hydrationGoal: goalParam,
  } = useLocalSearchParams();

  const age = Number(ageParam) || 20;
  const displayName = fullNameParam || 'Poulomi';

  // Age-based default water serving size
  const sipSize =
    age >= 15 && age < 20
      ? 270
      : age >= 20 && age <= 40
        ? 310
        : 250;

  const [selectedDrink, setSelectedDrink] = useState('water');
  const [hydration, setHydration] = useState(900);
  const [activeTab, setActiveTab] = useState('Home');

  // Initial hydration goal
  const initialGoal =
    Number(goalParam) > 0 ? Number(goalParam) : 2000;

  const [goal, setGoal] = useState(initialGoal);
  const [goalInput, setGoalInput] = useState(String(initialGoal));
  const [goalModalVisible, setGoalModalVisible] = useState(false);

  // Greeting
  const [greeting, setGreeting] = useState('');

  const updateGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  useEffect(() => {
    updateGreeting();

    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  const progress =
    Math.min(hydration / Math.max(goal, 1), 1) * 100;

  // Open goal editor
  const openGoalEditor = () => {
    setGoalInput(String(goal));
    setGoalModalVisible(true);
  };

  // Save updated goal
  const saveGoal = () => {
    const newGoal = Number(goalInput);

    if (
      !goalInput.trim() ||
      !Number.isFinite(newGoal) ||
      newGoal <= 0
    ) {
      Alert.alert(
        'Invalid Goal',
        'Please enter a valid goal greater than 0 ml.'
      );
      return;
    }

    if (newGoal > 10000) {
      Alert.alert(
        'Goal Too High',
        'Please enter a daily goal of 10,000 ml or less.'
      );
      return;
    }

    setGoal(newGoal);
    setGoalModalVisible(false);

    Alert.alert(
      'Goal Updated!',
      `Your new daily hydration goal is ${newGoal.toLocaleString()} ml.`
    );
  };

  // Log a drink
  const handleDrink = (drink) => {
    setSelectedDrink(drink.id);

    const amount =
      drink.id === 'water' ? sipSize : drink.amount;

    Alert.alert(
      `Log ${drink.name}`,
      `Add ${amount} ml of ${drink.name} to your hydration tracker?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add Drink',
          onPress: () => {
            setHydration((current) => current + amount);

            Alert.alert(
              'Drink added!',
              `${amount} ml of ${drink.name} has been added to your daily tracker.`
            );
          },
        },
      ]
    );
  };

  // Bottom navigation
  const handleTab = (tab) => {
    if (tab === 'Log') {
      setHydration((current) => current + sipSize);
      setActiveTab('Home');
      return;
    }

    if (tab === 'Progress') {
      setActiveTab('Progress');
      router.push('/progress');
    } else if (tab === 'Home') {
      setActiveTab('Home');
      router.replace('/dashboard');
    }
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brand}>
              <View style={styles.logoIcon}>
                <H2OasisLogo size={27} />
              </View>

              <Text style={styles.logoText}>
                H2<Text style={styles.logoO}>o</Text>asis
              </Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                style={styles.notificationButton}
                onPress={() => router.push('/reminders')}
                accessibilityRole="button"
                accessibilityLabel="Open hydration reminders"
              >
                <NotificationBell />
                <View style={styles.notificationDot} />
              </Pressable>

              <Pressable
                style={styles.avatar}
                onPress={() => router.push('/profile')}
                accessibilityRole="button"
                accessibilityLabel="Open profile"
              >
                <Text style={styles.avatarText}>P</Text>
              </Pressable>
            </View>
          </View>

          {/* Dynamic Greeting */}
          <View style={styles.greeting}>
            <Text style={styles.greetingTitle}>
              {greeting}, {displayName}! 🌿
            </Text>

            <Text style={styles.greetingSubtitle}>
              Let's keep the flow going{' '}
              <Text style={styles.greetingDrop}>◆</Text>
            </Text>
          </View>

          {/* Hydration Overview */}
          <View style={styles.overview}>
            <View style={styles.illustrationContainer}>
              <HydrationIllustration
                hydration={hydration}
                goal={goal}
              />
            </View>

            <View style={styles.overviewCards}>
              {/* Editable Goal Card */}
              <View style={styles.goalCard}>
                <View style={styles.goalHeaderRow}>
                  <Text style={styles.miniCardLabel}>
                    ◎ Your goal
                  </Text>

                  <Pressable
                    onPress={openGoalEditor}
                    hitSlop={10}
                    style={styles.editButton}
                    accessibilityRole="button"
                    accessibilityLabel="Edit daily hydration goal"
                  >
                    <Text style={styles.editIcon}>✎</Text>
                  </Pressable>
                </View>

                <View style={styles.goalValueRow}>
                  <Text style={styles.goalValue}>
                    {goal.toLocaleString()} ml
                  </Text>
                </View>

                <View style={styles.goalTrack}>
                  <View
                    style={[
                      styles.goalFill,
                      { width: `${progress}%` },
                    ]}
                  />
                </View>

                <Text style={styles.goalProgressText}>
                  {hydration.toLocaleString()} ml consumed
                </Text>
              </View>

              {/* Hydration Factor Card */}
              <View style={styles.factorCard}>
                <Text style={styles.miniCardLabel}>
                  ⌁ Hydration
                </Text>

                <Text style={styles.factorTitle}>Factor</Text>

                <Text style={styles.factorLevel}>
                  Moderate
                </Text>

                <View style={styles.factorWave}>
                  <Text style={styles.factorWaveText}>
                    ﹏﹏﹏
                  </Text>
                </View>

                <Text style={styles.factorMessage}>
                  Your body needs more water today! 🌱
                </Text>
              </View>
            </View>
          </View>

          {/* Add a Drink */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionIcon}>☕</Text>
              <Text style={styles.sectionTitle}>
                Add a Drink
              </Text>
            </View>

            <Pressable
              onPress={() =>
                Alert.alert(
                  'All Drinks',
                  'More drink options will be available here.'
                )
              }
            >
              <Text style={styles.viewAll}>
                View All →
              </Text>
            </Pressable>
          </View>

          <View style={styles.drinkRow}>
            {drinks.map((drink) => {
              const selected = selectedDrink === drink.id;

              return (
                <Pressable
                  key={drink.id}
                  style={[
                    styles.drinkCard,
                    selected && styles.selectedDrinkCard,
                  ]}
                  onPress={() => handleDrink(drink)}
                >
                  {selected && (
                    <View style={styles.drinkCheck}>
                      <Text style={styles.drinkCheckText}>
                        ✓
                      </Text>
                    </View>
                  )}

                  <Text style={styles.drinkEmoji}>
                    {drink.icon}
                  </Text>

                  <Text style={styles.drinkName}>
                    {drink.name}
                  </Text>

                  <Text style={styles.drinkFactorLabel}>
                    Hydration Factor
                  </Text>

                  <Text style={styles.drinkFactor}>
                    {drink.factor}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Progress Cards */}
          <View style={styles.insightsRow}>
            <View style={styles.insightCard}>
              <Text style={styles.insightLabel}>
                💧 Your Streak
              </Text>

              <Text style={styles.streakNumber}>
                5 days
              </Text>

              <Text style={styles.insightDescription}>
                Keep going!
              </Text>

              <View style={styles.streakIllustration}>
                <Text style={styles.streakTrophy}>
                  🏆
                </Text>

                <Text style={styles.streakDots}>
                  •••
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.insightCard}
              onPress={() => router.push('/progress')}
              accessibilityRole="button"
              accessibilityLabel="Open today's hydration statistics"
            >
              <Text style={styles.insightLabel}>
                ▥ Today's Insights
              </Text>

              <Text style={styles.insightHeadline}>
                You're on track!
              </Text>

              <Text style={styles.insightDescription}>
                Your hydration is 20% better than last week.
              </Text>

              <View style={styles.miniChart}>
                {[20, 35, 50, 70].map((height, index) => (
                  <View
                    key={index}
                    style={[
                      styles.chartBar,
                      { height },
                    ]}
                  />
                ))}
              </View>
            </Pressable>
          </View>

          <Text style={styles.footerText}>
            Small sips, healthier habits. 💧
          </Text>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Pressable
            style={styles.navItem}
            onPress={() => handleTab('Home')}
          >
            <HomeIcon active={activeTab === 'Home'} />

            <Text
              style={[
                styles.navLabel,
                activeTab === 'Home' && styles.activeNavLabel,
              ]}
            >
              Home
            </Text>

            {activeTab === 'Home' && (
              <View style={styles.navIndicator} />
            )}
          </Pressable>

          <Pressable
            style={styles.logNavItem}
            onPress={() => handleTab('Log')}
          >
            <View style={styles.logButton}>
              <Text style={styles.logPlus}>+</Text>
            </View>

            <Text style={styles.logLabel}>
              Log
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => handleTab('Progress')}
          >
            <ProgressIcon active={activeTab === 'Progress'} />

            <Text
              style={[
                styles.navLabel,
                activeTab === 'Progress' && styles.activeNavLabel,
              ]}
            >
              Progress
            </Text>

            {activeTab === 'Progress' && (
              <View style={styles.navIndicator} />
            )}
          </Pressable>
        </View>

        {/* Edit Goal Modal */}
        <Modal
          visible={goalModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setGoalModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.goalModal}>
              <View style={styles.modalIconCircle}>
                <Text style={styles.modalWaterIcon}>
                  💧
                </Text>
              </View>

              <Text style={styles.modalTitle}>
                Edit Daily Goal
              </Text>

              <Text style={styles.modalSubtitle}>
                Set your personal daily hydration target.
              </Text>

              <Text style={styles.inputLabel}>
                Daily hydration goal
              </Text>

              <View style={styles.goalInputContainer}>
                <TextInput
                  style={styles.goalInput}
                  value={goalInput}
                  onChangeText={setGoalInput}
                  keyboardType="number-pad"
                  placeholder="Enter goal"
                  placeholderTextColor={COLORS.lightText}
                  maxLength={5}
                  autoFocus
                />

                <Text style={styles.mlLabel}>
                  ml
                </Text>
              </View>

              <Text style={styles.goalHint}>
                Enter a goal between 1 and 10,000 ml.
              </Text>

              <View style={styles.modalButtons}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setGoalModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.saveButton}
                  onPress={saveGoal}
                >
                  <Text style={styles.saveButtonText}>
                    Save Goal
                  </Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Main layout
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Outer circle and border removed
  logoIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  logoText: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },

  logoO: {
    fontWeight: '800',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    top: 7,
    right: 8,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },

  // Greeting
  greeting: {
    marginBottom: 20,
  },

  greetingTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  greetingSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 6,
  },

  greetingDrop: {
    color: COLORS.accent,
    fontSize: 10,
  },

  // Hydration overview
  overview: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 255,
    marginBottom: 16,
  },

  illustrationContainer: {
    flex: 1.2,
    height: 245,
    justifyContent: 'center',
  },

  illustrationArea: {
    height: 225,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressRing: {
    position: 'absolute',
  },

  smallBubbleOne: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#A8C6BB',
    top: 40,
    left: 7,
  },

  smallBubbleTwo: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#B5D0C5',
    top: 28,
    right: 8,
  },

  smallBubbleThree: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A8C6BB',
    bottom: 24,
    left: 16,
  },

  illustrationAmount: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },

  illustrationAmountText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },

  overviewCards: {
    flex: 0.9,
    gap: 11,
  },

  // Goal card
  goalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  goalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  miniCardLabel: {
    fontSize: 10,
    color: COLORS.muted,
  },

  editButton: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: COLORS.section,
  },

  editIcon: {
    fontSize: 16,
    color: COLORS.primary,
  },

  goalValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
  },

  goalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },

  goalTrack: {
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.section,
    marginTop: 10,
    overflow: 'hidden',
  },

  goalFill: {
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },

  goalProgressText: {
    fontSize: 8,
    color: COLORS.lightText,
    marginTop: 5,
  },

  // Hydration factor card
  factorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 123,
  },

  factorTitle: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },

  factorLevel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 3,
  },

  factorWave: {
    marginTop: 2,
  },

  factorWaveText: {
    fontSize: 17,
    color: COLORS.accent,
    letterSpacing: 1,
  },

  factorMessage: {
    fontSize: 9,
    lineHeight: 13,
    color: COLORS.muted,
    marginTop: 3,
  },

  // Section headings
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 12,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionIcon: {
    fontSize: 17,
    color: COLORS.primary,
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },

  viewAll: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '600',
  },

  // Drink cards
  drinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 9,
    marginBottom: 16,
  },

  drinkCard: {
    flex: 1,
    height: 125,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 9,
  },

  selectedDrinkCard: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    backgroundColor: '#EDF5F0',
  },

  drinkCheck: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  drinkCheckText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
  },

  drinkEmoji: {
    fontSize: 29,
    marginBottom: 7,
  },

  drinkName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },

  drinkFactorLabel: {
    fontSize: 8,
    color: COLORS.lightText,
    marginTop: 5,
  },

  drinkFactor: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.accent,
    marginTop: 3,
  },

  // Insights
  insightsRow: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 12,
  },

  insightCard: {
    flex: 1,
    minHeight: 137,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  insightLabel: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: '500',
  },

  streakNumber: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 9,
  },

  insightDescription: {
    fontSize: 9,
    lineHeight: 13,
    color: COLORS.muted,
    marginTop: 4,
  },

  streakIllustration: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    width: 45,
    height: 43,
    borderRadius: 11,
    backgroundColor: '#E2EEE8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  streakTrophy: {
    fontSize: 19,
  },

  streakDots: {
    fontSize: 8,
    color: COLORS.accent,
    letterSpacing: 3,
  },

  insightHeadline: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 8,
  },

  miniChart: {
    position: 'absolute',
    right: 12,
    bottom: 11,
    height: 62,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
  },

  chartBar: {
    width: 8,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: '#8DB2A5',
  },

  footerText: {
    textAlign: 'center',
    color: COLORS.lightText,
    fontSize: 10,
    marginTop: 2,
  },

  // Bottom navigation
  bottomNav: {
    height: 78,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    elevation: 12,
    shadowColor: '#203A3A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },

  navLabel: {
    fontSize: 9,
    color: COLORS.lightText,
    marginTop: 5,
  },

  activeNavLabel: {
    color: COLORS.primary,
    fontWeight: '800',
  },

  navIndicator: {
    width: 17,
    height: 3,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginTop: 4,
  },

  logNavItem: {
    flex: 1,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -25,
  },

  logButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  logPlus: {
    color: COLORS.white,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '300',
  },

  logLabel: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 3,
  },

  // Goal editor modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 45, 43, 0.42)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
  },

  goalModal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 23,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  modalIconCircle: {
    width: 53,
    height: 53,
    borderRadius: 27,
    backgroundColor: COLORS.section,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  modalWaterIcon: {
    fontSize: 25,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
  },

  modalSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 22,
  },

  inputLabel: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },

  goalInputContainer: {
    width: '100%',
    height: 53,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  goalInput: {
    flex: 1,
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.primary,
    paddingVertical: 8,
  },

  mlLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.muted,
  },

  goalHint: {
    alignSelf: 'flex-start',
    fontSize: 10,
    color: COLORS.lightText,
    marginTop: 7,
  },

  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 24,
  },

  cancelButton: {
    flex: 1,
    height: 47,
    borderRadius: 13,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  saveButton: {
    flex: 1,
    height: 47,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
});

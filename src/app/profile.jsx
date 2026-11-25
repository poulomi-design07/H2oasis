
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const COLORS = {
  background: '#F3F6F1',
  white: '#FFFFFF',
  section: '#EAF1ED',
  border: '#D7E2DC',
  primary: '#28545A',
  accent: '#477C78',
  secondary: '#83A9A0',
  text: '#203A3A',
  muted: '#607572',
  error: '#B94B4B',
};

const ACTIVITY_OPTIONS = [
  {
    value: 'Sedentary',
    description: 'Little or no regular exercise',
  },
  {
    value: 'Moderately Active',
    description: 'Light exercise or regular walking',
  },
  {
    value: 'Very Active',
    description: 'Intense exercise or sports',
  },
];

function AppIcon({ name, color = COLORS.primary, size = 20 }) {
  const icons = {
    back: <Path d="M15 18l-6-6 6-6" />,
    calendar: <Path d="M8 3v4 M16 3v4 M3 9h18 M5 5h14a2 2 0 0 1 2 2v14H3V7a2 2 0 0 1 2-2z" />,
    edit: <Path d="M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />,
    age: <Path d="M8 3h8 M10 3v5l-5 8h14l-5-8V3 M7 16h10" />,
    weight: <Path d="M4 7h16l-2 13H6L4 7z M9 7l3-4 3 4" />,
    activity: <Path d="M12 3v4l-3 4 3 3 3-3-3-4 M12 14l-2 7 M12 14l3 7" />,
    water: <Path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13z" />,
    goal: (
      <>
        <Circle cx="12" cy="12" r="9" />
        <Path d="M12 7v5l3 2" />
      </>
    ),
    auto: <Path d="M12 2v4 M12 18v4 M4.9 4.9l2.8 2.8 M16.3 16.3l2.8 2.8 M2 12h4 M18 12h4 M4.9 19.1l2.8-2.8 M16.3 7.7l2.8-2.8" />,
    bell: <Path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4" />,
    timer: (
      <>
        <Circle cx="12" cy="13" r="9" />
        <Path d="M12 8v5l3 2 M9 2h6" />
      </>
    ),
    help: (
      <>
        <Circle cx="12" cy="12" r="10" />
        <Path d="M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 4 M12 18h.01" />
      </>
    ),
    privacy: <Path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />,
    info: (
      <>
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 16v-4 M12 8h.01" />
      </>
    ),
    logout: <Path d="M10 17l5-5-5-5 M15 12H3 M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />,
    home: <Path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />,
    chart: <Path d="M4 19V10 M10 19V5 M16 19v-8 M22 19H2" />,
    plus: <Path d="M12 5v14 M5 12h14" />,
    chevron: <Path d="m9 18 6-6-6-6" />,
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] || <Circle cx="12" cy="12" r="9" />}
    </Svg>
  );
}

function IconBox({
  name,
  background = COLORS.section,
  color = COLORS.primary,
}) {
  return (
    <View style={[styles.iconBox, { backgroundColor: background }]}>
      <AppIcon name={name} color={color} size={18} />
    </View>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!subtitle && (
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      )}
    </View>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  rightText,
  onPress,
  danger = false,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingRow,
        pressed && styles.settingRowPressed,
      ]}
      onPress={onPress}
      android_ripple={{ color: '#EAF1ED' }}
    >
      <IconBox
        name={icon}
        background={danger ? '#FCE5E2' : COLORS.section}
        color={danger ? COLORS.error : COLORS.accent}
      />

      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, danger && { color: COLORS.error }]}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>

      {!!rightText && (
        <View style={styles.rightPill}>
          <Text style={styles.rightPillText}>{rightText}</Text>
        </View>
      )}

      <AppIcon
        name="chevron"
        size={16}
        color={danger ? COLORS.error : '#A8B8B1'}
      />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();

  // Profile information
  const [fullName, setFullName] = useState('Poulomi Maiti');
  const [email, setEmail] = useState('poulomi@example.com');
  const [phone, setPhone] = useState('+91 98234 56789');

  // Personal details
  const [age, setAge] = useState('25');
  const [weight, setWeight] = useState('68');
  const [activity, setActivity] = useState('Moderately Active');

  // Preferences
  const [weightUnit, setWeightUnit] = useState('kg');
  const [volumeUnit, setVolumeUnit] = useState('ml');
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [hydrationGoal, setHydrationGoal] = useState(2000);

  // Edit popup
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Temporary values used inside the popup
  const [editName, setEditName] = useState(fullName);
  const [editEmail, setEditEmail] = useState(email);
  const [editPhone, setEditPhone] = useState(phone);
  const [editAge, setEditAge] = useState(age);
  const [editWeight, setEditWeight] = useState(weight);
  const [editActivity, setEditActivity] = useState(activity);

  // Calendar popup
  const [calendarVisible, setCalendarVisible] = useState(false);

  // Today's date stays selected while navigating between months
  const [today] = useState(() => new Date());

  // Initially show the current month
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // Today's date details
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const todayFormatted = today.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Displayed month and year
  const monthName = calendarMonth.toLocaleString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  // Calculate the first weekday and number of days in the month
  const firstDay = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay();

  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();

  // Create calendar cells, including empty spaces before day 1
  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  // Previous month navigation
  const goToPreviousMonth = () => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1
      )
    );
  };

  // Next month navigation
  const goToNextMonth = () => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1
      )
    );
  };

  const showComingSoon = (feature) => {
    Alert.alert(feature, 'This feature will be connected soon.');
  };

  const openEditProfile = () => {
    setEditName(fullName);
    setEditEmail(email);
    setEditPhone(phone);
    setEditAge(age);
    setEditWeight(weight);
    setEditActivity(activity);
    setEditModalVisible(true);
  };

  const saveProfileChanges = () => {
    const parsedAge = Number(editAge);
    const parsedWeight = Number(editWeight);

    if (!editName.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }

    if (!editEmail.trim() || !editEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!editPhone.trim()) {
      Alert.alert('Phone Required', 'Please enter your phone number.');
      return;
    }

    if (
      !editAge.trim() ||
      !Number.isInteger(parsedAge) ||
      parsedAge < 1 ||
      parsedAge > 120
    ) {
      Alert.alert('Invalid Age', 'Please enter an age between 1 and 120.');
      return;
    }

    if (
      !editWeight.trim() ||
      !Number.isFinite(parsedWeight) ||
      parsedWeight < 1 ||
      parsedWeight > 500
    ) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight in kg.');
      return;
    }

    setFullName(editName.trim());
    setEmail(editEmail.trim());
    setPhone(editPhone.trim());
    setAge(editAge);
    setWeight(editWeight);
    setActivity(editActivity);

    setEditModalVisible(false);

    Alert.alert('Profile Updated', 'Your profile details have been updated.');
  };

  const changeGoal = () => {
    Alert.alert('Hydration Goal', 'Choose your daily hydration goal.', [
      { text: '1800 ml', onPress: () => setHydrationGoal(1800) },
      { text: '2000 ml', onPress: () => setHydrationGoal(2000) },
      { text: '2500 ml', onPress: () => setHydrationGoal(2500) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => router.replace('/login'),
      },
    ]);
  };

  const openReminders = () => {
    router.push('/reminders');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.replace('/dashboard')}
              hitSlop={8}
            >
              <AppIcon name="back" size={24} />
            </Pressable>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Profile & Settings</Text>
              <Text style={styles.headerSubtitle}>
                Your hydration journey, your way.
              </Text>
            </View>

            <Pressable
              style={styles.calendarButton}
              onPress={() => {
                setCalendarMonth(
                  new Date(today.getFullYear(), today.getMonth(), 1)
                );
                setCalendarVisible(true);
              }}
            >
              <AppIcon name="calendar" size={19} />
            </Pressable>
          </View>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {fullName.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{fullName}</Text>
                <Text style={styles.verified}>✿</Text>
              </View>

              <Text style={styles.profileDetail}>✉  {email}</Text>
              <Text style={styles.profileDetail}>☎  {phone}</Text>
            </View>

            <View style={styles.profileEdit}>
              <Text style={styles.memberText}>Member since Jan 2024</Text>

              <Pressable
                style={styles.editButton}
                onPress={openEditProfile}
              >
                <AppIcon name="edit" size={13} color={COLORS.primary} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </Pressable>
            </View>
          </View>

          {/* Personal details */}
          <SectionHeading
            title="Personal Details"
            subtitle="Update your information for a better hydration goal."
          />

          <View style={styles.detailsRow}>
            <Pressable
              style={styles.detailCard}
              onPress={openEditProfile}
            >
              <IconBox name="age" />
              <Text style={styles.detailValue}>{age}</Text>
              <Text style={styles.detailLabel}>Years</Text>
              <Text style={styles.cardEditHint}>Tap to edit</Text>
            </Pressable>

            <Pressable
              style={styles.detailCard}
              onPress={openEditProfile}
            >
              <IconBox name="weight" />
              <Text style={styles.detailValue}>{weight}</Text>
              <Text style={styles.detailLabel}>{weightUnit}</Text>
              <Text style={styles.cardEditHint}>Tap to edit</Text>
            </Pressable>

            <Pressable
              style={styles.detailCard}
              onPress={openEditProfile}
            >
              <IconBox name="activity" />
              <Text style={styles.activityValue}>
                {activity === 'Moderately Active'
                  ? 'Moderate'
                  : activity === 'Sedentary'
                    ? 'Low'
                    : 'High'}
              </Text>
              <Text style={styles.detailLabel}>Activity</Text>
              <Text style={styles.cardEditHint}>Tap to edit</Text>
            </Pressable>
          </View>

          {/* Measurement preferences */}
          <SectionHeading
            title="Measurement Preferences"
            subtitle="Choose your preferred units."
          />

          <View style={styles.measurementRow}>
            <View style={styles.measurementCard}>
              <Text style={styles.measurementTitle}>Weight Unit</Text>

              <View style={styles.segment}>
                {['kg', 'lb'].map((unit) => (
                  <Pressable
                    key={unit}
                    style={[
                      styles.segmentOption,
                      weightUnit === unit && styles.segmentActive,
                    ]}
                    onPress={() => setWeightUnit(unit)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        weightUnit === unit && styles.segmentTextActive,
                      ]}
                    >
                      {unit}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.measurementCard}>
              <Text style={styles.measurementTitle}>Water Volume</Text>

              <View style={styles.segment}>
                {['ml', 'oz'].map((unit) => (
                  <Pressable
                    key={unit}
                    style={[
                      styles.segmentOption,
                      volumeUnit === unit && styles.segmentActive,
                    ]}
                    onPress={() => setVolumeUnit(unit)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        volumeUnit === unit && styles.segmentTextActive,
                      ]}
                    >
                      {unit}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Hydration preferences */}
          <SectionHeading
            title="Hydration Preferences"
            subtitle="Set your daily goal and goal type."
          />

          <View style={styles.hydrationCard}>
            <View style={styles.preferenceRow}>
              <IconBox name="water" />

              <View style={styles.preferenceText}>
                <Text style={styles.preferenceTitle}>Daily Goal</Text>
                <Text style={styles.preferenceSubtitle}>
                  Target fluid intake
                </Text>
              </View>

              <Pressable style={styles.goalPill} onPress={changeGoal}>
                <Text style={styles.goalText}>{hydrationGoal} ml</Text>
                <AppIcon name="edit" size={13} color={COLORS.accent} />
              </Pressable>
            </View>

            <View style={styles.preferenceDivider} />

            <View style={styles.preferenceRow}>
              <IconBox name="goal" />

              <View style={styles.preferenceText}>
                <Text style={styles.preferenceTitle}>Goal Type</Text>
                <Text style={styles.preferenceSubtitle}>Adaptive rhythm</Text>
              </View>

              <View style={styles.recommendedPill}>
                <Text style={styles.recommendedText}>
                  ✦ Recommended (Smart)
                </Text>
              </View>
            </View>

            <View style={styles.preferenceDivider} />

            <View style={styles.preferenceRow}>
              <IconBox name="auto" />

              <View style={styles.preferenceText}>
                <Text style={styles.preferenceTitle}>Auto Adjust</Text>
                <Text style={styles.preferenceSubtitle}>
                  Based on weight & activity
                </Text>
              </View>

              <Switch
                value={autoAdjust}
                onValueChange={setAutoAdjust}
                trackColor={{
                  false: '#D7E2DC',
                  true: COLORS.primary,
                }}
                thumbColor={COLORS.white}
                ios_backgroundColor="#D7E2DC"
              />
            </View>
          </View>

          {/* Account settings */}
          <SectionHeading
            title="Account & Preferences"
            subtitle="Manage your app and account settings."
          />

          <View style={styles.settingsCard}>
            <SettingRow
              icon="bell"
              title="Notification Settings"
              onPress={openReminders}
            />

            <View style={styles.preferenceDivider} />

            <SettingRow
              icon="timer"
              title="Hydration Reminders"
              rightText="Every 1.5 hrs"
              onPress={openReminders}
            />

            <View style={styles.preferenceDivider} />

            <SettingRow
              icon="help"
              title="Help & Support"
              onPress={() => showComingSoon('Help & Support')}
            />

            <View style={styles.preferenceDivider} />

            <SettingRow
              icon="privacy"
              title="Privacy Policy"
              onPress={() => showComingSoon('Privacy Policy')}
            />

            <View style={styles.preferenceDivider} />

            <SettingRow
              icon="info"
              title="About H2Oasis"
              rightText="v1.2.0"
              onPress={() => showComingSoon('About H2Oasis')}
            />

            <View style={styles.preferenceDivider} />

            <SettingRow
              icon="logout"
              title="Log Out"
              danger
              onPress={handleLogout}
            />
          </View>

          {/* Streak message */}
          <View style={styles.streakCard}>
            <View style={styles.streakIcon}>
              <AppIcon name="water" color={COLORS.accent} size={17} />
            </View>

            <Text style={styles.streakText}>
              Your current streak is 14 days of mindful hydration! Keep flowing.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom navigation */}
        <View style={styles.bottomNav}>
          <Pressable
            style={styles.navItem}
            onPress={() => router.replace('/dashboard')}
          >
            <AppIcon name="home" size={20} color={COLORS.muted} />
            <Text style={styles.navText}>Home</Text>
          </Pressable>

          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/dashboard')}
          >
            <AppIcon name="plus" size={25} color={COLORS.white} />
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/progress')}
          >
            <AppIcon name="chart" size={20} color={COLORS.muted} />
            <Text style={styles.navText}>Progress</Text>
          </Pressable>
        </View>
      </View>

      {/* Edit Profile and Personal Details Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.editModal}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Edit Your Details</Text>
                <Text style={styles.modalSubtitle}>
                  Keep your personal information up to date.
                </Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalSectionTitle}>Profile Information</Text>

              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your full name"
                placeholderTextColor="#9AA9A2"
              />

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9AA9A2"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Enter your phone number"
                placeholderTextColor="#9AA9A2"
                keyboardType="phone-pad"
              />

              <View style={styles.modalDivider} />

              <Text style={styles.modalSectionTitle}>Personal Details</Text>

              <Text style={styles.inputLabel}>Age (years)</Text>
              <TextInput
                style={styles.textInput}
                value={editAge}
                onChangeText={(value) =>
                  setEditAge(value.replace(/[^0-9]/g, ''))
                }
                placeholder="Enter your age"
                placeholderTextColor="#9AA9A2"
                keyboardType="number-pad"
                maxLength={3}
              />

              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.textInput}
                value={editWeight}
                onChangeText={(value) =>
                  setEditWeight(value.replace(/[^0-9.]/g, ''))
                }
                placeholder="Enter your weight"
                placeholderTextColor="#9AA9A2"
                keyboardType="decimal-pad"
                maxLength={6}
              />

              <Text style={styles.inputLabel}>Activity Level</Text>

              <View style={styles.activityOptions}>
                {ACTIVITY_OPTIONS.map((option) => {
                  const selected = editActivity === option.value;

                  return (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.activityOption,
                        selected && styles.activityOptionSelected,
                      ]}
                      onPress={() => setEditActivity(option.value)}
                    >
                      <View style={styles.activityOptionTop}>
                        <Text
                          style={[
                            styles.activityOptionTitle,
                            selected && styles.activityOptionTitleSelected,
                          ]}
                        >
                          {option.value}
                        </Text>

                        <View
                          style={[
                            styles.radioOuter,
                            selected && styles.radioOuterSelected,
                          ]}
                        >
                          {selected && <View style={styles.radioInner} />}
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.activityOptionDescription,
                          selected && styles.activityOptionDescriptionSelected,
                        ]}
                      >
                        {option.description}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.modalButtons}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={styles.saveButton}
                  onPress={saveProfileChanges}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.calendarOverlay}>
          <View style={styles.calendarModal}>
            {/* Calendar Header */}
            <View style={styles.calendarModalHeader}>
              <View>
                <Text style={styles.calendarModalTitle}>
                  Your Calendar
                </Text>
                <Text style={styles.calendarModalSubtitle}>
                  Keep track of your hydration journey.
                </Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() => setCalendarVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            {/* Month Navigation */}
            <View style={styles.monthNavigation}>
              <Pressable
                style={styles.monthArrow}
                onPress={goToPreviousMonth}
              >
                <Text style={styles.monthArrowText}>‹</Text>
              </Pressable>

              <Text style={styles.monthTitle}>{monthName}</Text>

              <Pressable
                style={styles.monthArrow}
                onPress={goToNextMonth}
              >
                <Text style={styles.monthArrowText}>›</Text>
              </Pressable>
            </View>

            {/* Weekday Names */}
            <View style={styles.weekDaysRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                (day) => (
                  <View key={day} style={styles.weekDayCell}>
                    <Text style={styles.weekDayText}>{day}</Text>
                  </View>
                )
              )}
            </View>

            {/* Calendar Dates */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                const isToday =
                  day === todayDate &&
                  calendarMonth.getMonth() === todayMonth &&
                  calendarMonth.getFullYear() === todayYear;

                return (
                  <View
                    key={`${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}-${index}`}
                    style={styles.calendarDayCell}
                  >
                    {day !== null && (
                      <View
                        style={[
                          styles.calendarDay,
                          isToday && styles.selectedCalendarDay,
                        ]}
                      >
                        <Text
                          style={[
                            styles.calendarDayText,
                            isToday && styles.selectedCalendarDayText,
                          ]}
                        >
                          {day}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Selected Date */}
            <View style={styles.selectedDateCard}>
              <View style={styles.selectedDateDot} />

              <View style={styles.selectedDateInfo}>
                <Text style={styles.selectedDateLabel}>
                  Selected Date
                </Text>
                <Text style={styles.selectedDateText}>
                  {todayFormatted}
                </Text>
              </View>

              <Text style={styles.todayTag}>TODAY</Text>
            </View>

            <Pressable
              style={styles.calendarDoneButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.calendarDoneText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 24) + 16
        : 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
    gap: 10,
  },

  backButton: {
    width: 32,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.primary,
  },

  headerSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 3,
  },

  calendarButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 17,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#D7EAE3',
    borderWidth: 2,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },

  profileInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },

  verified: {
    fontSize: 12,
    color: COLORS.accent,
    marginLeft: 4,
  },

  profileDetail: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 5,
  },

  profileEdit: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  memberText: {
    fontSize: 11,
    color: COLORS.muted,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A6E6DF',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 5,
  },

  editButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },

  sectionHeading: {
    marginBottom: 11,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },

  sectionSubtitle: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 3,
  },

  detailsRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 23,
  },

  detailCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 12,
    minHeight: 118,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailValue: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 7,
  },

  activityValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 10,
  },

  detailLabel: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },

  cardEditHint: {
    fontSize: 8,
    color: COLORS.accent,
    marginTop: 5,
  },

  measurementRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 23,
  },

  measurementCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 12,
  },

  measurementTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 11,
  },

  segment: {
    backgroundColor: COLORS.section,
    borderRadius: 18,
    padding: 3,
    flexDirection: 'row',
  },

  segmentOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 15,
  },

  segmentActive: {
    backgroundColor: COLORS.primary,
  },

  segmentText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.muted,
  },

  segmentTextActive: {
    color: COLORS.white,
  },

  hydrationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 19,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginBottom: 23,
    elevation: 2,
  },

  preferenceRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  preferenceText: {
    flex: 1,
  },

  preferenceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },

  preferenceSubtitle: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 4,
  },

  preferenceDivider: {
    height: 1,
    backgroundColor: '#EDF1EE',
    marginHorizontal: 3,
  },

  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.section,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  goalText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },

  recommendedPill: {
    backgroundColor: '#E6F4F0',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 15,
  },

  recommendedText: {
    fontSize: 8,
    color: COLORS.accent,
    fontWeight: '700',
  },

  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 19,
    paddingHorizontal: 13,
    paddingVertical: 6,
    marginBottom: 19,
    elevation: 2,
  },

  settingRow: {
    minHeight: 59,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  settingRowPressed: {
    opacity: 0.65,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },

  settingSubtitle: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 3,
  },

  rightPill: {
    backgroundColor: COLORS.section,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },

  rightPillText: {
    fontSize: 8,
    color: COLORS.muted,
    fontWeight: '600',
  },

  streakCard: {
    backgroundColor: '#E4F3EE',
    borderRadius: 15,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },

  streakIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#C9E9E0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  streakText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.primary,
    lineHeight: 15,
  },

  bottomNav: {
    height: 65,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    gap: 3,
  },

  navText: {
    fontSize: 9,
    color: COLORS.muted,
    fontWeight: '600',
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  // Edit popup
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 45, 43, 0.48)',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 25,
  },

  editModal: {
    maxHeight: '92%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.primary,
  },

  modalSubtitle: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 5,
  },

  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    fontSize: 23,
    color: COLORS.primary,
    lineHeight: 26,
  },

  modalSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 5,
    marginBottom: 12,
  },

  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 10,
  },

  textInput: {
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    paddingHorizontal: 13,
    fontSize: 12,
    color: COLORS.text,
  },

  modalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 20,
    marginBottom: 15,
  },

  activityOptions: {
    gap: 8,
    marginTop: 3,
  },

  activityOption: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    padding: 12,
    backgroundColor: COLORS.white,
  },

  activityOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EDF5F0',
  },

  activityOptionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  activityOptionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
  },

  activityOptionTitleSelected: {
    color: COLORS.primary,
  },

  activityOptionDescription: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 4,
  },

  activityOptionDescriptionSelected: {
    color: COLORS.accent,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: COLORS.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuterSelected: {
    borderColor: COLORS.primary,
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
    marginBottom: 5,
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
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },

  saveButton: {
    flex: 1.4,
    height: 47,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },

  // Calendar popup
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 45, 43, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },

  calendarModal: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    elevation: 8,
  },

  calendarModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },

  calendarModalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.primary,
  },

  calendarModalSubtitle: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 5,
  },

  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  monthTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },

  monthArrow: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
  },

  monthArrowText: {
    fontSize: 27,
    color: COLORS.primary,
    lineHeight: 30,
  },

  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  weekDayCell: {
    width: '14.2857%',
    alignItems: 'center',
  },

  weekDayText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.muted,
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  calendarDayCell: {
    width: '14.2857%',
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarDay: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarDayText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },

  selectedCalendarDay: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },

  selectedCalendarDayText: {
    color: COLORS.white,
    fontWeight: '800',
  },

  selectedDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.section,
    padding: 13,
    borderRadius: 14,
    marginTop: 17,
    gap: 10,
  },

  selectedDateDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  selectedDateInfo: {
    flex: 1,
  },

  selectedDateLabel: {
    fontSize: 9,
    color: COLORS.muted,
    fontWeight: '600',
  },

  selectedDateText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '800',
    marginTop: 3,
  },

  todayTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.accent,
    backgroundColor: '#D5EAE2',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
  },

  calendarDoneButton: {
    height: 46,
    backgroundColor: COLORS.primary,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 17,
  },

  calendarDoneText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.white,
  },
});

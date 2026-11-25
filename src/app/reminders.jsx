
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  success: '#34765C',
  error: '#B94B4B',
};

const intervals = ['30m', '1 hr', '1.5h', '2 hrs', '3 hrs'];

const hourlyTimes = [
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  '11:00 PM',
];

const stickers = [
  { id: 1, icon: 'water', text: 'Drink More Water!' },
  { id: 2, icon: 'cup', text: 'Your Body Says Thanks!' },
  { id: 3, icon: 'drink', text: 'Time for a Sip!' },
  { id: 4, icon: 'waves', text: 'Stay Hydrated!' },
];

function AppIcon({ name, color = COLORS.primary, size = 20 }) {
  const icons = {
    back: <Path d="M15 18l-6-6 6-6" />,
    bell: (
      <Path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4" />
    ),
    sun: (
      <>
        <Circle cx="12" cy="12" r="4" />
        <Path d="M12 2v2 M12 20v2 M4.93 4.93l1.42 1.42 M17.65 17.65l1.42 1.42 M2 12h2 M20 12h2 M4.93 19.07l-1.42 1.42 M17.65 6.35l1.42-1.42" />
      </>
    ),
    moon: <Path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13z" />,
    water: <Path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13z" />,
    cup: (
      <>
        <Path d="M5 5h14l-1 15H6L5 5z" />
        <Path d="M8 9h8 M8 13h8 M9 2h6" />
      </>
    ),
    drink: (
      <>
        <Path d="M12 3v7 M9 6h6 M7 13h10 M5 16h14 M8 13v3 M16 13v3" />
        <Path d="M12 10a5 5 0 0 0-5 5 M12 10a5 5 0 0 1 5 5" />
      </>
    ),
    waves: (
      <Path d="M3 9c3-3 6 3 9 0s6 3 9 0 M3 15c3-3 6 3 9 0s6 3 9 0" />
    ),
    test: (
      <>
        <Path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <Path d="M12 8v8 M8 12h8" />
      </>
    ),
    home: (
      <Path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />
    ),
    chart: <Path d="M4 19V10 M10 19V5 M16 19v-8 M22 19H2" />,
    plus: <Path d="M12 5v14 M5 12h14" />,
    clock: <Path d="M12 7v5l3 2 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />,
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

function HeaderLogo() {
  return (
    <View style={styles.logoCircle}>
      <Svg width={29} height={29} viewBox="0 0 88 88">
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

function TimePickerModal({
  visible,
  selectedType,
  selectedTime,
  onSelect,
  onClose,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.timeModalOverlay}>
        <View style={styles.timeModal}>
          <View style={styles.timeModalHeader}>
            <View>
              <Text style={styles.timeModalTitle}>
                Choose {selectedType} Time
              </Text>
              <Text style={styles.timeModalSubtitle}>
                Select your preferred hour
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={styles.timeModalClose}
              hitSlop={8}
            >
              <Text style={styles.timeModalCloseText}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.timeOptionsScroll}
            showsVerticalScrollIndicator={false}
          >
            {hourlyTimes.map((time) => {
              const selected = selectedTime === time;

              return (
                <Pressable
                  key={time}
                  onPress={() => onSelect(time)}
                  style={[
                    styles.timeOption,
                    selected && styles.timeOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      selected && styles.timeOptionTextSelected,
                    ]}
                  >
                    {time}
                  </Text>

                  {selected && (
                    <Text style={styles.timeOptionCheck}>✓</Text>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function RemindersScreen() {
  const router = useRouter();

  const [enabled, setEnabled] = useState(true);
  const [interval, setInterval] = useState('2 hrs');
  const [startTime, setStartTime] = useState('8:00 AM');
  const [endTime, setEndTime] = useState('10:00 PM');
  const [activeStickers, setActiveStickers] = useState([1, 2, 3, 4]);

  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTimeType, setSelectedTimeType] = useState('Start');

  const toggleSticker = (id) => {
    setActiveStickers((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const chooseTime = (type) => {
    setSelectedTimeType(type);
    setTimePickerVisible(true);
  };

  const selectTime = (time) => {
    if (selectedTimeType === 'Start') {
      setStartTime(time);
    } else {
      setEndTime(time);
    }

    setTimePickerVisible(false);
  };

  const sendTest = () => {
    Alert.alert(
      'Test Notification',
      'This is a sample H2Oasis reminder. Stay hydrated and keep flowing!'
    );
  };

  const selectedTime =
    selectedTimeType === 'Start' ? startTime : endTime;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
          {/* Top header */}
          <View style={styles.topHeader}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <AppIcon name="back" size={22} />
            </Pressable>

            <View style={styles.brand}>
              <HeaderLogo />
              <Text style={styles.brandName}>
                H2<Text style={styles.brandSmallO}>o</Text>asis
              </Text>
            </View>

            <Pressable
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.profileInitial}>P</Text>
            </Pressable>
          </View>

          {/* Page title */}
          <View style={styles.pageHeading}>
            <View>
              <Text style={styles.pageTitle}>Hydration Reminders</Text>
              <Text style={styles.pageSubtitle}>
                Never miss a sip again!
              </Text>
            </View>

            <View style={styles.headingIcon}>
              <AppIcon name="bell" size={19} color={COLORS.accent} />
            </View>
          </View>

          {/* Reminder toggle */}
          <View style={styles.reminderToggleCard}>
            <View style={styles.largeIcon}>
              <AppIcon name="bell" size={21} />
            </View>

            <View style={styles.toggleText}>
              <Text style={styles.cardTitle}>Hydration Reminders</Text>
              <Text style={styles.cardSubtitle}>
                Receive gentle reminders to drink water.
              </Text>
            </View>

            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{
                false: '#D7E2DC',
                true: COLORS.primary,
              }}
              thumbColor={COLORS.white}
              ios_backgroundColor="#D7E2DC"
            />
          </View>

          {/* Reminder interval */}
          <View style={styles.card}>
            <SectionHeading
              title="Reminder Interval"
              subtitle="How often would you like to be reminded?"
            />

            <View style={styles.intervalRow}>
              {intervals.map((item) => {
                const selected = interval === item;

                return (
                  <Pressable
                    key={item}
                    style={[
                      styles.intervalButton,
                      selected && styles.intervalSelected,
                    ]}
                    onPress={() => setInterval(item)}
                  >
                    <Text
                      style={[
                        styles.intervalText,
                        selected && styles.intervalTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.defaultInfo}>
              <AppIcon name="clock" size={12} color={COLORS.accent} />
              <Text style={styles.defaultText}>
                Default: Every 2 hours
              </Text>
            </View>
          </View>

          {/* Reminder schedule */}
          <View style={styles.card}>
            <SectionHeading
              title="Reminder Schedule"
              subtitle="Set your preferred time range."
            />

            <View style={styles.scheduleRow}>
              <Pressable
                style={styles.timeBox}
                onPress={() => chooseTime('Start')}
              >
                <Text style={styles.timeLabel}>Start Time</Text>

                <View style={styles.timeValueRow}>
                  <AppIcon name="sun" size={19} />
                  <Text style={styles.timeValue}>{startTime}</Text>
                </View>
              </Pressable>

              <Text style={styles.toText}>to</Text>

              <Pressable
                style={styles.timeBox}
                onPress={() => chooseTime('End')}
              >
                <Text style={styles.timeLabel}>End Time</Text>

                <View style={styles.timeValueRow}>
                  <AppIcon name="moon" size={19} />
                  <Text style={styles.timeValue}>{endTime}</Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.scheduleInfo}>
              <AppIcon name="clock" size={12} color={COLORS.accent} />
              <Text style={styles.scheduleInfoText}>
                Reminders will only be sent between active hours.
              </Text>
            </View>
          </View>

          {/* Motivational stickers */}
          <View style={styles.card}>
            <View style={styles.stickerHeading}>
              <SectionHeading
                title="Motivational Stickers"
                subtitle="Keep the motivation going!"
              />

              <View style={styles.activeBadge}>
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>

            <View style={styles.stickerGrid}>
              {stickers.map((sticker) => {
                const selected = activeStickers.includes(sticker.id);

                return (
                  <Pressable
                    key={sticker.id}
                    style={[
                      styles.stickerItem,
                      !selected && styles.stickerInactive,
                    ]}
                    onPress={() => toggleSticker(sticker.id)}
                  >
                    <View style={styles.stickerIcon}>
                      <AppIcon
                        name={sticker.icon}
                        size={23}
                        color={COLORS.accent}
                      />
                    </View>

                    <Text style={styles.stickerText}>
                      {sticker.text}
                    </Text>

                    {!selected && (
                      <Text style={styles.stickerOff}>Off</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Test notification */}
          <View style={styles.testCard}>
            <View style={styles.testIcon}>
              <AppIcon name="test" size={21} />
            </View>

            <View style={styles.testText}>
              <Text style={styles.cardTitle}>Test Notification</Text>
              <Text style={styles.cardSubtitle}>
                Try receiving a reminder now.
              </Text>
            </View>

            <Pressable style={styles.testButton} onPress={sendTest}>
              <Text style={styles.testButtonText}>Send</Text>
              <Text style={styles.testButtonText}>Test</Text>
            </Pressable>

            <View style={styles.testNote}>
              <AppIcon name="bell" size={12} color={COLORS.accent} />
              <Text style={styles.testNoteText}>
                Sends a sample alert to check your device notification settings.
              </Text>
            </View>
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
            onPress={() => router.replace('/dashboard')}
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

      {/* Hourly time selector */}
      <TimePickerModal
        visible={timePickerVisible}
        selectedType={selectedTimeType}
        selectedTime={selectedTime}
        onSelect={selectTime}
        onClose={() => setTimePickerVisible(false)}
      />
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
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 28,
  },

  topHeader: {
    height: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  backButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    marginLeft: 5,
  },

  logoCircle: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.6,
  },

  brandSmallO: {
    fontSize: 17,
    fontWeight: '800',
  },

  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileInitial: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },

  pageHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },

  pageSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },

  headingIcon: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#BDECE5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  reminderToggleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
  },

  largeIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
  },

  toggleText: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },

  cardSubtitle: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 3,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 19,
    marginBottom: 19,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
  },

  sectionHeading: {
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },

  sectionSubtitle: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 3,
  },

  intervalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },

  intervalButton: {
    flex: 1,
    height: 38,
    borderRadius: 18,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
  },

  intervalSelected: {
    backgroundColor: COLORS.primary,
  },

  intervalText: {
    fontSize: 9,
    color: COLORS.muted,
    fontWeight: '600',
  },

  intervalTextSelected: {
    color: COLORS.white,
    fontWeight: '800',
  },

  defaultInfo: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.section,
    borderRadius: 15,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginTop: 13,
  },

  defaultText: {
    fontSize: 8,
    color: COLORS.muted,
    fontWeight: '600',
  },

  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  timeBox: {
    flex: 1,
    backgroundColor: COLORS.section,
    borderRadius: 12,
    padding: 13,
    minHeight: 76,
    justifyContent: 'center',
  },

  timeLabel: {
    fontSize: 8,
    color: COLORS.muted,
    marginBottom: 8,
  },

  timeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  timeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },

  toText: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: '600',
  },

  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 13,
  },

  scheduleInfoText: {
    fontSize: 8,
    color: COLORS.muted,
  },

  stickerHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  activeBadge: {
    backgroundColor: '#C9F0E9',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },

  activeText: {
    fontSize: 8,
    color: COLORS.accent,
    fontWeight: '700',
  },

  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  stickerItem: {
    width: '48%',
    minHeight: 115,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
  },

  stickerInactive: {
    opacity: 0.45,
  },

  stickerIcon: {
    width: 45,
    height: 45,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  stickerText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },

  stickerOff: {
    fontSize: 8,
    color: COLORS.error,
    marginTop: 4,
  },

  testCard: {
    backgroundColor: '#EDF3EF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 10,
  },

  testIcon: {
    width: 43,
    height: 43,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  testText: {
    flex: 1,
  },

  testButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    minWidth: 70,
    paddingHorizontal: 13,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  testButtonText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
  },

  testNote: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },

  testNoteText: {
    flex: 1,
    fontSize: 8,
    color: COLORS.muted,
    lineHeight: 12,
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

  // Hourly time picker modal
  timeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 48, 45, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  timeModal: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '75%',
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 20,
  },

  timeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  timeModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },

  timeModalSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },

  timeModalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
  },

  timeModalCloseText: {
    fontSize: 23,
    color: COLORS.primary,
    lineHeight: 26,
  },

  timeOptionsScroll: {
    maxHeight: 380,
  },

  timeOption: {
    minHeight: 45,
    borderRadius: 12,
    backgroundColor: COLORS.section,
    paddingHorizontal: 15,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  timeOptionSelected: {
    backgroundColor: COLORS.primary,
  },

  timeOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },

  timeOptionTextSelected: {
    color: COLORS.white,
  },

  timeOptionCheck: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
});

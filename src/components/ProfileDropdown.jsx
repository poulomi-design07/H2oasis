
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ProfileDropdown() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const openProfileSettings = () => {
    setVisible(false);
    router.push('/profile');
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={styles.profileButton}
      >
        <Text style={styles.profileIcon}>👤</Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.background}
            onPress={() => setVisible(false)}
          />

          <View style={styles.dropdown}>
            <Pressable
              style={styles.menuItem}
              onPress={openProfileSettings}
            >
              <Text style={styles.menuText}>
                Profile Settings
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    fontSize: 25,
  },
  overlay: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  dropdown: {
    position: 'absolute',
    top: 65,
    right: 15,
    width: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  menuItem: {
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 15,
    color: '#222222',
    fontWeight: '500',
  },
});

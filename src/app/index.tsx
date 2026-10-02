import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'Onboarding' | 'Home' | 'Profile'>('Onboarding');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState<{ firstName: string; email: string }>({ firstName: '', email: '' });

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem('profileData');
        if (data) {
          setProfile(JSON.parse(data));
          setCurrentScreen('Home');
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const isFormValid = firstName.trim().length > 0 && email.trim().length > 0;

  const handleNext = async () => {
    if (isFormValid) {
      const data = { firstName, email };
      try {
        await AsyncStorage.setItem('profileData', JSON.stringify(data));
      } catch (e) {
        console.log(e);
      }
      setProfile(data);
      setCurrentScreen('Home');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log(e);
    }
    setFirstName('');
    setEmail('');
    setProfile({ firstName: '', email: '' });
    setCurrentScreen('Onboarding');
  };

  const menuItems = [
    { id: '1', title: 'Greek Salad', price: '$12.99', description: 'Crispy lettuce, peppers, olives, and feta.' },
    { id: '2', title: 'Bruschetta', price: '$7.99', description: 'Grilled bread smeared with garlic and tomatoes.' },
    { id: '3', title: 'Grilled Fish', price: '$20.00', description: 'Fresh fish cooked on the grill with lemon.' },
  ];

  return (
    <View style={styles.container}>
      {/* ONBOARDING SCREEN */}
      {currentScreen === 'Onboarding' && (
        <View style={styles.screen}>
          <Text style={styles.title}>Little Lemon</Text>
          <Text style={styles.subtitle}>Let us get to know you</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Pressable
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            disabled={!isFormValid}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        </View>
      )}

      {/* HOME SCREEN */}
      {currentScreen === 'Home' && (
        <View style={styles.screen}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Little Lemon Chicago</Text>
            <Pressable onPress={() => setCurrentScreen('Profile')}>
              <Text style={styles.link}>Profile</Text>
            </Pressable>
          </View>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.menuItem}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* PROFILE SCREEN */}
      {currentScreen === 'Profile' && (
        <View style={styles.screen}>
          <View style={styles.header}>
            <Pressable onPress={() => setCurrentScreen('Home')}>
              <Text style={styles.link}>← Back</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
          <Text style={styles.subtitle}>Personal Information</Text>
          <Text style={styles.infoText}>Name: {profile.firstName}</Text>
          <Text style={styles.infoText}>Email: {profile.email}</Text>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log out</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  screen: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#495E57' },
  subtitle: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#495E57', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  logoutButton: { backgroundColor: '#F4CE14', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  link: { color: '#495E57', fontWeight: 'bold', fontSize: 16 },
  menuItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemTitle: { fontSize: 18, fontWeight: 'bold' },
  itemPrice: { marginTop: 5, fontWeight: 'bold', color: '#495E57' },
  infoText: { fontSize: 16, marginBottom: 10 },
});
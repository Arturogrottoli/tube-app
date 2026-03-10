import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../src/services/supabase';

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/login');
    }
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.emailText}>{user?.email}</Text>
          <Text style={styles.statusBadge}>Cuenta Activa</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Básico</Text>
            <Text style={styles.statLabel}>Plan</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Nube</Text>
            <Text style={styles.statLabel}>Sincro</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center' },
  profileHeader: { alignItems: 'center', marginBottom: 40 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  emailText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  statusBadge: { 
    color: '#FF0000', 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statBox: {
    flex: 0.48,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 12, marginTop: 5 },
  logoutButton: {
    width: '100%',
    backgroundColor: 'rgba(255,68,68,0.1)',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.2)',
    marginBottom: 20,
  },
  logoutText: { color: '#ff4444', fontWeight: 'bold', fontSize: 16 },
  backButton: { padding: 10 },
  backText: { color: '#888', fontSize: 14 }
});

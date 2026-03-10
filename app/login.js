import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../src/services/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        Alert.alert('¡Éxito!', 'Revisá tu email para confirmar la cuenta.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace('/');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.branding}>Pocket<Text style={{color: '#FF0000'}}>Tube</Text></Text>
          <Text style={styles.subtitle}>{isRegistering ? 'Crear una cuenta nueva' : 'Bienvenido de nuevo'}</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={styles.authButton} 
            onPress={handleAuth} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>
                {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton} 
            onPress={() => setIsRegistering(!isRegistering)}
          >
            <Text style={styles.switchText}>
              {isRegistering ? '¿Ya tenés cuenta? Entrá acá' : '¿No tenés cuenta? Create una'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 50 },
  branding: { fontSize: 40, fontWeight: '900', color: '#fff' },
  subtitle: { color: '#888', fontSize: 16, marginTop: 10 },
  form: { width: '100%' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    color: '#fff',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#FF0000',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  switchButton: { marginTop: 25, alignItems: 'center' },
  switchText: { color: '#888', fontSize: 14 },
});

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getVideoInfo, downloadFile, BASE_URL } from '../src/services/api';
import { supabase } from '../src/services/supabase';

const { width } = Dimensions.get('window');

export default function Home() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      }
    };
    checkUser();

    console.log('====================================');
    console.log('[PocketTube] APP INICIADA - VERSIÓN 1.2 Auth');
    console.log('====================================');
  }, []);

  const handleGetInfo = async () => {
    console.log('[Home] Botón BUSCAR presionado. URL actual:', url);
    if (!url) {
      Alert.alert('Error', 'Por favor ingresa un link de YouTube');
      return;
    }

    // Limpiar URL de YouTube (quitar playlists, trackers, etc)
    let cleanUrl = url;
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('youtube.com')) {
                const videoId = urlObj.searchParams.get('v');
                if (videoId) cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
            } else if (urlObj.hostname.includes('youtu.be')) {
                cleanUrl = `https://www.youtube.com/watch?v=${urlObj.pathname.substring(1)}`;
            }
            console.log('[Home] URL Limpiada:', cleanUrl);
        } catch (e) {
            console.warn('[Home] Error al limpiar URL:', e);
        }
    }
    
    setLoading(true);
    setVideoInfo(null);
    console.log('[Home] Iniciando búsqueda para:', url);

    try {
      const info = await getVideoInfo(url);
      setVideoInfo(info);
    } catch (error) {
      console.error('[Home] Error al obtener info:', error);
      Alert.alert(
        'Error de Conexión', 
        'No se pudo conectar con el servidor. Verifica que estés conectado a internet y que el servidor esté activo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    console.log(`[Home] Botón DESCARGA (${format}) presionado.`);
    setDownloading(true);
    setProgress(0);
    try {
      console.log(`[Home] Iniciante descarga (${format}) para: ${videoInfo.title}`);
      const { fileName } = await downloadFile(url, format, videoInfo?.title, (p) => setProgress(p));
      Alert.alert('¡Éxito!', `El archivo se guardó como: ${fileName}`);
      setVideoInfo(null);
      setUrl('');
    } catch (error) {
      console.error('[Home] Error en descarga:', error);
      Alert.alert('Error', 'Hubo un problema con la descarga.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['#1a1a1a', '#0a0a0a']}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.profileBtn}
              onPress={() => router.push('/profile')}
            >
              <Text style={{fontSize: 20}}>👤</Text>
            </TouchableOpacity>
            <Text style={styles.branding}>Pocket<Text style={{color: '#FF0000'}}>Tube</Text></Text>
            <Text style={styles.subtitle}>Descarga tu contenido favorito</Text>
            <Text style={{color: '#444', fontSize: 10, marginTop: 5}}>v1.2 Auth Active</Text>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Pega la URL aquí..."
              placeholderTextColor="#666"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleGetInfo} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.searchButtonText}>Buscar</Text>
              )}
            </TouchableOpacity>
          </View>

          {videoInfo && (
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Image source={{ uri: videoInfo.thumbnail }} style={styles.thumbnail} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.thumbnailOverlay}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.videoTitle} numberOfLines={2}>{videoInfo.title}</Text>
                  <Text style={styles.videoUploader}>{videoInfo.uploader} • {videoInfo.duration}</Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={[styles.downloadBtn, { backgroundColor: '#FF0000' }]}
                    onPress={() => handleDownload('mp4')}
                    disabled={downloading}
                  >
                    <Text style={styles.btnText}>MP4</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.downloadBtn, { backgroundColor: '#333' }]}
                    onPress={() => handleDownload('mp3')}
                    disabled={downloading}
                  >
                    <Text style={styles.btnText}>MP3</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {downloading && (
            <View style={styles.loaderContainer}>
              <Text style={styles.loaderText}>Procesando... {Math.round(progress * 100)}%</Text>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#FF0000', '#aa0000']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[styles.progressFill, { width: `${progress * 100}%` }]}
                />
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={styles.libraryNav} 
            onPress={() => router.push('/library')}
          >
            <Text style={styles.libraryNavText}>Ir a mi Librería</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 60, marginBottom: 30, alignItems: 'center' },
  branding: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  subtitle: { color: '#888', fontSize: 14, marginTop: 5 },
  profileBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 30,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingHorizontal: 15,
    fontSize: 16,
    height: 50,
  },
  searchButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: { color: '#fff', fontWeight: 'bold' },
  cardContainer: { marginBottom: 20 },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  thumbnail: { width: '100%', height: 210 },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 210,
  },
  cardInfo: { padding: 20 },
  videoTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  videoUploader: { color: '#aaa', fontSize: 14 },
  actionRow: {
    flexDirection: 'row',
    padding: 15,
    paddingTop: 0,
    justifyContent: 'space-between'
  },
  downloadBtn: {
    flex: 0.48,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  loaderContainer: { marginVertical: 20, alignItems: 'center' },
  loaderText: { color: '#fff', marginBottom: 12, fontSize: 14, fontWeight: '500' },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: { height: '100%', borderRadius: 4 },
  libraryNav: {
    marginTop: 20,
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  libraryNavText: { color: '#aaa', fontWeight: '600' }
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getVideoInfo, downloadFile } from '../src/services/api';

export default function Home() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleGetInfo = async () => {
    if (!url) {
      Alert.alert('Error', 'Por favor, pega una URL de YouTube.');
      return;
    }
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      Alert.alert('Error', 'La URL no parece ser de YouTube.');
      return;
    }
    setLoading(true);
    try {
      const info = await getVideoInfo(url);
      setVideoInfo(info);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la información del video. Revisa la URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    setDownloading(true);
    setProgress(0);
    try {
      const { fileName } = await downloadFile(url, format, videoInfo?.title, (p) => setProgress(p));
      Alert.alert('Éxito', `Descargado: ${fileName}`);
      setVideoInfo(null);
      setUrl('');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con la descarga.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pega la URL de YouTube aquí..."
          placeholderTextColor="#888"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleGetInfo} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Obtener Info</Text>}
        </TouchableOpacity>
      </View>

      {videoInfo && (
        <View style={styles.card}>
          <Image source={{ uri: videoInfo.thumbnail }} style={styles.thumbnail} />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>{videoInfo.title}</Text>
            <Text style={styles.uploader}>{videoInfo.uploader}</Text>
            <Text style={styles.duration}>Duración: {videoInfo.duration}</Text>
          </View>

          <View style={styles.downloadOptions}>
            <TouchableOpacity 
              style={[styles.downloadButton, { backgroundColor: '#FF0000' }]} 
              onPress={() => handleDownload('mp4')}
              disabled={downloading}
            >
              <Text style={styles.buttonText}>Video (MP4)</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.downloadButton, { backgroundColor: '#1DB954' }]} 
              onPress={() => handleDownload('mp3')}
              disabled={downloading}
            >
              <Text style={styles.buttonText}>Audio (MP3)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {downloading && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Descargando... {Math.round(progress * 100)}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={styles.libraryButton} 
        onPress={() => router.push('/library')}
      >
        <Text style={styles.buttonText}>Ir a mi Librería</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#121212' },
  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  thumbnail: { width: '100%', height: 200 },
  info: { padding: 15 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  uploader: { color: '#aaa', fontSize: 14, marginBottom: 5 },
  duration: { color: '#888', fontSize: 12 },
  downloadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  downloadButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  progressContainer: { marginBottom: 20, alignItems: 'center' },
  progressText: { color: '#fff', marginBottom: 10 },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#FF0000' },
  libraryButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
});

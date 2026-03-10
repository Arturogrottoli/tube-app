import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Player() {
  const { fileName } = useLocalSearchParams();
  const fileUri = FileSystem.documentDirectory + fileName;
  const isAudio = fileName.endsWith('.mp3');
  const [status, setStatus] = useState({});

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.container}>
      <View style={styles.content}>
        {isAudio ? (
          <View style={styles.audioCard}>
             <LinearGradient
               colors={['#333', '#222']}
               style={styles.iconCircle}
             >
                <Text style={styles.audioIcon}>🎵</Text>
             </LinearGradient>
             <Text style={styles.title} numberOfLines={2}>
               {fileName.replace('PocketTube_', '').replace('.mp3', '')}
             </Text>
             <Text style={styles.subtitle}>Reproduciendo Audio</Text>
             
             <Video
              source={{ uri: fileUri }}
              useNativeControls
              resizeMode="contain"
              shouldPlay
              style={styles.hiddenVideo} 
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          </View>
        ) : (
          <View style={styles.videoCard}>
            <View style={styles.videoWrapper}>
              <Video
                source={{ uri: fileUri }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                shouldPlay
                useNativeControls
                style={styles.video}
                onPlaybackStatusUpdate={status => setStatus(() => status)}
              />
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.title}>
                {fileName.replace('PocketTube_', '').replace('.mp4', '')}
              </Text>
              <Text style={styles.subtitle}>Reproduciendo Video</Text>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  audioCard: { 
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderRadius: 30, 
    padding: 40, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  videoCard: { width: '100%', alignItems: 'center' },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#000',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  audioIcon: { fontSize: 70 },
  title: { 
    color: '#fff', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  subtitle: { color: '#FF0000', fontSize: 14, fontWeight: '600', marginBottom: 30 },
  videoInfo: { marginTop: 30, alignItems: 'center' },
  video: { width: '100%', height: '100%' },
  hiddenVideo: { width: '100%', height: 45, marginTop: 20 }, 
});

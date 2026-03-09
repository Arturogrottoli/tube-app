import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Video, Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';

export default function Player() {
  const { fileName } = useLocalSearchParams();
  const fileUri = FileSystem.documentDirectory + fileName;
  const isAudio = fileName.endsWith('.mp3');
  const [status, setStatus] = useState({});

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isAudio ? (
          <View style={styles.audioCard}>
             <View style={styles.iconCircle}>
                <Text style={styles.audioIcon}>🎵</Text>
             </View>
             <Text style={styles.title}>{fileName.replace('PocketTube_', '')}</Text>
             <Video
              source={{ uri: fileUri }}
              useNativeControls
              resizeMode="contain"
              isLooping
              style={styles.hiddenVideo} 
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          </View>
        ) : (
          <View style={styles.videoCard}>
            <Text style={styles.title}>{fileName.replace('PocketTube_', '')}</Text>
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
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  audioCard: { 
    backgroundColor: '#1e1e1e', 
    borderRadius: 20, 
    padding: 30, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10
  },
  videoCard: { width: '100%' },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  audioIcon: { fontSize: 60 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  video: { width: '100%', height: 300, borderRadius: 12 },
  hiddenVideo: { width: '100%', height: 45 }, 
});

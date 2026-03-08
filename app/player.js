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
      <Text style={styles.title}>{fileName.replace('PocketTube_', '')}</Text>
      
      {isAudio ? (
          <View style={styles.audioContainer}>
               <Text style={styles.audioIcon}>🎵</Text>
               <Video
                source={{ uri: fileUri }}
                useNativeControls
                resizeMode="contain"
                isLooping
                style={styles.hiddenVideo} // Use Video component even for audio to get native controls easily
                onPlaybackStatusUpdate={status => setStatus(() => status)}
              />
          </View>
      ) : (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 18, marginBottom: 20, textAlign: 'center', paddingHorizontal: 20 },
  video: { width: '100%', height: 300 },
  audioContainer: { alignItems: 'center', width: '100%' },
  audioIcon: { fontSize: 100, marginBottom: 20 },
  hiddenVideo: { width: '100%', height: 50 }, // Small height just for controls
});

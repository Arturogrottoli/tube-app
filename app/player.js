import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export default function Player() {
  const { fileName } = useLocalSearchParams();
  const fileUri = FileSystem.documentDirectory + fileName;
  const isAudio = fileName.endsWith('.mp3');
  const [status, setStatus] = useState({});
  const videoRef = React.useRef(null);
  
  // Progress states
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const onPlaybackStatusUpdate = (status) => {
    setStatus(status);
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
    }
  };

  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSlidingComplete = async (value) => {
    if (videoRef.current) {
      await videoRef.current.setStatusAsync({ positionMillis: value });
    }
  };

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
             
             <View style={styles.sliderContainer}>
               <Slider
                 style={styles.slider}
                 minimumValue={0}
                 maximumValue={duration}
                 value={position}
                 minimumTrackTintColor="#FF0000"
                 maximumTrackTintColor="rgba(255,255,255,0.1)"
                 thumbTintColor="#FF0000"
                 onSlidingComplete={handleSlidingComplete}
               />
               <View style={styles.timeRow}>
                 <Text style={styles.timeText}>{formatTime(position)}</Text>
                 <Text style={styles.timeText}>{formatTime(duration)}</Text>
               </View>
             </View>

             <Video
              ref={videoRef}
              source={{ uri: fileUri }}
              useNativeControls
              resizeMode="contain"
              shouldPlay
              style={styles.hiddenVideo} 
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />
          </View>
        ) : (
          <View style={styles.videoCard}>
            <View style={styles.videoWrapper}>
              <Video
                ref={videoRef}
                source={{ uri: fileUri }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                shouldPlay
                useNativeControls
                style={styles.video}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              />
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.title}>
                {fileName.replace('PocketTube_', '').replace('.mp4', '')}
              </Text>
              <Text style={styles.subtitle}>Reproduciendo Video</Text>
              
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={duration}
                  value={position}
                  minimumTrackTintColor="#FF0000"
                  maximumTrackTintColor="rgba(255,255,255,0.1)"
                  thumbTintColor="#FF0000"
                  onSlidingComplete={handleSlidingComplete}
                />
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{formatTime(position)}</Text>
                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
              </View>
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
  videoInfo: { marginTop: 30, alignItems: 'center', width: '100%' },
  video: { width: '100%', height: '100%' },
  hiddenVideo: { width: '100%', height: 45, marginTop: 20 },
  sliderContainer: { width: '100%', marginTop: 10 },
  slider: { width: '100%', height: 40 },
  timeRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 5,
    marginTop: -10
  },
  timeText: { color: '#888', fontSize: 12 },
});

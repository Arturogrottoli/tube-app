import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Library() {
  const [files, setFiles] = useState([]);
  const router = useRouter();

  const loadFiles = async () => {
    try {
      const directory = FileSystem.documentDirectory;
      const fileNames = await FileSystem.readDirectoryAsync(directory);
      const pocketFiles = fileNames.filter(name => name.startsWith('PocketTube_'));
      setFiles(pocketFiles);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const deleteFile = async (name) => {
    Alert.alert(
      'Eliminar',
      '¿Estás seguro de que quieres borrar este archivo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            await FileSystem.deleteAsync(FileSystem.documentDirectory + name);
            loadFiles();
          }
        },
      ]
    );
  };

  const clearLibrary = async () => {
    if (files.length === 0) return;
    
    Alert.alert(
      'Limpiar Librería',
      '¿Estás seguro de que quieres borrar TODAS las descargas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Borrar Todo', 
          style: 'destructive',
          onPress: async () => {
            for (const file of files) {
              await FileSystem.deleteAsync(FileSystem.documentDirectory + file);
            }
            loadFiles();
          }
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.container}>
      <FlatList
        data={files}
        contentContainerStyle={{ padding: 20 }}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.fileCard}
            onPress={() => router.push({ pathname: '/player', params: { fileName: item } })}
          >
            <View style={styles.iconBox}>
               <Text style={styles.iconText}>{item.endsWith('.mp3') ? '🎵' : '🎬'}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.fileName} numberOfLines={1}>{item.replace('PocketTube_', '')}</Text>
              <Text style={styles.fileType}>{item.endsWith('.mp3') ? 'Audio MP3' : 'Video MP4'}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteFile(item)} style={styles.deleteBox}>
              <Text style={{ fontSize: 18 }}>🗑️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyText}>Tu galería está vacía</Text>
            <Text style={styles.emptySub}>Descarga algo para empezar</Text>
          </View>
        }
        ListFooterComponent={files.length > 0 ? (
          <TouchableOpacity style={styles.clearBtn} onPress={clearLibrary}>
            <Text style={styles.clearText}>Vaciar Librería</Text>
          </TouchableOpacity>
        ) : null}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fileCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconText: { fontSize: 24 },
  infoBox: { flex: 1, marginLeft: 15 },
  fileName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  fileType: { color: '#888', fontSize: 12, marginTop: 4 },
  deleteBox: { padding: 10 },
  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyIcon: { fontSize: 64, marginBottom: 20, opacity: 0.5 },
  emptyText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  emptySub: { color: '#666', fontSize: 14, marginTop: 10 },
  clearBtn: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.2)',
    marginBottom: 40,
  },
  clearText: { color: '#ff4444', fontWeight: 'bold' },
});

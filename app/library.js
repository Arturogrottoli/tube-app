import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

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

  return (
    <View style={styles.container}>
      <FlatList
        data={files}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.fileItem}>
            <TouchableOpacity 
              style={styles.fileInfo}
              onPress={() => router.push({ pathname: '/player', params: { fileName: item } })}
            >
              <Text style={styles.fileName}>{item.replace('PocketTube_', '')}</Text>
              <Text style={styles.fileType}>{item.endsWith('.mp3') ? '🎵 Audio' : '🎬 Video'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteFile(item)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay descargas aún.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 10 },
  fileItem: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileInfo: { flex: 1 },
  fileName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  fileType: { color: '#aaa', fontSize: 12, marginTop: 4 },
  deleteBtn: { padding: 10 },
  deleteText: { fontSize: 20 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 50, fontSize: 16 },
});

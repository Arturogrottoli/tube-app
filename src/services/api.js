import * as FileSystem from 'expo-file-system';

const BASE_URL = 'http://192.168.1.10:3000'; // Replace with your computer's IP for local testing, or Render URL for production

export const getVideoInfo = async (url) => {
  try {
    const response = await fetch(`${BASE_URL}/info?url=${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error('Error al obtener info del video');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const downloadFile = async (url, format, title, onProgress) => {
  const isAudio = format === 'mp3';
  const fileName = `PocketTube_${Date.now()}.${isAudio ? 'mp3' : 'mp4'}`;
  const fileUri = FileSystem.documentDirectory + fileName;

  const downloadResumable = FileSystem.createDownloadResumable(
    `${BASE_URL}/download?url=${encodeURIComponent(url)}&format=${format}&title=${encodeURIComponent(title || '')}`,
    fileUri,
    {},
    (downloadProgress) => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      if (onProgress) onProgress(progress);
    }
  );

  try {
    const { uri } = await downloadResumable.downloadAsync();
    return { uri, fileName, isAudio };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

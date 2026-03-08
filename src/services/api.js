import * as FileSystem from 'expo-file-system';

const BASE_URL = 'http://YOUR_BACKEND_URL'; // Replace with Railway URL after deploy

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

export const downloadFile = async (url, format, onProgress) => {
  const isAudio = format === 'mp3';
  const fileName = `PocketTube_${Date.now()}.${isAudio ? 'mp3' : 'mp4'}`;
  const fileUri = FileSystem.documentDirectory + fileName;

  const downloadResumable = FileSystem.createDownloadResumable(
    `${BASE_URL}/download?url=${encodeURIComponent(url)}&format=${format}`,
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

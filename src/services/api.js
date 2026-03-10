import * as FileSystem from 'expo-file-system';

export const BASE_URL = 'https://tube-backend-unvp.onrender.com'; // Your Render backend URL

export const getVideoInfo = async (url) => {
  try {
    const infoUrl = `${BASE_URL}/info?url=${encodeURIComponent(url)}`;
    console.log('Fetching:', infoUrl);
    const response = await fetch(infoUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response not OK:', response.status, errorText);
      throw new Error('Error al obtener info del video');
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
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

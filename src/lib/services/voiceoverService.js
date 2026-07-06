// lib/services/voiceoverService.js

import { storage, db } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

const DEFAULT_VOICE_ID = "OUx0z7RTt92glw2BYS4R";

export async function generateVoiceover(contentId, collectionName, text, voiceId = DEFAULT_VOICE_ID) {
  try {
    if (!contentId) {
      throw new Error('Content ID is required. Please save the story first.');
    }

    // ─── Trim text if too long for ElevenLabs ───
    // ElevenLabs has a limit of ~5000 characters per request
    const MAX_CHARS = 4500;
    let finalText = text;
    if (finalText.length > MAX_CHARS) {
      finalText = finalText.substring(0, MAX_CHARS);
      console.warn(`⚠️ Text trimmed to ${MAX_CHARS} characters`);
    }

    const response = await fetch('/api/elevenlabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: finalText, voiceId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate audio');
    }

    const audioBlob = await response.blob();

    const timestamp = Date.now();
    const fileName = `${collectionName}/${contentId}/voiceover_${timestamp}.mp3`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, audioBlob, {
      contentType: 'audio/mpeg',
    });

    const audioUrl = await getDownloadURL(storageRef);

    await updateDoc(doc(db, collectionName, contentId), {
      voiceoverUrl: audioUrl,
      voiceoverStatus: 'completed',
      voiceoverGeneratedAt: new Date().toISOString(),
      voiceoverUpdatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      audioUrl: audioUrl,
    };
  } catch (error) {
    console.error('Voiceover generation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deleteVoiceover(contentId, collectionName, audioUrl) {
  try {
    if (audioUrl) {
      const storageRef = ref(storage, audioUrl);
      await deleteObject(storageRef);
    }

    await updateDoc(doc(db, collectionName, contentId), {
      voiceoverUrl: null,
      voiceoverStatus: null,
      voiceoverGeneratedAt: null,
      voiceoverUpdatedAt: null,
    });

    return { success: true };
  } catch (error) {
    console.error('Delete voiceover error:', error);
    return { success: false, error: error.message };
  }
}
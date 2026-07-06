import { storage, db } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

// Default voice ID - can be changed to any voice you like
const DEFAULT_VOICE_ID = "OUx0z7RTt92glw2BYS4R";

export async function generateStoryVoiceover(storyId, text, voiceId = DEFAULT_VOICE_ID) {
  try {
    // Step 1: Generate audio from ElevenLabs
    const response = await fetch('/api/elevenlabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: text,
        voiceId: voiceId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate audio');
    }

    const audioBlob = await response.blob();

    // Step 2: Upload to Firebase Storage
    const fileName = `stories/${storyId}/voiceover_${Date.now()}.mp3`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, audioBlob, {
      contentType: 'audio/mpeg',
    });

    // Step 3: Get download URL
    const audioUrl = await getDownloadURL(storageRef);

    // Step 4: Save to Firestore
    await updateDoc(doc(db, 'stories', storyId), {
      voiceoverUrl: audioUrl,
      voiceoverGeneratedAt: new Date().toISOString(),
      voiceoverUpdatedAt: new Date().toISOString(),
      voiceoverStatus: 'completed',
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

export async function deleteStoryVoiceover(storyId, audioUrl) {
  try {
    if (audioUrl) {
      const storageRef = ref(storage, audioUrl);
      await deleteObject(storageRef);
    }
    
    await updateDoc(doc(db, 'stories', storyId), {
      voiceoverUrl: null,
      voiceoverGeneratedAt: null,
      voiceoverUpdatedAt: null,
      voiceoverStatus: null,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Delete voiceover error:', error);
    return { success: false, error: error.message };
  }
}
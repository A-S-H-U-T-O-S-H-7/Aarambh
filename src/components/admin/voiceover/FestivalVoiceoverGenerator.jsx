'use client';

import { useState } from 'react';
import { 
  FaHeadphones, 
  FaSpinner, 
  FaCheck, 
  FaExclamationTriangle, 
  FaTrash,
  FaPlay,
  FaPause
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { generateVoiceover, deleteVoiceover } from '@/lib/services/voiceoverService';

export default function FestivalVoiceoverGenerator({
  contentId,
  contentText,
  collectionName = 'festivals',
  existingVoiceoverUrl = null,
  isDark = false,
  voiceId = "OUx0z7RTt92glw2BYS4R",
  onVoiceoverGenerated = null,
  // ─── Festival-specific fields ───
  title = '',
  hindiName = '',
  shortDescription = '',
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [voiceoverUrl, setVoiceoverUrl] = useState(existingVoiceoverUrl || null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async () => {
    if (!contentId) {
      toast.error('Please save the festival first before generating voiceover.');
      return;
    }

    // ─── Combine festival-specific fields ───
    const cleanTitle = title?.replace(/<[^>]*>/g, '').trim() || '';
    const cleanHindiName = hindiName?.replace(/<[^>]*>/g, '').trim() || '';
    const cleanShortDesc = shortDescription?.replace(/<[^>]*>/g, '').trim() || '';
    const cleanContent = contentText?.replace(/<[^>]*>/g, '').trim() || '';

    let fullText = '';

    // 1. Title
    if (cleanTitle) fullText += `${cleanTitle}. `;

    // 2. Hindi Name
    if (cleanHindiName) fullText += `${cleanHindiName}. `;

    // 3. Short Description
    if (cleanShortDesc) fullText += `${cleanShortDesc}. `;

    // 4. Main Content
    if (cleanContent) fullText += cleanContent;

    if (fullText.length < 20) {
      toast.error('Content is too short to generate voiceover (min 20 characters)');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateVoiceover(contentId, collectionName, fullText, voiceId);

      if (result.success) {
        setVoiceoverUrl(result.audioUrl);
        toast.success('🎙️ Voiceover generated successfully!');
        if (onVoiceoverGenerated) {
          onVoiceoverGenerated(result.audioUrl);
        }
      } else {
        setError(result.error);
        toast.error(result.error || 'Failed to generate voiceover');
      }
    } catch (error) {
      console.error('Voiceover generation error:', error);
      setError(error.message);
      toast.error('Failed to generate voiceover');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!voiceoverUrl) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteVoiceover(contentId, collectionName, voiceoverUrl);
      if (result.success) {
        setVoiceoverUrl(null);
        toast.success('Voiceover deleted successfully');
        if (onVoiceoverGenerated) {
          onVoiceoverGenerated(null);
        }
      } else {
        toast.error(result.error || 'Failed to delete voiceover');
      }
    } catch (error) {
      toast.error('Failed to delete voiceover');
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePlay = () => {
    const audio = document.getElementById(`voiceover-audio-${contentId}`);
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${
      voiceoverUrl 
        ? 'border-green-500/30 bg-green-50/30 dark:bg-green-900/20' 
        : 'border-gold/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5'
    }`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-brown-900 dark:text-cream-50 flex items-center gap-2">
              <FaHeadphones className="text-purple-500" />
              Festival Voiceover
            </h4>
            <p className="text-xs text-brown-500 dark:text-cream-50/50">
              {voiceoverUrl 
                ? '✅ Festival voiceover is ready' 
                : 'Generate a voiceover for this festival using ElevenLabs'}
            </p>
          </div>

          {voiceoverUrl ? (
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform"
              >
                {isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
              </button>
              <audio
                id={`voiceover-audio-${contentId}`}
                src={voiceoverUrl}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                className="hidden"
              />
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                title="Delete voiceover"
              >
                {isDeleting ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaTrash className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isGenerating
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
              }`}
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FaHeadphones className="w-4 h-4" />
                  Generate Festival Voiceover
                </>
              )}
            </button>
          )}
        </div>

        {voiceoverUrl && (
          <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-brown-900/50 rounded-lg border border-gold/10">
            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <FaCheck className="w-3 h-3" />
              Voiceover ready
            </span>
            <div className="flex-1">
              <audio controls className="w-full h-8">
                <source src={voiceoverUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-divine-red flex items-center gap-1">
            <FaExclamationTriangle className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
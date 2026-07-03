'use client';

import { useState, useEffect, useRef } from 'react';
import { Music, Save, Upload, Play, Pause, X, FileAudio } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SongManager({ data, onSave, isDark, saving }) {
  const [song, setSong] = useState({
    title: 'Om Namah Shivaya',
    artist: 'Anup Jalota',
    url: '',
    isPlaying: true,
    festival: 'Maha Shivaratri',
  });
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const audioPreviewRef = useRef(null);

  useEffect(() => {
    if (data) {
      setSong({
        title: data.title || 'Om Namah Shivaya',
        artist: data.artist || 'Anup Jalota',
        url: data.url || data.songUrl || '',
        isPlaying: data.isPlaying !== undefined ? data.isPlaying : true,
        festival: data.festival || 'Maha Shivaratri',
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setSong({ ...song, [field]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file (mp3, wav, ogg, etc.)');
      e.target.value = '';
      return;
    }
    
    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size should be less than 20MB');
      e.target.value = '';
      return;
    }
    
    setAudioFile(file);
    setAudioFileName(file.name);
    toast.success(`File "${file.name}" selected`);
  };

  const removeAudioFile = () => {
    setAudioFile(null);
    setAudioFileName('');
    if (audioPreviewRef.current) {
      audioPreviewRef.current.src = '';
    }
  };

  const togglePreview = () => {
    if (!song.url && !audioFile) {
      toast.error('No audio available to preview');
      return;
    }
    
    if (audioPreviewRef.current) {
      if (previewPlaying) {
        audioPreviewRef.current.pause();
        setPreviewPlaying(false);
      } else {
        // Use the uploaded file URL or existing song URL
        if (audioFile) {
          const fileUrl = URL.createObjectURL(audioFile);
          audioPreviewRef.current.src = fileUrl;
        } else if (song.url) {
          audioPreviewRef.current.src = song.url;
        }
        audioPreviewRef.current.play();
        setPreviewPlaying(true);
      }
    }
  };

  useEffect(() => {
    const audio = audioPreviewRef.current;
    if (audio) {
      const handleEnd = () => setPreviewPlaying(false);
      audio.addEventListener('ended', handleEnd);
      return () => audio.removeEventListener('ended', handleEnd);
    }
  }, []);

  const handleSubmit = async () => {
    if (!song.title?.trim()) {
      toast.error('Please enter a song title');
      return;
    }
    
    if (!song.url && !audioFile) {
      toast.error('Please upload an audio file or enter a URL');
      return;
    }
    
    setIsUploading(true);
    
    // Prepare data for save
    const saveData = {
      ...song,
      oldAudioUrl: data?.url, // Store old URL for deletion
    };
    
    const result = await onSave(saveData, audioFile);
    
    setIsUploading(false);
    
    if (result?.success) {
      setAudioFile(null);
      setAudioFileName('');
      // Refresh the audio preview
      if (audioPreviewRef.current) {
        audioPreviewRef.current.src = result.audioUrl || song.url;
      }
    }
  };

  const isFormValid = song.title?.trim() && (song.url || audioFile);

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-md' 
        : 'border-gray-200/50 bg-white shadow-md'
    }`}>
      {/* Hidden audio element for preview */}
      <audio ref={audioPreviewRef} className="hidden" />

      <div className="flex items-center gap-2.5 mb-4">
        <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
          <Music className="w-4 h-4 text-white" />
        </div>
        <h2 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
          Background Song
        </h2>
        <span className={`ml-auto text-[10px] px-2.5 py-1 rounded-full ${
          song.isPlaying 
            ? 'bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400' 
            : 'bg-gray-500/20 text-gray-600 dark:bg-gray-500/30 dark:text-gray-400'
        }`}>
          {song.isPlaying ? '● Playing' : '● Paused'}
        </span>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Song Title *
          </label>
          <input
            type="text"
            value={song.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              isDark 
                ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
            } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="Enter song title"
          />
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Artist
          </label>
          <input
            type="text"
            value={song.artist}
            onChange={(e) => handleChange('artist', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              isDark 
                ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
            } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="Enter artist name"
          />
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Upload Audio File (MP3, WAV, OGG)
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 text-gray-300' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600'
              } border`}>
                <FileAudio className="w-4 h-4" />
                <span>{audioFileName || 'Choose audio file (max 20MB)'}</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {audioFile && (
                <button
                  onClick={removeAudioFile}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Preview current audio */}
            {(song.url || audioFile) && (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50 dark:bg-gray-900/30">
                <button
                  onClick={togglePreview}
                  className={`p-1.5 rounded-full transition-colors ${
                    previewPlaying 
                      ? 'bg-yellow-500 text-white' 
                      : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {previewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {audioFileName || (song.url ? 'Current audio' : 'No audio')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            OR Enter Audio URL (YouTube embed / direct MP3)
          </label>
          <input
            type="text"
            value={song.url}
            onChange={(e) => handleChange('url', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              isDark 
                ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
            } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="https://youtube.com/embed/... or direct MP3 URL"
          />
          <p className={`text-[10px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Note: Uploaded audio file will be used instead of URL if both are provided
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Festival (Optional)
            </label>
            <input
              type="text"
              value={song.festival || ''}
              onChange={(e) => handleChange('festival', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="e.g., Maha Shivaratri"
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Status
            </label>
            <select
              value={song.isPlaying ? 'playing' : 'paused'}
              onChange={(e) => handleChange('isPlaying', e.target.value === 'playing')}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            >
              <option value="playing">▶ Playing</option>
              <option value="paused">⏸ Paused</option>
            </select>
          </div>
        </div>

        {/* Current Song Info */}
        {data && data.url && !audioFile && (
          <div className={`p-3 rounded-lg text-xs ${
            isDark ? 'bg-gray-900/50 text-gray-400' : 'bg-gray-50 text-gray-500'
          }`}>
            🎵 Current: {song.title} {song.artist && `- ${song.artist}`}
            {song.festival && ` • ${song.festival}`}
          </div>
        )}

        {audioFile && (
          <div className={`p-3 rounded-lg text-xs ${
            isDark ? 'bg-green-900/20 text-green-400 border border-green-800/30' : 'bg-green-50 text-green-600 border border-green-200'
          } border`}>
            📁 New audio file ready: {audioFileName}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving || isUploading || !isFormValid}
          className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            saving || isUploading || !isFormValid
              ? 'opacity-50 cursor-not-allowed bg-gray-400'
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {saving || isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isUploading ? 'Uploading Audio...' : 'Saving...'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> 
              Save Song
            </>
          )}
        </button>
      </div>
    </div>
  );
}
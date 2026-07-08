'use client';

import { useState, useEffect, useRef } from 'react';
import { Music, Save, Upload, Play, Pause, X, FileAudio } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SongManager({ data, onSave, isDark, saving }) {
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');
  const audioPreviewRef = useRef(null);

  useEffect(() => {
    if (data) {
      setCurrentAudioUrl(data.url || data.songUrl || '');
    }
  }, [data]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if it's an audio file - support mp3, mpeg, wav, ogg, etc.
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg3'];
    const validExtensions = ['.mp3', '.mpeg', '.wav', '.ogg', '.mpga'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    const isValidType = validTypes.includes(file.type) || validExtensions.includes(fileExtension);
    
    if (!isValidType) {
      toast.error('Please upload an audio file (mp3, mpeg, wav, ogg, etc.)');
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
      setPreviewPlaying(false);
    }
  };

  const togglePreview = () => {
    if (!audioFile && !currentAudioUrl) {
      toast.error('No audio available to preview');
      return;
    }
    
    if (audioPreviewRef.current) {
      if (previewPlaying) {
        audioPreviewRef.current.pause();
        setPreviewPlaying(false);
      } else {
        // Use the uploaded file or existing audio URL
        if (audioFile) {
          const fileUrl = URL.createObjectURL(audioFile);
          audioPreviewRef.current.src = fileUrl;
        } else if (currentAudioUrl) {
          audioPreviewRef.current.src = currentAudioUrl;
        }
        audioPreviewRef.current.play().catch(() => {
          toast.error('Failed to play audio');
        });
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
    if (!audioFile) {
      toast.error('Please upload an audio file');
      return;
    }
    
    setIsUploading(true);
    
    // Prepare data for save
    const saveData = {
      oldAudioUrl: data?.url || data?.songUrl || '', // Store old URL for deletion
    };
    
    // Pass both data and audioFile to onSave
    const result = await onSave(saveData, audioFile);
    
    setIsUploading(false);
    
    if (result?.success) {
      setAudioFile(null);
      setAudioFileName('');
      setCurrentAudioUrl(result.audioUrl || '');
      toast.success('Song saved successfully!');
    }
  };

  const isFormValid = audioFile !== null;

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
        {(data?.isPlaying !== undefined) && (
          <span className={`ml-auto text-[10px] px-2.5 py-1 rounded-full ${
            data.isPlaying 
              ? 'bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400' 
              : 'bg-gray-500/20 text-gray-600 dark:bg-gray-500/30 dark:text-gray-400'
          }`}>
            {data.isPlaying ? '● Playing' : '● Paused'}
          </span>
        )}
      </div>

      <div className="space-y-3.5">
        {/* Current Song Info */}
        {data && currentAudioUrl && !audioFile && (
          <div className={`p-3 rounded-lg text-xs ${
            isDark ? 'bg-gray-900/50 text-gray-400' : 'bg-gray-50 text-gray-500'
          }`}>
            🎵 Current audio is set
            {data.title && ` - ${data.title}`}
            {data.artist && ` by ${data.artist}`}
            {data.festival && ` • ${data.festival}`}
          </div>
        )}

        {/* Audio File Upload */}
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Upload Audio File (MP3, MPEG, WAV, OGG) *
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <label className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer border-2 border-dashed ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-600 hover:border-yellow-500 hover:bg-gray-800/50 text-gray-300' 
                  : 'bg-gray-50 border-gray-300 hover:border-yellow-400 hover:bg-gray-100 text-gray-600'
              } hover:shadow-md transition-all`}>
                <FileAudio className={`w-5 h-5 ${isDark ? 'text-yellow-500' : 'text-yellow-500'}`} />
                <span className="truncate">{audioFileName || 'Choose audio file (max 20MB)'}</span>
                <input
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,.mp3,.mpeg,.wav,.ogg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {audioFile && (
                <button
                  onClick={removeAudioFile}
                  className={`p-2.5 rounded-xl transition-colors ${
                    isDark 
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                      : 'bg-red-50 text-red-500 hover:bg-red-100'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* File info and preview */}
            {audioFile && (
              <div className={`flex items-center gap-3 p-3 rounded-xl ${
                isDark ? 'bg-green-900/20 border border-green-800/30' : 'bg-green-50 border border-green-200'
              } border`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                    {audioFileName}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Ready to upload
                  </p>
                </div>
                <button
                  onClick={togglePreview}
                  className={`p-2 rounded-full transition-colors ${
                    previewPlaying 
                      ? 'bg-yellow-500 text-white' 
                      : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {previewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Current audio preview */}
            {!audioFile && currentAudioUrl && (
              <div className={`flex items-center gap-3 p-3 rounded-xl ${
                isDark ? 'bg-gray-900/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              } border`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Current audio
                  </p>
                  {data?.title && (
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {data.title} {data.artist && `- ${data.artist}`}
                    </p>
                  )}
                </div>
                <button
                  onClick={togglePreview}
                  className={`p-2 rounded-full transition-colors ${
                    previewPlaying 
                      ? 'bg-yellow-500 text-white' 
                      : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {previewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            )}

            <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Supported formats: MP3, MPEG, WAV, OGG • Max size: 20MB
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving || isUploading || !isFormValid}
          className={`w-full px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
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
              <Upload className="w-4 h-4" /> 
              Upload & Save Song
            </>
          )}
        </button>
      </div>
    </div>
  );
}
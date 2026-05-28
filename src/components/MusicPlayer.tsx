
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, Pause, SkipForward, SkipBack, Upload, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Song {
  id: string;
  name: string;
  url: string;
  file?: File;
}

const MusicPlayer = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('audio/')) {
          const url = URL.createObjectURL(file);
          const newSong: Song = {
            id: Date.now().toString() + Math.random(),
            name: file.name.replace(/\.[^/.]+$/, ""),
            url,
            file
          };
          setSongs(prev => [...prev, newSong]);
          toast({
            title: "Song added!",
            description: `${newSong.name} has been added to your playlist.`,
          });
        }
      });
    }
  };

  const playSong = (song: Song) => {
    if (audioRef.current) {
      if (currentSong?.id === song.id && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (currentSong?.id !== song.id) {
          setCurrentSong(song);
          audioRef.current.src = song.url;
        }
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const removeSong = (songId: string) => {
    setSongs(prev => prev.filter(song => song.id !== songId));
    if (currentSong?.id === songId) {
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            🎵 Music Player
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              multiple
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Upload your music files</p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
            >
              Choose Files
            </Button>
          </div>

          {/* Current Song Player */}
          {currentSong && (
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Now Playing: {currentSong.name}</h3>
              <div className="flex items-center space-x-4">
                <Button onClick={togglePlayPause} size="lg" className="rounded-full">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Playlist */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Playlist ({songs.length} songs)</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    currentSong?.id === song.id ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playSong(song)}
                      className="p-2"
                    >
                      {currentSong?.id === song.id && isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <span className="font-medium">{song.name}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSong(song.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              {songs.length === 0 && (
                <p className="text-gray-500 text-center py-8">No songs uploaded yet. Add some music to get started!</p>
              )}
            </div>
          </div>

          <audio
            ref={audioRef}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicPlayer;

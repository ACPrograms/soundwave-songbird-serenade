
import React, { useState, useRef, useEffect } from "react";
import { Song, Playlist, generateDefaultSongs, generateDefaultPlaylists, generateId } from "@/utils/audioUtils";
import SongCard from "./SongCard";
import PlayerControls from "./PlayerControls";
import Sidebar from "./Sidebar";
import SongList from "./SongList";
import AddMusicModal from "./AddMusicModal";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MusicPlayer: React.FC = () => {
  // State for songs and playlists
  const [songs, setSongs] = useState<Song[]>(generateDefaultSongs);
  const [playlists, setPlaylists] = useState<Playlist[]>(generateDefaultPlaylists);
  
  // Player state
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState<string | null>(null);
  const [addMusicModalOpen, setAddMusicModalOpen] = useState(false);
  const [createPlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Toast notifications
  const { toast } = useToast();
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener("ended", () => {
      handleNext();
    });
    
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);
  
  // Load current song when it changes
  useEffect(() => {
    if (!audioRef.current || !currentSongId) return;
    
    const currentSong = songs.find(s => s.id === currentSongId);
    if (!currentSong) return;
    
    audioRef.current.src = currentSong.audioUrl;
    
    if (isPlaying) {
      audioRef.current.play()
        .catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
    }
    
  }, [currentSongId, songs]);
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || !currentSongId) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(error => {
          console.error("Error playing audio:", error);
        });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle song selection
  const handleSongSelect = (songId: string) => {
    if (currentSongId === songId) {
      // If the same song is clicked, toggle play/pause
      togglePlayPause();
    } else {
      // If a different song is clicked, change the song
      setCurrentSongId(songId);
      setIsPlaying(true);
    }
  };
  
  // Handle next song
  const handleNext = () => {
    if (!currentSongId) {
      if (songs.length > 0) {
        setCurrentSongId(songs[0].id);
        setIsPlaying(true);
      }
      return;
    }
    
    let currentIndex = songs.findIndex(s => s.id === currentSongId);
    if (currentIndex === -1) return;
    
    let nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSongId(songs[nextIndex].id);
    setIsPlaying(true);
  };
  
  // Handle previous song
  const handlePrevious = () => {
    if (!currentSongId) {
      if (songs.length > 0) {
        setCurrentSongId(songs[0].id);
        setIsPlaying(true);
      }
      return;
    }
    
    let currentIndex = songs.findIndex(s => s.id === currentSongId);
    if (currentIndex === -1) return;
    
    let prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSongId(songs[prevIndex].id);
    setIsPlaying(true);
  };
  
  // Add a new song
  const handleAddSong = (song: Song) => {
    setSongs(prev => [...prev, song]);
    toast({
      title: "Song added",
      description: `"${song.title}" has been added to your library`
    });
  };
  
  // Create a new playlist
  const handleCreatePlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: generateId(),
      name,
      songs: []
    };
    
    setPlaylists(prev => [...prev, newPlaylist]);
    setActivePlaylist(newPlaylist.id);
    
    toast({
      title: "Playlist created",
      description: `"${name}" playlist has been created`
    });
  };
  
  // Select a playlist
  const handlePlaylistSelect = (playlistId: string) => {
    setActivePlaylist(playlistId);
    setSidebarOpen(false);
  };
  
  // Get current song
  const currentSong = currentSongId ? songs.find(s => s.id === currentSongId) : null;
  
  // Get active playlist songs
  const activePlaylistObj = activePlaylist ? playlists.find(p => p.id === activePlaylist) : null;
  const playlistSongs = activePlaylistObj 
    ? activePlaylistObj.songs.map(id => songs.find(s => s.id === id)).filter(Boolean) as Song[]
    : songs;
  
  return (
    <div className="min-h-screen bg-music-player text-white">
      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 p-2.5 rounded-full bg-music-card z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>
      
      {/* Sidebar */}
      <Sidebar
        playlists={playlists}
        onCreatePlaylist={() => setCreatePlaylistModalOpen(true)}
        onPlaylistSelect={handlePlaylistSelect}
        onAddMusic={() => setAddMusicModalOpen(true)}
        activePlaylist={activePlaylist}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main Content */}
      <main className="music-main">
        <div className="max-w-7xl mx-auto">
          {activePlaylist ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">
                  {activePlaylistObj?.name}
                </h1>
                <p className="text-white/70">
                  {activePlaylistObj?.songs.length} songs
                </p>
              </div>
              
              <SongList
                songs={playlistSongs}
                onSongSelect={handleSongSelect}
                currentSongId={currentSongId}
                isPlaying={isPlaying}
              />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6">Your Music</h1>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Recently Added</h2>
                
                {songs.length === 0 ? (
                  <div className="py-12 text-center text-white/50 bg-music-card rounded-lg">
                    <p className="mb-4">Your library is empty</p>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setAddMusicModalOpen(true)}
                    >
                      Add Music
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {songs.slice(0, 6).map(song => (
                      <SongCard
                        key={song.id}
                        song={song}
                        onClick={() => handleSongSelect(song.id)}
                        isPlaying={isPlaying && currentSongId === song.id}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">All Songs</h2>
                <SongList
                  songs={songs}
                  onSongSelect={handleSongSelect}
                  currentSongId={currentSongId}
                  isPlaying={isPlaying}
                />
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* Player Controls */}
      <PlayerControls
        audioElement={audioRef.current}
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        currentTime={currentTime}
        duration={duration}
        songTitle={currentSong?.title || ""}
        songArtist={currentSong?.artist || ""}
        songCover={currentSong?.coverUrl || ""}
      />
      
      {/* Modals */}
      <AddMusicModal
        isOpen={addMusicModalOpen}
        onClose={() => setAddMusicModalOpen(false)}
        onAdd={handleAddSong}
      />
      
      <CreatePlaylistModal
        isOpen={createPlaylistModalOpen}
        onClose={() => setCreatePlaylistModalOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </div>
  );
};

export default MusicPlayer;


import React, { useEffect, useRef, useState } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX,
  Repeat, Shuffle, ChevronLeft, ChevronRight
} from "lucide-react";
import { formatTime } from "@/utils/audioUtils";
import { cn } from "@/lib/utils";

interface PlayerControlsProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  togglePlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentTime: number;
  duration: number;
  songTitle: string;
  songArtist: string;
  songCover: string;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  audioElement,
  isPlaying,
  togglePlayPause,
  onPrevious,
  onNext,
  currentTime,
  duration,
  songTitle,
  songArtist,
  songCover
}) => {
  const [volume, setVolume] = useState(0.7);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioElement || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioElement.currentTime = pos * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioElement) return;
    
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    audioElement.volume = newVolume;
    setIsMuted(newVolume === 0);
    if (newVolume > 0) {
      setPreviousVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (!audioElement) return;
    
    if (isMuted) {
      audioElement.volume = previousVolume;
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      audioElement.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const toggleRepeat = () => {
    if (!audioElement) return;
    
    setIsRepeat(!isRepeat);
    audioElement.loop = !isRepeat;
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };
  
  const seek = (seconds: number) => {
    if (!audioElement) return;
    audioElement.currentTime = Math.max(0, Math.min(duration, audioElement.currentTime + seconds));
  };

  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [audioElement]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const VolumeIcon = isMuted ? VolumeX : volume > 0.5 ? Volume2 : Volume1;

  return (
    <div className="player-bar">
      {/* Now Playing Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-[120px] max-w-[300px]">
        <img 
          src={songCover || "https://placehold.co/400x400/1a1a1a/cccccc?text=No+Image"}
          alt="Now Playing" 
          className="h-12 w-12 rounded-md object-cover bg-muted flex-shrink-0"
        />
        <div className="truncate">
          <div className="font-medium truncate">{songTitle || "No song selected"}</div>
          {songArtist && <div className="text-xs text-muted-foreground truncate">{songArtist}</div>}
        </div>
      </div>
      
      {/* Center Controls */}
      <div className="flex flex-col items-center flex-1 max-w-[600px] px-4">
        <div className="flex items-center gap-2 mb-2">
          <button 
            className={cn("control-btn", isShuffle && "text-music-primary")}
            onClick={toggleShuffle}
            aria-label="Toggle Shuffle"
          >
            <Shuffle size={18} />
          </button>
          
          <button className="control-btn" onClick={onPrevious} aria-label="Previous Track">
            <SkipBack size={20} />
          </button>
          
          <button className="control-btn" onClick={() => seek(-5)} aria-label="Rewind 5 seconds">
            <ChevronLeft size={20} />
          </button>
          
          <button 
            className="control-btn-primary" 
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button className="control-btn" onClick={() => seek(5)} aria-label="Forward 5 seconds">
            <ChevronRight size={20} />
          </button>
          
          <button className="control-btn" onClick={onNext} aria-label="Next Track">
            <SkipForward size={20} />
          </button>
          
          <button 
            className={cn("control-btn", isRepeat && "text-music-primary")} 
            onClick={toggleRepeat}
            aria-label="Toggle Repeat"
          >
            <Repeat size={18} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(currentTime)}
          </span>
          
          <div 
            className="progress-bar flex-1" 
            ref={progressBarRef}
            onClick={handleProgressClick}
          >
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
              <div className="progress-handle"></div>
            </div>
          </div>
          
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      
      {/* Volume Controls */}
      <div className="flex items-center gap-3 w-1/5 min-w-[100px] max-w-[200px] justify-end">
        <button className="control-btn" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
          <VolumeIcon size={18} />
        </button>
        
        <div className="volume-slider">
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="opacity-0 absolute w-full h-full cursor-pointer"
            aria-label="Volume Control"
          />
          <div className="volume-level" style={{ width: `${volume * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;

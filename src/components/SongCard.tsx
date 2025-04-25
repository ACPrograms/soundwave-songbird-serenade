
import React from "react";
import { PlayIcon } from "lucide-react";
import { Song } from "@/utils/audioUtils";
import { cn } from "@/lib/utils";

interface SongCardProps {
  song: Song;
  onClick: () => void;
  isPlaying: boolean;
  className?: string;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick, isPlaying, className }) => {
  return (
    <div className={cn("song-card", className)}>
      <div className="relative">
        <img 
          src={song.coverUrl}
          alt={`${song.title} by ${song.artist}`}
          className="song-card-img"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/400x400/1a1a1a/cccccc?text=No+Image";
          }}
        />
        <button
          className="song-card-play"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <PlayIcon size={20} />
        </button>
      </div>
      <h3 className="font-medium text-sm line-clamp-1">{song.title}</h3>
      <p className="text-xs text-muted-foreground line-clamp-1">{song.artist}</p>
      
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-music-primary" />
      )}
    </div>
  );
};

export default SongCard;

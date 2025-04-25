
import React from "react";
import { Song, formatTime } from "@/utils/audioUtils";
import { Play, MoreHorizontal, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SongListProps {
  songs: Song[];
  onSongSelect: (songId: string) => void;
  currentSongId: string | null;
  isPlaying: boolean;
  onEditSong?: (songId: string) => void;
}

const SongList: React.FC<SongListProps> = ({
  songs,
  onSongSelect,
  currentSongId,
  isPlaying,
  onEditSong
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 border-b border-white/10 text-sm text-white/50">
        <div className="w-6 text-center">#</div>
        <div>Title</div>
        <div>Artist</div>
        <div className="flex items-center justify-end">
          <Clock size={16} />
        </div>
        <div className="w-6"></div>
      </div>
      
      <div className="divide-y divide-white/5">
        {songs.map((song, index) => {
          const isActive = song.id === currentSongId;
          const isCurrentlyPlaying = isActive && isPlaying;
          
          return (
            <div 
              key={song.id}
              className={cn(
                "grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-3 items-center hover:bg-white/5 transition-colors cursor-pointer",
                isActive && "bg-white/10"
              )}
              onClick={() => onSongSelect(song.id)}
            >
              <div className="w-6 relative flex justify-center">
                {isCurrentlyPlaying ? (
                  <div className="w-2 h-2 bg-music-primary rounded-full animate-pulse-wave" />
                ) : (
                  <span className="text-white/50">{index + 1}</span>
                )}
              </div>
              
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={song.coverUrl || "https://placehold.co/400x400/1a1a1a/cccccc?text=No+Image"}
                  alt={song.title}
                  className="w-10 h-10 rounded-md object-cover bg-muted"
                />
                <span className={cn("truncate", isActive && "text-music-primary")}>
                  {song.title}
                </span>
              </div>
              
              <div className="truncate text-white/70">{song.artist}</div>
              
              <div className="text-white/50 text-right">{formatTime(song.duration)}</div>
              
              {onEditSong && (
                <button 
                  className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditSong(song.id);
                  }}
                  aria-label="Song Options"
                >
                  <MoreHorizontal size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {songs.length === 0 && (
        <div className="py-12 text-center text-white/50">
          <p>No songs in this playlist yet</p>
        </div>
      )}
    </div>
  );
};

export default SongList;

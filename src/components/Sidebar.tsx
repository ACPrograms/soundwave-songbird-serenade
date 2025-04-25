
import React, { useState } from "react";
import { Playlist } from "@/utils/audioUtils";
import { Home, Search, Library, PlusCircle, X, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  playlists: Playlist[];
  onCreatePlaylist: () => void;
  onPlaylistSelect: (playlistId: string) => void;
  onAddMusic: () => void;
  activePlaylist: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  playlists,
  onCreatePlaylist,
  onPlaylistSelect,
  onAddMusic,
  activePlaylist,
  isOpen,
  onToggle
}) => {
  const [activeView, setActiveView] = useState("home");
  
  const handleViewChange = (view: string) => {
    setActiveView(view);
    // You would typically navigate to a different route here
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
      
      {/* Sidebar */}
      <aside className={cn("music-sidebar", !isOpen && "sidebar-closed")}>
        {/* Close button (mobile only) */}
        <button
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 lg:hidden"
          onClick={onToggle}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-music-primary rounded-full p-1.5">
            <Music size={20} className="text-black" />
          </div>
          <h1 className="text-xl font-semibold">SoundWave</h1>
        </div>
        
        {/* Main Navigation */}
        <nav className="mb-8 space-y-1">
          <button
            className={cn(
              "flex items-center gap-3 w-full p-3 rounded-md transition-colors",
              activeView === "home" 
                ? "bg-white/10 text-white" 
                : "hover:bg-white/5 text-white/70"
            )}
            onClick={() => handleViewChange("home")}
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          
          <button
            className={cn(
              "flex items-center gap-3 w-full p-3 rounded-md transition-colors",
              activeView === "search" 
                ? "bg-white/10 text-white" 
                : "hover:bg-white/5 text-white/70"
            )}
            onClick={() => handleViewChange("search")}
          >
            <Search size={20} />
            <span>Search</span>
          </button>
        </nav>
        
        {/* Library */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-white/70">
            <Library size={20} />
            <span className="font-medium">Your Library</span>
          </div>
          
          <button
            onClick={onAddMusic}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Add music"
          >
            <PlusCircle size={18} />
          </button>
        </div>
        
        {/* Playlists */}
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-white/50">Playlists</span>
            <button
              onClick={onCreatePlaylist}
              className="text-2xl leading-none h-6 w-6 flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Create playlist"
            >
              +
            </button>
          </div>
          
          <div className="overflow-auto max-h-[calc(100vh-300px)] custom-scrollbar">
            {playlists.length === 0 ? (
              <p className="text-sm text-white/50 px-3 py-4">No playlists yet</p>
            ) : (
              playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  className={cn(
                    "flex items-center gap-3 w-full p-3 rounded-md text-left transition-colors",
                    activePlaylist === playlist.id 
                      ? "bg-white/10 text-white" 
                      : "hover:bg-white/5 text-white/70"
                  )}
                  onClick={() => onPlaylistSelect(playlist.id)}
                >
                  <div className="h-8 w-8 bg-muted/30 rounded flex items-center justify-center flex-shrink-0">
                    <Music size={16} />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-medium truncate">{playlist.name}</div>
                    <div className="text-xs text-white/50 truncate">
                      {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


import React, { useState, useRef } from "react";
import { X, Upload, Music } from "lucide-react";
import { Song, extractMetadataFromFile, generateId } from "@/utils/audioUtils";

interface AddMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (song: Song) => void;
}

const AddMusicModal: React.FC<AddMusicModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsLoading(true);
    
    try {
      const metadata = await extractMetadataFromFile(selectedFile);
      if (metadata.title) setTitle(metadata.title);
      if (metadata.artist) setArtist(metadata.artist);
    } catch (error) {
      console.error("Error extracting metadata:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setCoverFile(selectedFile);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, we'd upload the file to a server and get a URL back
      // For this demo, we'll simulate it with a timeout and fake URL
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSong: Song = {
        id: generateId(),
        title: title || file.name.replace('.mp3', ''),
        artist: artist || 'Unknown Artist',
        coverUrl: coverPreview || 'https://placehold.co/400x400/1a1a1a/cccccc?text=No+Image',
        audioUrl: URL.createObjectURL(file), // This would be a server URL in production
        duration: 180, // This would be extracted from the file in production
      };
      
      onAdd(newSong);
      onClose();
      
      // Reset form
      setFile(null);
      setTitle("");
      setArtist("");
      setCoverFile(null);
      setCoverPreview("");
    } catch (error) {
      console.error("Error adding song:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Music</h2>
          <button 
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* File Input */}
          <div 
            className="border-2 border-dashed border-white/20 rounded-lg p-6 mb-6 text-center cursor-pointer hover:border-white/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file"
              ref={fileInputRef}
              accept="audio/*,.mp3"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {file ? (
              <div className="space-y-2">
                <Music size={32} className="mx-auto text-white/70" />
                <div className="font-medium truncate">{file.name}</div>
                <div className="text-sm text-white/50">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload size={32} className="mx-auto text-white/70" />
                <div className="font-medium">Drag & drop MP3 or click to browse</div>
                <div className="text-sm text-white/50">MP3 files up to 10MB</div>
              </div>
            )}
          </div>
          
          {/* Title & Artist */}
          <div className="form-group">
            <label htmlFor="song-title" className="form-label">Song Title</label>
            <input
              type="text"
              id="song-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="Enter song title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="song-artist" className="form-label">Artist</label>
            <input
              type="text"
              id="song-artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="form-input"
              placeholder="Enter artist name"
              required
            />
          </div>
          
          {/* Cover Image */}
          <div className="form-group">
            <label htmlFor="song-cover" className="form-label">Cover Image (optional)</label>
            <div className="flex items-center gap-3">
              <div 
                className="h-16 w-16 rounded-md bg-muted flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => coverInputRef.current?.click()}
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                ) : (
                  <Music size={24} className="text-white/50" />
                )}
              </div>
              
              <div>
                <button
                  type="button"
                  className="text-sm text-music-primary hover:underline"
                  onClick={() => coverInputRef.current?.click()}
                >
                  {coverPreview ? "Change image" : "Upload image"}
                </button>
                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={!file || isLoading}
          >
            {isLoading ? "Processing..." : "Add Song"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMusicModal;

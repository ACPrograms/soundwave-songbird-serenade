
import React, { useState } from "react";
import { X } from "lucide-react";
import { generateId } from "@/utils/audioUtils";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      onClose();
      setName("");
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Playlist</h2>
          <button 
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="playlist-name" className="form-label">Playlist Name</label>
            <input
              type="text"
              id="playlist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="My Awesome Playlist"
              required
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={!name.trim()}
          >
            Create Playlist
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;

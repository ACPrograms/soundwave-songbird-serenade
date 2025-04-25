
export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  lyrics?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: string[];
}

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const extractMetadataFromFile = async (file: File): Promise<Partial<Song>> => {
  return new Promise((resolve) => {
    // In a real app, we'd use a library like jsmediatags
    // Since we can't actually upload files in this demo, we'll simulate metadata extraction
    const fileName = file.name.replace('.mp3', '').split(' - ');
    
    setTimeout(() => {
      resolve({
        title: fileName.length > 1 ? fileName[1] : fileName[0],
        artist: fileName.length > 1 ? fileName[0] : 'Unknown Artist',
        duration: Math.floor(Math.random() * 300) + 60 // Random duration between 1-6 minutes
      });
    }, 500);
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const generateDefaultSongs = (): Song[] => {
  return [
    {
      id: 'song1',
      title: 'Synthwave Memories',
      artist: 'Neon Dreams',
      coverUrl: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=500&q=80',
      audioUrl: '/music/synthwave.mp3',
      duration: 247
    },
    {
      id: 'song2',
      title: 'Midnight Jazz',
      artist: 'The Blue Notes',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80',
      audioUrl: '/music/jazz.mp3',
      duration: 184
    },
    {
      id: 'song3',
      title: 'Summer Breeze',
      artist: 'Coastal Waves',
      coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
      audioUrl: '/music/summer.mp3',
      duration: 215
    },
    {
      id: 'song4',
      title: 'Chill Lo-Fi',
      artist: 'Beatmaker',
      coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&q=80',
      audioUrl: '/music/lofi.mp3',
      duration: 203
    },
    {
      id: 'song5',
      title: 'Ambient Dreams',
      artist: 'Soundscapes',
      coverUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500&q=80',
      audioUrl: '/music/ambient.mp3',
      duration: 276
    },
    {
      id: 'song6',
      title: 'Electric Groove',
      artist: 'Digital Beats',
      coverUrl: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=500&q=80',
      audioUrl: '/music/electric.mp3',
      duration: 192
    }
  ];
};

export const generateDefaultPlaylists = (): Playlist[] => {
  return [
    {
      id: 'playlist1',
      name: 'Chill Vibes',
      songs: ['song1', 'song3', 'song5']
    },
    {
      id: 'playlist2',
      name: 'Focus & Study',
      songs: ['song2', 'song4']
    }
  ];
};

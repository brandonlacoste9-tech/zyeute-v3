import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoPlayer } from './VideoPlayer';
import { cn } from '../../lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';

// Interface matching the Supabase 'videos' table structure
interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration: number | null;
  user_id: string; // The uploader's ID
  created_at: string;
  views_count: number;
  likes_count: number;
  is_featured: boolean;
  // Metadata for UI
  author_username?: string;
  author_avatar_url?: string;
}

export const ZyeuteFeed: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch feed data from our new API endpoint
  const { data: videos, isLoading, error } = useQuery<Video[]>({
    queryKey: ['zyeute-feed'],
    queryFn: async () => {
      const res = await fetch('/api/feed');
      if (!res.ok) {
        throw new Error('Failed to fetch feed');
      }
      return res.json();
    },
    refetchOnWindowFocus: false,
  });

  // Handle scroll snap logic to update current index
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  }, [currentIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-black">
        <div className="text-center">
            {/* Voyageur Gold Spinner */}
            <svg className="h-12 w-12 animate-spin text-gold-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="font-medium text-gold-400">Chargement du contenu...</p>
        </div>
      </div>
    );
  }

  if (error || !videos || videos.length === 0) {
     return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-black text-white">
        <div className="text-center p-6 max-w-md">
            <div className="text-5xl mb-4">🦫</div>
            <h3 className="text-xl font-bold mb-2 text-gold-500">Oups! C'est vide icitte.</h3>
            <p className="text-gray-400 mb-6">
                {error ? "Une erreur est survenue lors du chargement." : "Aucune vidéo disponible pour le moment."}
            </p>
            <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-full transition-colors"
            >
                Réessayer
            </button>
        </div>
      </div>
    );
  }

  return (
    <div 
        ref={containerRef}
        className="h-[calc(100vh-64px)] w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-black no-scrollbar"
    >
      {videos.map((video, index) => (
        <div 
            key={video.id} 
            className="relative h-full w-full snap-start snap-always flex items-center justify-center"
        >
            <div className="relative h-full w-full max-w-md mx-auto bg-zinc-900 border-x border-zinc-800/50">
                <VideoPlayer
                    src={video.video_url}
                    poster={video.thumbnail_url || undefined}
                    autoPlay={index === currentIndex}
                    muted={false} // Allow valid playback with sound if user interacts
                    loop={true}
                    className="h-full w-full object-cover"
                />

                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                    <div className="flex items-end justify-between">
                        <div className="flex-1 mr-12">
                            {/* Author Info */}
                            <div className="flex items-center gap-2 mb-3 pointer-events-auto">
                                <Avatar className="h-10 w-10 border-2 border-gold-500/50">
                                    <AvatarImage src={video.author_avatar_url} />
                                    <AvatarFallback className="bg-zinc-800 text-gold-500">
                                        {video.author_username?.slice(0, 2).toUpperCase() || "??"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-white text-shadow-sm">
                                        @{video.author_username || 'Utilisateur Zyeuté'}
                                    </h3>
                                    {video.is_featured && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-500 text-black">
                                            En vedette ✨
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Description */}
                            <h2 className="text-white mb-1 font-medium drop-shadow-md line-clamp-2">
                                {video.title}
                            </h2>
                            {video.description && (
                                <p className="text-gray-200 text-sm line-clamp-2 drop-shadow-sm">
                                    {video.description}
                                </p>
                            )}
                        </div>

                        {/* Side Actions Bar */}
                        <div className="absolute right-2 bottom-20 flex flex-col gap-4 pointer-events-auto">
                            <ActionButton icon="❤️" count={video.likes_count} />
                            <ActionButton icon="💬" count={0} />
                            <ActionButton icon="↗️" label="Partager" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
};

const ActionButton: React.FC<{ icon: string; count?: number; label?: string }> = ({ icon, count, label }) => (
    <button className="flex flex-col items-center gap-1 group">
        <div className="w-12 h-12 rounded-full bg-zinc-800/60 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-90 border border-white/10">
            <span className="text-2xl">{icon}</span>
        </div>
        {(count !== undefined || label) && (
            <span className="text-xs font-medium text-white shadow-black drop-shadow-md">
                {count !== undefined ? Intl.NumberFormat('fr-CA', { notation: "compact" }).format(count) : label}
            </span>
        )}
    </button>
);

export default ZyeuteFeed;

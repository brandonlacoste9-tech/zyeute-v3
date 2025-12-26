/**
 * FORCE_DEPLOY: Fix react-window build error by flushing old cache
 * ContinuousFeed - TikTok-style vertical video feed
 * OPTIMIZED 3-VIDEO BUFFER IMPLEMENTATION
 * 
 * Features:
 * - Renders only 3 videos max (Prev, Current, Next) for zero memory leaks
 * - CSS transform/opacity transitions for 60fps performance
 * - Custom touch handling for unified swipe experience
 * - Keyboard navigation support
 * - Haptics integration
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SingleVideoView } from './SingleVideoView';
import { getExplorePosts, togglePostFire, getCurrentUser } from '@/services/api';
import { useHaptics } from '@/hooks/useHaptics';
import type { Post, User } from '@/types';
import { logger } from '../../lib/logger';
import { cn } from '../../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const feedLogger = logger.withContext('ContinuousFeed');

interface ContinuousFeedProps {
    className?: string;
    onVideoChange?: (index: number, post: Post) => void;
}

export const ContinuousFeed: React.FC<ContinuousFeedProps> = ({ className, onVideoChange }) => {
    const { tap, impact } = useHaptics();
    
    // Data State
    const [posts, setPosts] = useState<Array<Post & { user: User }>>([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    
    // Viewport State
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInteracting = useRef(false);

    // Initial Fetch
    const fetchVideoFeed = useCallback(async (pageNum: number, isInitial = false) => {
        if (isInitial) setIsLoading(true);
        try {
            const data = await getExplorePosts(pageNum, 10);
            
            if (data && data.length > 0) {
                 const processedPosts = data.map(p => ({
                    ...p,
                    user: p.user || {
                        id: 'unknown',
                        username: 'Utilisateur Zyeuté',
                        display_name: 'Utilisateur Zyeuté',
                        avatar_url: '',
                        is_verified: false,
                    } as User
                }));

                setPosts(prev => isInitial ? processedPosts : [...prev, ...processedPosts]);
                setHasMore(data.length === 10);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            feedLogger.error('Error fetching feed:', error);
        } finally {
            if (isInitial) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVideoFeed(0, true);
    }, [fetchVideoFeed]);

    // Load More Logic - Trigger when getting close to end
    useEffect(() => {
        if (currentIndex > posts.length - 4 && hasMore && !isLoading) {
            setPage(p => {
                const nextPage = p + 1;
                fetchVideoFeed(nextPage);
                return nextPage;
            });
        }
    }, [currentIndex, hasMore, isLoading, posts.length, fetchVideoFeed]);

    // Notify parent of video change
    useEffect(() => {
        if (posts[currentIndex] && onVideoChange) {
            onVideoChange(currentIndex, posts[currentIndex]);
        }
    }, [currentIndex, posts, onVideoChange]);


    // Navigation Handlers
    const goNext = useCallback(() => {
        if (currentIndex < posts.length - 1) {
            setCurrentIndex(prev => prev + 1);
            impact();
        }
    }, [currentIndex, posts.length, impact]);

    const goPrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            impact();
        }
    }, [currentIndex, impact]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                goNext();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                goPrev();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goNext, goPrev]);

    // Touch Handling (Swipe)
    const touchStartY = useRef(0);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
        isInteracting.current = true;
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isInteracting.current) return;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY.current - touchEndY;
        const threshold = 50; // Swipe threshold

        if (deltaY > threshold) {
            goNext();
        } else if (deltaY < -threshold) {
             goPrev();
        }
        isInteracting.current = false;
    };

    // Actions
    const handleFireToggle = useCallback(async (postId: string, _currentFire: number) => {
        const user = await getCurrentUser();
        if (user) togglePostFire(postId, user.id).catch(console.error);
    }, []);

    const handleShare = useCallback((postId: string) => {
        const url = `${window.location.origin}/p/${postId}`;
        if (navigator.share) navigator.share({ title: 'Zyeuté', url });
        else navigator.clipboard.writeText(url);
    }, []);

    const handleComment = useCallback((postId: string) => {
        window.location.href = `/p/${postId}`;
    }, []);


    // -- RENDER --
    
    if (isLoading && posts.length === 0) {
        return (
             <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-gold-500 mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gold-400 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!isLoading && posts.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-6 text-center">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-xl font-bold mb-2">C'est vide icitte!</h3>
                <p className="text-gray-400">Reviens plus tard pour de nouvelles vidéos.</p>
            </div>
        );
    }

    return (
        <div 
            ref={containerRef}
            className={cn("relative w-full h-full overflow-hidden bg-black touch-none", className)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <AnimatePresence initial={false} custom={currentIndex}>
                {posts.map((post, index) => {
                    // 3-VIDEO BUFFER LOGIC:
                    // Only render current, previous, and next
                    if (index < currentIndex - 1 || index > currentIndex + 1) return null;
                    
                    const isCurrent = index === currentIndex;
                    
                    return (
                        <motion.div
                            key={post.id}
                            className="absolute inset-0 w-full h-full"
                            initial={{ 
                                y: index > currentIndex ? '100%' : '-100%', 
                                opacity: 0 
                            }}
                            animate={{ 
                                y: index === currentIndex ? '0%' : index > currentIndex ? '100%' : '-100%',
                                opacity: index === currentIndex ? 1 : 0
                            }}
                            exit={{ 
                                y: index < currentIndex ? '-100%' : '100%',
                                opacity: 0 
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{ zIndex: isCurrent ? 10 : 0 }}
                        >
                            {/* Only mount VideoPlayer if it's in the buffer window */}
                            <SingleVideoView
                                post={post}
                                user={post.user}
                                isActive={isCurrent}
                                onFireToggle={handleFireToggle}
                                onComment={handleComment}
                                onShare={handleShare}
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Vertical Progress Dots (Optional Visual Aid) */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-20 pointer-events-none">
                {posts.length > 1 && (
                    <div className="w-1 h-8 bg-white/10 rounded-full flex flex-col items-center justify-start overflow-hidden">
                        <motion.div 
                            className="w-full bg-gold-400 rounded-full"
                            animate={{ height: `${((currentIndex + 1) / posts.length) * 100}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * ContinuousFeed - Full-screen vertical video feed
 * Adapts the Player experience for the main feed
 * NOW WITH VIRTUALIZATION by REACT-WINDOW
 */

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
// @ts-ignore
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { SingleVideoView } from './SingleVideoView';
import { getExplorePosts, togglePostFire, getCurrentUser } from '@/services/api';
import { useHaptics } from '@/hooks/useHaptics';
import { useVideoPreloader } from '@/hooks/useVideoPreloader';
import type { Post, User } from '@/types';
import { logger } from '../../lib/logger';
import { cn } from '../../lib/utils';

const feedLogger = logger.withContext('ContinuousFeed');

interface ContinuousFeedProps {
    className?: string;
    onVideoChange?: (index: number, post: Post) => void;
}

const FeedRow = memo(({ index, style, data }: ListChildComponentProps) => {
    const { posts, currentIndex, handleFireToggle, handleComment, handleShare, getPreloadedUrl } = data;
    const post = posts[index];
    const isActive = index === currentIndex;

    // Use a ref to ensure we only try to play properly mounted videos
    const rowRef = useRef<HTMLDivElement>(null);

    if (!post) return null;

    // Inject preloaded blob URL if available
    const effectivePost = {
        ...post,
        mediaUrl: getPreloadedUrl(post.mediaUrl)
    };

    return (
        <div style={style} ref={rowRef} data-video-index={index} className="w-full h-full">
            <SingleVideoView
                post={effectivePost}
                user={post.user}
                isActive={isActive}
                onFireToggle={handleFireToggle}
                onComment={handleComment}
                onShare={handleShare}
            />
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if the active status changes or the post data itself changes
    const prevData = prevProps.data;
    const nextData = nextProps.data;

    const isPrevActive = prevProps.index === prevData.currentIndex;
    const isNextActive = nextProps.index === nextData.currentIndex;
    
    // Also check if the preloaded URL changed (i.e., blob became available)
    // getPreloadedUrl is a new function ref on every render of Parent if hook state changes
    // But since we pass it in itemData, and itemData is recreated...
    // We rely on `prevData.getPreloadedUrl !== nextData.getPreloadedUrl` implicitly causing re-renders?
    // Actually, FeedRow memoization comparison needs to be careful.
    // If we want the row to re-render when the blob arrives, we need to know if the result of getPreloadedUrl(thisPost) changed.
    
    // Simple way: check if itemData changed reference?
    // The default `memo` compares props. `data` is a prop.
    // If `ContinuousFeed` re-renders (state update in hook -> setBlobCache -> re-render ContinuousFeed -> new itemData object),
    // then `prevProps.data !== nextProps.data`.
    // BUT we have a custom comparison function here!
    
    // We MUST update the comparison to check data equality strictly or specific fields.
    // Since `getPreloadedUrl` relies on closure state, if `data` reference changes, we might want to re-render.
    // But we don't want to re-render ALL rows every time a blob loads for ONE row.
    
    // Ideally: Check if `getPreloadedUrl(post.mediaUrl)` result changed?
    // But we can't call the function easily here without cost.
    
    // Compromise: Just re-render if data reference changes? No, that defeats virtualization perf.
    // However, React Window passes a NEW `data` prop every time the parent renders if we defined `itemData` inline (which we did).
    // So `prevData !== nextData` is always true if parent re-renders.
    
    // The current comparison:
    // prevData.posts[prevProps.index] === nextData.posts[nextProps.index]
    
    // We need to add:
    // && prevData.getPreloadedUrl(post.mediaUrl) === nextData.getPreloadedUrl(post.mediaUrl)
    // But `post` is inside the lists.
    
    const prevPost = prevData.posts[prevProps.index];
    const nextPost = nextData.posts[nextProps.index];
    
    // Check if resolved URL actually changed for this specific row
    const prevUrl = prevData.getPreloadedUrl ? prevData.getPreloadedUrl(prevPost?.mediaUrl) : prevPost?.mediaUrl;
    const nextUrl = nextData.getPreloadedUrl ? nextData.getPreloadedUrl(nextPost?.mediaUrl) : nextPost?.mediaUrl;

    return (
        isPrevActive === isNextActive &&
        prevPost === nextPost &&
        prevProps.style === nextProps.style &&
        prevUrl === nextUrl
    );
});

export const ContinuousFeed: React.FC<ContinuousFeedProps> = ({ className, onVideoChange }) => {
    const listRef = useRef<List>(null);
    const { tap } = useHaptics();

    const [posts, setPosts] = useState<Array<Post & { user: User }>>([]);
    const [page, setPage] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Fetch video feed (Latest Public Videos)
    const fetchVideoFeed = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getExplorePosts(0, 10);

            if (data) {
                // Map posts to ensure they all have a user object, providing a fallback if missing
                const processedPosts = data.map(p => {
                    if (!p.user) {
                        return {
                            ...p,
                            user: {
                                id: 'unknown',
                                username: 'Utilisateur inconnu',
                                display_name: 'Utilisateur inconnu',
                                avatar_url: '',
                                bio: '',
                                created_at: new Date().toISOString(),
                                is_verified: false,
                            } as User
                        };
                    }
                    return p as Post & { user: User };
                });
                
                setPosts(processedPosts);
                setHasMore(data.length === 10);
                setPage(0);
            }
        } catch (error) {
            feedLogger.error('Error fetching video feed:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load more videos
    const loadMoreVideos = useCallback(async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const data = await getExplorePosts(nextPage, 10);

            if (data && data.length > 0) {
                 const processedPosts = data.map(p => {
                    if (!p.user) {
                        return {
                            ...p,
                            user: {
                                id: 'unknown',
                                username: 'Utilisateur inconnu',
                                display_name: 'Utilisateur inconnu',
                                avatar_url: '',
                                bio: '',
                                created_at: new Date().toISOString(),
                                is_verified: false,
                            } as User
                        };
                    }
                    return p as Post & { user: User };
                });

                setPosts((prev) => [...prev, ...processedPosts]);
                setHasMore(data.length === 10);
                setPage(nextPage);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            feedLogger.error('Error loading more videos:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [page, loadingMore, hasMore]);

    // Initial fetch
    useEffect(() => {
        fetchVideoFeed();
    }, [fetchVideoFeed]);

    // Handle items rendered (for pagination and tracking current index)
    const onItemsRendered = useCallback(({ visibleStartIndex, visibleStopIndex }: any) => {
        // We assume the top-most visible item is the "current" one in a snap-scroll context
        const newIndex = visibleStartIndex;

        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
            setCurrentIndex(newIndex);
            if (onVideoChange && posts[newIndex]) {
                onVideoChange(newIndex, posts[newIndex]);
            }
        }

        // Pagination trigger
        if (visibleStopIndex >= posts.length - 2 && hasMore && !loadingMore) {
            loadMoreVideos();
        }
    }, [currentIndex, posts, hasMore, loadingMore, loadMoreVideos, onVideoChange]);


    // Handle fire (like) toggle
    const handleFireToggle = useCallback(async (postId: string, _currentFire: number) => {
        feedLogger.debug('Fire toggle for post:', postId);
        try {
            const user = await getCurrentUser();
            if (!user) return;
            await togglePostFire(postId, user.id);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleComment = useCallback((postId: string) => {
        window.location.href = `/p/${postId}`;
    }, []);

    const handleShare = useCallback(async (postId: string) => {
        const url = `${window.location.origin}/p/${postId}`;
        if (navigator.share) {
            await navigator.share({ title: 'Zyeuté', url });
        } else {
            await navigator.clipboard.writeText(url);
        }
    }, []);

    if (isLoading && posts.length === 0) {
        return (
            <div className={cn("w-full h-full flex items-center justify-center bg-zinc-900", className)}>
                <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className={cn("w-full h-full flex flex-col items-center justify-center bg-zinc-900 p-8 text-center", className)}>
                <div className="text-4xl mb-4">📱</div>
                <p className="text-stone-400 mb-4">Aucun contenu disponible pour le moment.</p>
            </div>
        );
    }

    // Preload videos
    const { getPreloadedUrl } = useVideoPreloader(posts, currentIndex);

    // Data object passed to rows
    const itemData = {
        posts,
        currentIndex,
        handleFireToggle,
        handleComment,
        handleShare,
        getPreloadedUrl // Pass the helper
    };

    return (
        <div className={cn("w-full h-full bg-black", className)}>
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        ref={listRef}
                        className="no-scrollbar snap-y snap-mandatory scroll-smooth"
                        height={height}
                        width={width}
                        itemCount={posts.length}
                        itemSize={height} // Full screen height per item
                        itemData={itemData}
                        onItemsRendered={onItemsRendered}
                        overscanCount={1} // Only render 1 item above/below viewport
                    >
                        {FeedRow}
                    </List>
                )}
            </AutoSizer>

            {loadingMore && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-50">
                    <div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

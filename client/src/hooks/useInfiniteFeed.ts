/**
 * Infinite Scroll Feed Hook
 * Uses React Query for data fetching with cursor-based pagination
 * Compatible with both LaZyeute (TikTok) and Feed (grid) components
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import type { Post } from '@/types';
import { supabase } from '@/lib/supabase'; // Updated import

interface FeedResponse {
    posts: Post[];
    nextCursor: string | null;
    hasMore: boolean;
    feedType: string;
}

export type FeedType = 'feed' | 'explore' | 'smart';

export function useInfiniteFeed(feedType: FeedType = 'explore') {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
        refetch,
    } = useInfiniteQuery<FeedResponse>({
        queryKey: ['feed-infinite', feedType],
        queryFn: async ({ pageParam }) => {
            const limit = 20;
            
            // Build query
            let query = supabase
                .from('publications')
                .select(`
                    *,
                    user:user_id (
                        username,
                        avatar_url,
                        is_verified
                    ),
                    comments:comments (count),
                    likes:likes (count)
                `)
                .order('created_at', { ascending: false })
                .limit(limit);

            // Apply filter based on feed type (if applicable)
            if (feedType === 'explore') {
                 // For explore, we might randomly order or filter, but for now standard feed
            }

            // Apply cursor pagination
            if (pageParam) {
                query = query.lt('created_at', pageParam);
            }

            const { data: rawPosts, error } = await query;

            if (error) {
                throw new Error(error.message);
            }

            const posts = rawPosts as unknown as Post[];

            // Determine next cursor
            const nextCursor = posts.length === limit ? posts[posts.length - 1].created_at : null;

            return {
                posts,
                nextCursor,
                hasMore: !!nextCursor,
                feedType
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null,
    });

    // Intersection observer for triggering load more
    const { ref, inView } = useInView({
        threshold: 0.1,
        rootMargin: '200px', // Start loading 200px before reaching the end
    });

    // Auto-fetch next page when scroll trigger becomes visible
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Flatten pages into single array of posts
    const posts = data?.pages.flatMap(page => page.posts) ?? [];

    return {
        posts,
        loadMoreRef: ref,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        error,
        refetch,
    };
}

/**
 * Simpler hook without intersection observer
 * For manual control over loading
 */
export function useInfiniteFeedManual(feedType: FeedType = 'explore') {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
        refetch,
    } = useInfiniteQuery<FeedResponse>({
        queryKey: ['feed-infinite-manual', feedType],
        queryFn: async ({ pageParam }) => {
            const limit = 20;

            let query = supabase
                .from('publications')
                 .select(`
                    *,
                    user:user_id (
                        username,
                        avatar_url,
                        is_verified
                    ),
                    comments:comments (count),
                    likes:likes (count)
                `)
                .order('created_at', { ascending: false })
                .limit(limit);

             if (pageParam) {
                query = query.lt('created_at', pageParam);
            }

            const { data: rawPosts, error } = await query;

            if (error) throw new Error(error.message);

            const posts = rawPosts as unknown as Post[];
            const nextCursor = posts.length === limit ? posts[posts.length - 1].created_at : null;

            return {
                posts,
                nextCursor,
                hasMore: !!nextCursor,
                feedType
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null,
    });

    const posts = data?.pages.flatMap(page => page.posts) ?? [];

    return {
        posts,
        loadMore: fetchNextPage,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        error,
        refetch,
    };
}

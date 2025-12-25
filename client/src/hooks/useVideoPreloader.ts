import { useState, useEffect, useRef } from 'react';

/**
 * Hook to preload videos into Blob URLs for instant playback.
 * 
 * @param posts Array of posts containing mediaUrls
 * @param currentIndex Current index in the feed
 * @param bufferSize How many videos ahead to preload (default 2)
 * @returns Helper to get the preloaded URL for a given original URL
 */
export function useVideoPreloader(
  posts: Array<{ id: string, mediaUrl?: string }>, 
  currentIndex: number, 
  bufferSize: number = 2
) {
  // Map of originalUrl -> blobUrl
  const [blobCache, setBlobCache] = useState<Record<string, string>>({});
  // Keep track of active blobs to avoid double-fetching
  const pendingFetches = useRef<Set<string>>(new Set());

  // Helper to extract the actual URL if it's JSON
  const extractUrl = (mediaUrl?: string): string | null => {
    if (!mediaUrl) return null;
    try {
        if (mediaUrl.trim().startsWith('{')) {
            const urls = JSON.parse(mediaUrl);
            // Preload high or medium based on device? 
            // For now, let's just preload what the user WOULD likely watch.
            // Heuristic matches VideoPlayer: Mobile -> Medium, Desktop -> High.
            // Since we can't easily detect device here reliably without hydration issues or duplicating logic,
            // let's grab the 'medium' as safe bet for preloading speed, or 'high' if medium missing.
            // Actually, to match VideoPlayer perfectly, we should replicate the logic.
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            return isMobile ? (urls.medium || urls.high) : (urls.high || urls.medium);
        }
    } catch (e) {
        // ignore
    }
    return mediaUrl;
  };

  useEffect(() => {
    // Determine range to preload
    const startIndex = currentIndex + 1;
    const endIndex = Math.min(currentIndex + bufferSize, posts.length - 1);

    const urlsToPreload = new Set<string>();

    // 1. Identify URLs to preload
    for (let i = startIndex; i <= endIndex; i++) {
        const url = extractUrl(posts[i]?.mediaUrl);
        if (url && !url.startsWith('blob:')) {
            urlsToPreload.add(url);
        }
    }

    // 2. Fetch and Cache
    urlsToPreload.forEach(async (url) => {
        if (blobCache[url] || pendingFetches.current.has(url)) return;

        pendingFetches.current.add(url);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            setBlobCache(prev => ({
                ...prev,
                [url]: blobUrl
            }));
        } catch (err) {
            console.error('Failed to preload video:', url, err);
        } finally {
            pendingFetches.current.delete(url);
        }
    });

    // 3. Cleanup old blobs (posts far behind)
    // We keep currentIndex and maybe 1 behind?
    const keepWindowStart = Math.max(0, currentIndex - 1);
    
    // Identify URLs that are NO LONGER in the "keep" window (current, next buffer, immediate prev)
    // Actually, simple strategy: Just ensure we don't leak.
    // Let's iterate the cache.
    // If a URL is NOT in [currentIndex - 1 ... currentIndex + bufferSize], we might want to release it?
    // OR just release anything < currentIndex - 2 to be safe.
    
    // For now, clean up anything > 5 slots away to be safe but aggressive enough.
    // This requires knowing which index a URL belongs to.
    
    // Simpler cleanup: When component unmounts? No, feed is long lived.
    // Let's stick to: "clean up anything that isn't in the active posts window logic", but that's O(N).
    // Optimization: Just clear extremely old ones if cache gets too big?
    // Let's implement a rudimentary cleanup of the specific 'currentIndex - 3' post.
    if (currentIndex > 2) {
        const postToClean = posts[currentIndex - 3];
        const urlToClean = extractUrl(postToClean?.mediaUrl);
        if (urlToClean && blobCache[urlToClean]) {
            const safeUrlToRemove = urlToClean;
            URL.revokeObjectURL(blobCache[safeUrlToRemove]);
            setBlobCache(prev => {
                const newCache = { ...prev };
                delete newCache[safeUrlToRemove];
                return newCache;
            });
        }
    }

  }, [currentIndex, posts, bufferSize]); // Intentionally not including blobCache to avoid loops

  // However, since we used state for blobCache, the effect captured the initial state... 
  // actually the cleanup effect needs access to the LATEST blobCache.
  // We should probably use a Ref for the actual cleanup list to be safe.
  const cleanupRef = useRef<Record<string, string>>({});
  useEffect(() => {
      cleanupRef.current = blobCache;
  }, [blobCache]);

  // 4. Global Cleanup on unmount
  useEffect(() => {
    return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        Object.values(cleanupRef.current).forEach(url => URL.revokeObjectURL(url));
    };
  }, []); // Empty deps = unmount only


  const getPreloadedUrl = (originalMediaUrl?: string) => {
      const rawUrl = extractUrl(originalMediaUrl);
      if (rawUrl && blobCache[rawUrl]) {
          return blobCache[rawUrl];
      }
      return originalMediaUrl;
  };

  return { getPreloadedUrl };
}

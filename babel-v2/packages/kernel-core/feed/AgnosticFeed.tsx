import React, { useEffect, useState } from 'react';
import { useSovereignRouter } from '../../sovereign-router/SovereignRouter';
import { useKernel } from '../BabelKernelProvider';

/**
 * THE AGNOSTIC FEED
 * 
 * This component knows NOTHING about Japan, Mexico, or Quebec.
 * It asks the Iron Layer for "content", and renders it using the injected Theme.
 */

interface FeedItem {
  id: string;
  author: string;
  content_uri: string;
  timestamp: number;
  slang_tag: string; // e.g., "Oshi" or "Like"
}

export const AgnosticFeed: React.FC = () => {
    const { manifest, hydrated } = useKernel();
    const router = useSovereignRouter();
    const [items, setItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!hydrated) return;

        const fetchFeed = async () => {
            try {
                console.log(`📡 FEED: Requesting content via [${manifest?.sovereignty.jurisdiction}] channel...`);
                // In a real app, this hits the API.
                // For V2 Demo, we mock the response based on the Manifest.
                
                // MOCK RESPONSE
                const mockItems: FeedItem[] = [
                    { 
                        id: '1', 
                        author: manifest?.regionId === 'jp-tk' ? 'Yuki_77' : 'Jean_Guy',
                        content_uri: 'video_shibuya_crossing.mp4',
                        timestamp: Date.now(),
                        slang_tag: manifest?.slang_lexicon_preview ? manifest.slang_lexicon_preview.like_action : 'Like'
                    },
                    {
                        id: '2',
                         author: manifest?.regionId === 'jp-tk' ? 'Kenta_Vlogs' : 'Sophie_MTL',
                        content_uri: 'video_ramen.mp4',
                        timestamp: Date.now() - 50000,
                        slang_tag: manifest?.slang_lexicon_preview ? manifest.slang_lexicon_preview.share_action : 'Share'
                    }
                ];

                setTimeout(() => {
                    setItems(mockItems);
                    setLoading(false);
                }, 800); // Simulate network latency

            } catch (e) {
                console.error("FEED ERROR: Sovereignty blockage?");
            }
        };

        fetchFeed();
    }, [hydrated, manifest]);

    if (!hydrated) return null;

    return (
        <div className={`feed-container theme-${manifest?.presentation.themeId}`}>
            {/* HERDER */}
            <header className="feed-header" style={{ padding: '20px', borderBottom: '1px solid #333' }}>
                <h1 style={{ fontFamily: 'var(--font-primary)' }}>
                    {manifest?.slang_lexicon_preview ? manifest.slang_lexicon_preview.app_name : 'Zyeute'}
                </h1>
                <div className="sovereignt-badge" style={{ fontSize: '0.8rem', color: '#0f0' }}>
                    🔒 {manifest?.sovereignty.jurisdiction} PROTECTED
                </div>
            </header>

            {/* CONTENT */}
            <div className="feed-scroll">
                {loading ? (
                    <div className="loader">Hydrating Feed...</div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="feed-card" style={{ margin: '20px', padding: '15px', border: '1px solid #444' }}>
                            <h3>@{item.author}</h3>
                            <div className="video-placeholder" style={{ height: '200px', background: '#222' }}>
                                [CONTENT: {item.content_uri}]
                            </div>
                            <div className="actions" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                <button>❤️ {item.slang_tag}</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

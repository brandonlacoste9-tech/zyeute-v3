/**
 * VideoPlayer with HLS support via Video.js
 * Supports Mux streaming URLs and adaptive bitrate playback
 */

import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type Player from 'video.js/dist/types/player';

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onEnded?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  className = '',
  style,
  onEnded,
  onPlay,
  onPause,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      // The Video.js player needs to be inside the component el for React 18 Strict Mode
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true,
        preload: 'auto',
        autoplay: autoPlay,
        muted: muted,
        loop: loop,
        poster: poster,
        html5: {
          vhs: {
            overrideNative: true,
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false,
        },
      }));

      // Event listeners
      player.on('ready', () => {
        setIsReady(true);
      });

      player.on('ended', () => {
        onEnded?.();
      });

      player.on('play', () => {
        onPlay?.();
      });

      player.on('pause', () => {
        onPause?.();
      });
    }
  }, []);

  // Update source when it changes
  useEffect(() => {
    const player = playerRef.current;
    if (player && isReady && src) {
      player.src({
        src,
        type: src.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4',
      });
    }
  }, [src, isReady]);

  // Update player options when props change
  useEffect(() => {
    const player = playerRef.current;
    if (player && isReady) {
      if (poster) player.poster(poster);
      player.autoplay(autoPlay);
      player.muted(muted);
      player.loop(loop);
    }
  }, [poster, autoPlay, muted, loop, isReady]);

  // Dispose the player on unmount
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      data-vjs-player
      className={className}
      style={style}
    >
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;

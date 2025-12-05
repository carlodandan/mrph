// components/ArtPlayer.jsx
import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';

function ArtPlayer({ option, getInstance, ...rest }) {
  const artRef = useRef(null);

  useEffect(() => {
    if (!artRef.current) return;

    const art = new Artplayer({
      container: artRef.current,
      url: option.url,
      poster: option.poster,
      title: option.title,
      volume: 0.7,
      muted: false,
      autoplay: false,
      pip: true,
      autoSize: true,
      autoMini: true,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: '#23ade5',
      lang: navigator.language.toLowerCase(),
      moreVideoAttr: {
        crossOrigin: 'anonymous',
        preload: 'metadata'
      },
    });

    if (getInstance && typeof getInstance === 'function') {
      getInstance(art);
    }

    return () => {
      if (art && art.destroy) {
        art.destroy();
      }
    };
  }, [option.url, option.poster, option.title]);

  return <div ref={artRef} {...rest}></div>;
}

export default ArtPlayer;
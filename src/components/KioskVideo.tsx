import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { VideoSource } from "../config/videoSource";
import { buildYoutubeEmbedSrc, postYoutubeCommand } from "../lib/youtubeEmbed";

const DEFAULT_FILE_SRC = "/video/school-documentary.mp4";

type Props = {
  source: VideoSource;
  /** When true, playback is paused (e.g. main menu is open). */
  paused: boolean;
  onOpenMenu: () => void;
};

export function KioskVideo({ source, paused, onOpenMenu }: Props) {
  if (source.kind === "youtube") {
    return <YoutubeKiosk videoId={source.videoId} paused={paused} onOpenMenu={onOpenMenu} />;
  }
  return <FileKiosk src={source.src ?? DEFAULT_FILE_SRC} paused={paused} onOpenMenu={onOpenMenu} />;
}

function FileKiosk({
  src,
  paused,
  onOpenMenu,
}: {
  src: string;
  paused: boolean;
  onOpenMenu: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (paused) el.pause();
    else void el.play().catch(() => {});
  }, [paused]);

  return (
    <div className="kiosk-video-wrap" role="presentation">
      <video
        ref={videoRef}
        className="kiosk-video"
        src={src}
        playsInline
        muted
        loop
        autoPlay
        onClick={onOpenMenu}
        onError={() => setLoadError(true)}
      />
      {loadError && (
        <div className="kiosk-video-fallback">
          <p className="kiosk-video-fallback-title">Video not found</p>
          <p className="kiosk-video-fallback-text">
            Add your file at <code>public/video/school-documentary.mp4</code>, set{" "}
            <code>VITE_FIREBASE_VIDEO_URL</code> to a Firebase Storage URL, or set{" "}
            <code>VITE_YOUTUBE_URL</code> in <code>.env.local</code>, then refresh.
          </p>
        </div>
      )}
      {!loadError && (
        <div className="kiosk-video-hint" aria-hidden>
          Tap anywhere for menu
        </div>
      )}
    </div>
  );
}

function YoutubeKiosk({
  videoId,
  paused,
  onOpenMenu,
}: {
  videoId: string;
  paused: boolean;
  onOpenMenu: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const embedSrc = useMemo(() => buildYoutubeEmbedSrc(videoId), [videoId]);

  const syncPlayback = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    postYoutubeCommand(win, paused ? "pauseVideo" : "playVideo");
  }, [paused]);

  useEffect(() => {
    syncPlayback();
  }, [syncPlayback]);

  const handleIframeLoad = useCallback(() => {
    syncPlayback();
  }, [syncPlayback]);

  return (
    <div className="kiosk-video-wrap kiosk-youtube" role="presentation">
      <iframe
        ref={iframeRef}
        className="kiosk-youtube-frame"
        title="School documentary"
        src={embedSrc}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={handleIframeLoad}
      />
      <button type="button" className="kiosk-youtube-tap" onClick={onOpenMenu}>
        <span className="kiosk-video-hint">Tap anywhere for menu</span>
      </button>
    </div>
  );
}

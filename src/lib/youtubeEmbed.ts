/** Extract a video id from common YouTube URL shapes (or an 11-char id). */
export function parseYoutubeVideoId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;

  const fromShort = s.match(/youtu\.be\/([^/?#]+)/i);
  if (fromShort?.[1]) return normalizeId(fromShort[1]);

  const fromWatch = s.match(/[?&]v=([^&?#]+)/i);
  if (fromWatch?.[1]) return normalizeId(fromWatch[1]);

  const fromEmbed = s.match(/youtube\.com\/embed\/([^/?#]+)/i);
  if (fromEmbed?.[1]) return normalizeId(fromEmbed[1]);

  const bare = s.replace(/[^a-zA-Z0-9_-]/g, "");
  if (/^[a-zA-Z0-9_-]{11}$/.test(bare)) return bare;

  return null;
}

function normalizeId(raw: string) {
  const id = raw.replace(/[^a-zA-Z0-9_-]/g, "");
  if (id.length < 11) return null;
  return id.slice(0, 11);
}

export function buildYoutubeEmbedSrc(videoId: string) {
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "";
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    controls: "0",
    playsinline: "1",
    modestbranding: "1",
    rel: "0",
    enablejsapi: "1",
  });
  if (origin) params.set("origin", origin);
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function postYoutubeCommand(win: Window, func: "playVideo" | "pauseVideo") {
  win.postMessage(JSON.stringify({ event: "command", func, args: "" }), "*");
}

lol import { parseYoutubeVideoId } from "../lib/youtubeEmbed";

export type VideoSource =
  | { kind: "file"; src: string }
  | { kind: "youtube"; videoId: string };

/**
 * Prefer Firebase Storage video when `VITE_FIREBASE_VIDEO_URL` is set in `.env.local`.
 * Then prefer YouTube when `VITE_YOUTUBE_URL` or `VITE_YOUTUBE_VIDEO_ID` is set.
 * Otherwise use local file at `/video/school-documentary.mp4`.
 * Restart `npm run dev` after changing env vars.
 */
export function getVideoSource(): VideoSource {
  const firebaseUrl = import.meta.env.VITE_FIREBASE_VIDEO_URL;
  if (typeof firebaseUrl === "string" && firebaseUrl.trim()) {
    return { kind: "file", src: firebaseUrl.trim() };
  }

  const fromUrl = import.meta.env.VITE_YOUTUBE_URL;
  const fromId = import.meta.env.VITE_YOUTUBE_VIDEO_ID;

  const id =
    (typeof fromId === "string" && parseYoutubeVideoId(fromId)) ||
    (typeof fromUrl === "string" && parseYoutubeVideoId(fromUrl));

  if (id) return { kind: "youtube", videoId: id };

  return { kind: "file", src: "/video/school-documentary.mp4" };
}

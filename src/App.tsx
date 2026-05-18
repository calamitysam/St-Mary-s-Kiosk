import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { getVideoSource } from "./config/videoSource";
import { FeeStructure } from "./components/FeeStructure";
import { KioskVideo } from "./components/KioskVideo";
import { MainMenu } from "./components/MainMenu";
import { StudentLookup } from "./components/StudentLookup";

type Screen = "video" | "menu" | "students" | "fees";

const videoSource = getVideoSource();

export function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState<Screen>("video");

  const tryFullscreen = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
    };
    const isFs =
      document.fullscreenElement ??
      doc.webkitFullscreenElement ??
      doc.mozFullScreenElement ??
      doc.msFullscreenElement;
    if (isFs) return;
    const req =
      el.requestFullscreen?.bind(el) ??
      (el as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen?.bind(el) ??
      (el as HTMLElement & { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen?.bind(el);
    if (req) void req().catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && screen !== "video") {
        setScreen("menu");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen]);

  const openMenu = useCallback(() => {
    tryFullscreen();
    setScreen("menu");
  }, [tryFullscreen]);

  const closeMenuToVideo = useCallback(() => {
    setScreen("video");
  }, []);

  useEffect(() => {
    if (screen !== "menu") return;

    const timeout = window.setTimeout(() => {
      setScreen("video");
    }, 10000);

    return () => window.clearTimeout(timeout);
  }, [screen]);

  const videoPaused = false;

  return (
    <div ref={rootRef} className="app-root">
      <KioskVideo source={videoSource} paused={videoPaused} onOpenMenu={openMenu} />
      {screen === "menu" && (
        <MainMenu
          onStudentDetails={() => setScreen("students")}
          onFeeStructure={() => setScreen("fees")}
          onClose={closeMenuToVideo}
        />
      )}
      {screen === "students" && <StudentLookup onBack={() => setScreen("menu")} />}
      {screen === "fees" && <FeeStructure onBack={() => setScreen("menu")} />}
    </div>
  );
}

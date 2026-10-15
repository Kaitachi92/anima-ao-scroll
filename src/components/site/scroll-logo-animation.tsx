import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 192;
const LAST_REVEAL_FRAME = 42;
const REVEAL_FRAME_COUNT = LAST_REVEAL_FRAME + 1;
const FRAME_DIRECTORY = "/frames_Purple_logo_3D_animation_20261014201641_clean_png";
const FRAME_CROP = { x: 280, y: 72, width: 720, height: 648 };

export function ScrollLogoAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingState, setLoadingState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!container || !sticky || !canvas || !context) {
      console.error("The scroll logo animation could not initialize its canvas.");
      return;
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const images: HTMLImageElement[] = [];
    const failedFrames = new Set<number>();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = reducedMotion.matches;
    let drawRequest = 0;
    let disposed = false;
    let settledFrames = 0;
    let usableFrames = 0;
    let lastDrawnFrame = -1;
    let lastCanvasWidth = 0;
    let lastCanvasHeight = 0;

    const getScrollProgress = () => {
      if (prefersReducedMotion) return 1;
      const trackTop = container.getBoundingClientRect().top + window.scrollY;
      const stickyTop = Number.parseFloat(window.getComputedStyle(sticky).top);
      const scrollDistance = container.offsetHeight - sticky.offsetHeight;
      return Math.max(
        0,
        Math.min(1, (window.scrollY + stickyTop - trackTop) / Math.max(scrollDistance, 1)),
      );
    };

    const draw = () => {
      drawRequest = 0;
      if (disposed) return;

      const progress = getScrollProgress();
      const frame = Math.round(progress * LAST_REVEAL_FRAME);

      const image = images[frame];
      if (
        !image ||
        failedFrames.has(frame) ||
        !image.complete ||
        !image.naturalWidth ||
        !image.naturalHeight
      ) {
        return;
      }

      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const pixelRatio = Math.max(window.devicePixelRatio || 1, 1);
      const pixelWidth = Math.round(bounds.width * pixelRatio);
      const pixelHeight = Math.round(bounds.height * pixelRatio);

      if (
        frame === lastDrawnFrame &&
        canvas.width === pixelWidth &&
        canvas.height === pixelHeight &&
        lastCanvasWidth === bounds.width &&
        lastCanvasHeight === bounds.height
      ) {
        return;
      }

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      const scaleX = canvas.width / bounds.width;
      const scaleY = canvas.height / bounds.height;
      context.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);

      if (frame === 0) {
        lastDrawnFrame = frame;
        lastCanvasWidth = bounds.width;
        lastCanvasHeight = bounds.height;
        return;
      }

      const scale = Math.min(bounds.width / FRAME_CROP.width, bounds.height / FRAME_CROP.height);
      const width = FRAME_CROP.width * scale;
      const height = FRAME_CROP.height * scale;

      try {
        context.drawImage(
          image,
          FRAME_CROP.x,
          FRAME_CROP.y,
          FRAME_CROP.width,
          FRAME_CROP.height,
          (bounds.width - width) / 2,
          (bounds.height - height) / 2,
          width,
          height,
        );
        lastDrawnFrame = frame;
        lastCanvasWidth = bounds.width;
        lastCanvasHeight = bounds.height;
      } catch (error) {
        failedFrames.add(frame);
        console.error(`The scroll logo frame could not be drawn: ${image.src}`, error);
        if (failedFrames.size === REVEAL_FRAME_COUNT && settledFrames === REVEAL_FRAME_COUNT) {
          setLoadingState("error");
        }
        scheduleDraw();
      }
    };

    const scheduleDraw = () => {
      if (drawRequest === 0) {
        drawRequest = window.requestAnimationFrame(draw);
      }
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      scheduleDraw();
    };

    window.addEventListener("scroll", scheduleDraw, { passive: true });
    window.addEventListener("resize", scheduleDraw);
    reducedMotion.addEventListener("change", handleMotionChange);

    const resizeObserver = new ResizeObserver(scheduleDraw);
    resizeObserver.observe(container);
    resizeObserver.observe(sticky);

    const settleFrame = () => {
      settledFrames += 1;
      if (settledFrames === REVEAL_FRAME_COUNT && usableFrames === 0) {
        setLoadingState("error");
      }
    };

    for (let index = 0; index < REVEAL_FRAME_COUNT; index += 1) {
      const image = new Image();
      images[index] = image;
      image.decoding = "async";
      image.onload = () => {
        settleFrame();
        if (image.naturalWidth > 0 && image.naturalHeight > 0) {
          usableFrames += 1;
          setLoadingState("ready");
          scheduleDraw();
          return;
        }

        failedFrames.add(index);
        console.error(`The scroll logo frame is invalid: ${image.src}`);
        scheduleDraw();
      };
      image.onerror = () => {
        failedFrames.add(index);
        settleFrame();
        console.error(`The scroll logo frame failed to load: ${image.src}`);
        scheduleDraw();
      };
      image.src = `${FRAME_DIRECTORY}/frame_${String(index).padStart(6, "0")}.png`;
    }

    scheduleDraw();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", scheduleDraw);
      window.removeEventListener("resize", scheduleDraw);
      reducedMotion.removeEventListener("change", handleMotionChange);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(drawRequest);

      for (const image of images) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-logo-animation">
      <div ref={stickyRef} className="hero-logo-sticky">
        <div className="hero-logo-stage">
          <div className="hero-logo-panel">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="Logo roxo tridimensional animado pelo scroll"
            />
            {loadingState !== "ready" && (
              <span className="hero-logo-status" role="status">
                {loadingState === "loading" ? "Carregando animação" : "Animação indisponível"}
              </span>
            )}
            <div className="hero-logo-caption" aria-hidden="true">
              <span>Identidade em movimento</span>
              <span>Role para acompanhar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

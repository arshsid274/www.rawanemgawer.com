import { useState, useEffect } from "react";

/**
 * Preloads a numbered image sequence (001.webp … NNN.webp) from a public folder.
 * All frames are fetched in parallel so total load time = slowest single frame.
 */
export const useImagePreloader = (
  sequencePath: string,
  frameCount: number,
  enabled = true,
) => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const loadImages = async () => {
      const promises = Array.from({ length: frameCount }, (_, i) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.src = `${sequencePath}/${(i + 1).toString().padStart(3, "0")}.webp`;
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
        }),
      );

      const all = await Promise.all(promises);

      if (!cancelled) {
        setImages(all.filter((img) => img.width > 0));
        setLoaded(true);
      }
    };

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [sequencePath, frameCount, enabled]);

  return { images, loaded };
};

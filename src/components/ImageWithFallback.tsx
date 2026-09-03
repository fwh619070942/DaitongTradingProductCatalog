import { useEffect, useState } from "react";
import { FALLBACK_IMAGE } from "../lib/images";

type ImageWithFallbackProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

export function ImageWithFallback({ src, alt, ...props }: ImageWithFallbackProps) {
  const [activeSrc, setActiveSrc] = useState(src || FALLBACK_IMAGE);

  useEffect(() => {
    setActiveSrc(src || FALLBACK_IMAGE);
  }, [src]);

  return (
    <img
      {...props}
      alt={alt}
      src={activeSrc}
      onError={() => {
        if (activeSrc !== FALLBACK_IMAGE) {
          setActiveSrc(FALLBACK_IMAGE);
        }
      }}
    />
  );
}

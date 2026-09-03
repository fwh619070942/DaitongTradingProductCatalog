import { useEffect, useState } from "react";
import { FALLBACK_IMAGE, publicImageUrl } from "../lib/images";

type ImageWithFallbackProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

export function ImageWithFallback({ src, alt, ...props }: ImageWithFallbackProps) {
  const fallbackSrc = publicImageUrl(FALLBACK_IMAGE);
  const [activeSrc, setActiveSrc] = useState(publicImageUrl(src) || fallbackSrc);

  useEffect(() => {
    setActiveSrc(publicImageUrl(src) || fallbackSrc);
  }, [fallbackSrc, src]);

  return (
    <img
      {...props}
      alt={alt}
      src={activeSrc}
      onError={() => {
        if (activeSrc !== fallbackSrc) {
          setActiveSrc(fallbackSrc);
        }
      }}
    />
  );
}

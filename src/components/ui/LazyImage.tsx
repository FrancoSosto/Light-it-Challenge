import { useState, useEffect, type ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  src: string;
  alt: string;
  placeholder?: string;
}

export function LazyImage({ src, alt, className, placeholder, ...props }: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };

    img.onerror = () => {
      setImageError(true);
      setImageLoaded(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (imageError) {
    return (
      <div
        className={cn('flex items-center justify-center bg-borde/30 text-mute', className)}
        role="img"
        aria-label={alt}
      >
        <span className="text-2xl">👤</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn('transition-opacity duration-300', imageLoaded ? 'opacity-100' : 'opacity-50', className)}
      loading="lazy"
      {...props}
    />
  );
}

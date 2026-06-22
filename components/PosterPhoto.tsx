import Image from "next/image";

type PosterPhotoProps = {
  alt: string;
  className?: string;
  priority?: boolean;
  src: string;
  stamp?: string;
};

export function PosterPhoto({ alt, className = "", priority = false, src, stamp }: PosterPhotoProps) {
  return (
    <figure className={`relative overflow-hidden border-2 border-white bg-black ${className}`}>
      <Image
        alt={alt}
        className="image-grit object-cover"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        src={src}
      />
      <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-xs uppercase">
        <span className="h-3 w-3 rounded-full bg-shock" />
        REC
      </div>
      {stamp ? <figcaption className="absolute bottom-4 right-4 font-mono text-xs uppercase text-shock">{stamp}</figcaption> : null}
    </figure>
  );
}

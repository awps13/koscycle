"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ImageGallery({ images, title }: { images: { url: string }[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
        {current ? (
          <Image
            src={current.url}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="scrollbar-none flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Foto ${i + 1}`}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition",
                i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

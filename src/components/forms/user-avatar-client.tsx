"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";

export function UserAvatarClient({ name, image }: { name: string; image?: string }) {
  return (
    <Avatar className="size-16">
      {image ? <AvatarImage src={image} alt={name} /> : null}
      <AvatarFallback className="bg-mint text-lg font-bold text-mint-foreground">{initials(name)}</AvatarFallback>
    </Avatar>
  );
}

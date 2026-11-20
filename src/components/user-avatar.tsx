import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  image,
  verified,
  className,
}: {
  name: string;
  image?: string | null;
  verified?: boolean;
  className?: string;
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <Avatar className={cn("size-9", className)}>
        {image ? <AvatarImage src={image} alt={name} /> : null}
        <AvatarFallback className="bg-mint font-semibold text-mint-foreground">{initials(name)}</AvatarFallback>
      </Avatar>
      {verified ? (
        <BadgeCheck
          className="absolute -right-1 -bottom-1 size-4 rounded-full bg-background fill-primary text-primary-foreground"
          aria-label="KTM terverifikasi"
        />
      ) : null}
    </span>
  );
}

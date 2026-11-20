"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LayoutGrid, LogOut, MessageCircle, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { signOut } from "@/lib/auth-client";

export function UserMenu({
  name,
  email,
  image,
  verified,
}: {
  name: string;
  email: string;
  image?: string | null;
  verified: boolean;
}) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        aria-label="Menu akun"
      >
        <UserAvatar name={name} image={image} verified={verified} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
            <span className="text-sm font-semibold text-foreground">{name}</span>
            <span className="truncate">{email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LayoutGrid /> Iklan Saya
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/favorit" />}>
          <Heart /> Favorit
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/pesan" />}>
          <MessageCircle /> Pesan
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/profil" />}>
          <UserRound /> Profil & KTM
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut /> Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

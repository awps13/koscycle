import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { CampusPicker, CampusPickerFallback } from "./campus-picker";
import { HeaderSearch } from "./header-search";
import { HeaderUser, HeaderUserFallback } from "./header-user";
import { MobileNav } from "./mobile-nav";
import { NavLinks, NavLinksFallback } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="container-page flex h-16 items-center gap-3 lg:gap-5">
        <MobileNav />
        <Logo />
        <div className="hidden md:block">
          <Suspense fallback={<CampusPickerFallback />}>
            <CampusPicker />
          </Suspense>
        </div>
        <div className="hidden xl:block">
          <HeaderSearch />
        </div>
        <Suspense fallback={<NavLinksFallback className="ml-auto hidden lg:flex" />}>
          <NavLinks className="ml-auto hidden lg:flex" />
        </Suspense>
        <div className="ml-auto lg:ml-2">
          <Suspense fallback={<HeaderUserFallback />}>
            <HeaderUser />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

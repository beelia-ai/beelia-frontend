"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";

const navItems = [
  { name: "Users", link: "#users" },
  { name: "Creators", link: "#creators" },
  { name: "Investors", link: "#investors" },
];

export function NavbarWrapper() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <NavbarButton variant="primary" href="/waitlist">
            Join Waitlist
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              className="w-full text-neutral-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton variant="primary" href="/waitlist" className="w-full">
              Join Waitlist
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

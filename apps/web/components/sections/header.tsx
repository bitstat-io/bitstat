"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavItemsProps } from "@workspace/ui/lib/types";
import { IconLogo } from "@workspace/ui/components/logo";
import ThemeToggler from "@workspace/ui/components/theme-toggler";
import Link from "next/link";
import { IconBrandDiscord, IconBrandX } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";

export default function Header() {
  const [menuState, setMenuState] = useState(false);

  const navItems: NavItemsProps[] = [
    {
      name: "Axie Infinity",
      href: "/axie-infinity",
      target: "",
    },
    {
      name: "Splinterlands",
      href: "#",
      target: "",
    },
    {
      name: "Off The Grid",
      href: "#",
      target: "",
    },
    {
      name: "Maple Story",
      href: "#",
      target: "",
    },
    {
      name: "Battle Field 6",
      href: "#",
      target: "",
    },
    {
      name: "Call of Duty 6",
      href: "#",
      target: "",
    },
    {
      name: "Counter Strike 2",
      href: "#",
      target: "",
    },
    {
      name: "Fortnite",
      href: "#",
      target: "",
    },
    {
      name: "Rivals",
      href: "#",
      target: "",
    },
    {
      name: "Valorant",
      href: "#",
      target: "",
    },
  ];

  return (
    <header className="border-x fixed top-0 z-30 w-full border-b bg-background/80 backdrop-blur-3xl">
      <nav data-state={menuState && "active"}>
        <div className="relative flex flex-wrap items-center justify-between gap-0 2xl:gap-0">
          <div className="flex w-full justify-between 2xl:w-auto">
            <Link
              href="/"
              aria-label="home"
              className="flex items-center space-x-2 text-lg font-mono font-bold text-shadow-lg border-r p-4 bg-input/30"
            >
              <div className="flex items-center font-mono gap-2 text-xl font-bold">
                <IconLogo className="text-primary" width={30} /> bitstat
              </div>
            </Link>

            <button
              onClick={() => setMenuState(!menuState)}
              aria-label={menuState == true ? "Close Menu" : "Open Menu"}
              className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 2xl:hidden pr-6"
            >
              <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
              <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
            </button>
          </div>

          <div className="absolute inset-0 m-auto hidden size-fit 2xl:block">
            <ul className="flex gap-8 text-sm">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    target={item.target}
                    className="text-muted-foreground hover:text-accent-foreground duration-150 flex items-center gap-1"
                  >
                    {/* {item.icon} */}

                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="2xl:border-t-0 border-t in-data-[state=active]:block 2xl:in-data-[state=active]:flex hidden w-full flex-wrap items-center justify-end space-y-8 p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap 2xl:m-0 2xl:flex 2xl:w-fit 2xl:gap-6 2xl:space-y-0 2xl:p-0 2xl:shadow-none dark:shadow-none">
            <div className="2xl:hidden">
              <ul className="space-y-6 text-base">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      target={item.target}
                      className="text-muted-foreground hover:text-accent-foreground duration-150 flex items-center gap-1"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pr-4 flex items-center">
              <Button variant="ghost" asChild className="text-muted-foreground">
                <Link
                  href="https://x.com/bitstatofficial"
                  target="_blank"
                  className="text-muted-foreground hover:text-accent-foreground duration-150 flex items-center gap-1"
                >
                  <IconBrandX className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" asChild className="text-muted-foreground">
                <Link
                  href="ttps://discord.gg/kmq82Xf9"
                  target="_blank"
                  className="text-muted-foreground hover:text-accent-foreground duration-150 flex items-center gap-1"
                >
                  <IconBrandDiscord className="h-5 w-5" />
                </Link>
              </Button>
              <ThemeToggler />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

"use client";

import {
  IconBook,
  IconDeviceGamepad2,
  IconHome,
  IconReceipt,
} from "@tabler/icons-react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavItemsProps } from "@workspace/ui/lib/types";
import { IconLogo } from "@workspace/ui/components/logo";
import ThemeToggler from "@workspace/ui/components/theme-toggler";
import Link from "next/link";

export default function Header() {
  const [menuState, setMenuState] = useState(false);

  const navItems: NavItemsProps[] = [
    { name: "Home", href: "#hero", target: "", icon: <IconHome size={15} /> },
    {
      name: "Features",
      href: "#features",
      target: "",
      icon: <IconLogo size={15} />,
    },
    {
      name: "Pricing",
      href: "#pricing",
      target: "",
      icon: <IconReceipt size={15} />,
    },
    {
      name: "Games",
      href: "https://bitstat.io",
      target: "_blank",
      icon: <IconDeviceGamepad2 size={15} />,
    },
    {
      name: "Docs",
      href: "https://bitstat-whitepaper.gitbook.io/bitstat-whitepaper-docs/",
      target: "_blank",
      icon: <IconBook size={15} />,
    },
  ];

  return (
    <header id="headers" className="border-x">
      <nav data-state={menuState && "active"} className="container mx-auto">
        <div className="px-6">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2 text-lg font-mono font-bold text-shadow-lg"
              >
                <div className="flex items-center font-mono gap-2 text-xl font-bold">
                  <IconLogo className="text-primary" width={30} /> bitstat
                </div>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      target={item.target}
                      className="text-muted-foreground hover:text-accent-foreground duration-150 flex items-center gap-1"
                    >
                      {item.icon}

                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:p-0 lg:shadow-none dark:shadow-none">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {navItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        target={item.target}
                        className="text-muted-foreground hover:text-accent-foreground duration-150 flex items-center gap-1"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <ThemeToggler />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

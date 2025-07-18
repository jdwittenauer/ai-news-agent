"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Stats", href: "/stats" },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between transition-all duration-300 backdrop-blur",
        scrolled ? "bg-white/80 shadow-md" : "bg-white"
      )}
    >
      <h1 className="text-3xl font-bold text-gray-900">AI News Trends</h1>

      <nav className="ml-8 flex gap-6 items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "text-base font-medium transition-colors hover:text-black",
              pathname === item.href ? "text-black underline" : "text-gray-500"
            )}
          >
            {item.name}
          </Link>
        ))}

        <Image
          src="/globe.svg"
          alt="Logo"
          width={40}
          height={40}
          className="ml-4 rounded-full"
        />
      </nav>
    </header>
  );
}

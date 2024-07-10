import Link from "next/link";
import React from "react";

import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import { getAuthSession } from "@/lib/nextauth";
import SignInButton from "./SignInButton";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[100] h-fit border-b border-zinc-300  py-2 ">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2">
          <p className="rounded-lg px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
          Study<span className="text-blue-500">Ground.AI</span>
          </p>
        </Link>
        <div className="flex items-center">
          <ThemeToggle className="mr-4" />
          {session?.user ? (
            // <UserAccountNav user={session.user} />
            <div/>
          ) : (
            <SignInButton text={"Sign In"} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

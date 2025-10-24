// import Image from "next/image";
import { Geist } from "next/font/google";
import Head from "next/head";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Home() {
  return (
	<div
	  className={`${geistSans.className} flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
	>
	  <Head>
		<title>i.am.grid &middot; Todo 2025 B</title>
	  </Head>
	  <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
		<p>testing 1-2-3</p>
		<Button>Click Me</Button>
	  </main>
	</div>
  );
}

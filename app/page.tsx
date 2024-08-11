import Hero from "@/components/shared/Hero";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-between pb-24">
      <Hero />
      Welcome to the first front-end anime watcher
      <Button>Test</Button>
    </main>
  );
}

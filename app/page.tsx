import { Navbar } from "@/components/Navbar";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      <Navbar />
      <BackgroundVideo />
      <Hero />
    </div>
  );
}

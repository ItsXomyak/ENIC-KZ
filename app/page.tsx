import { Footer2 } from "@/components/footer2";
import { Hero32 } from "@/components/hero32";
import { Navbar1 } from "@/components/navbar1";

export default function Home() {
  return (
    <div>
      <div className="ml-30">
        <Navbar1/>
      </div>
      <Hero32/>
      <Footer2 className="mx-auto w-fit" />
      </div>
  );
}
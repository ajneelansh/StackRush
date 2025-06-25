import { Hero } from "@/components/Hero";
import NavBar from "@/components/NavBar";
import { Features } from "@/components/Features"; 
import { ProductShowcase } from "@/components/ProductShowcase";
import { FAQs } from "@/components/Faqs";
import { Footer } from "@/components/Footer";
import MentorsHero from "@/components/Mentors-hero";

export default function Home() {
  return (
    <>
    <NavBar/>
    <Hero/>
    <section id="features">
    <Features/>
    </section>
    <ProductShowcase/>
    <FAQs/>
    <Footer/>
    </>
  );
}

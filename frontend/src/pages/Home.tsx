import Hero from '../components/Hero';
import { FeaturesSection } from '../components/Features';
import { TestimonialsSection } from '../components/Testimonials';
import { DashboardPreview } from '../components/DashBoardPreview';
import { FAQsSection } from '../components/FAQsSection';
// import { Footer } from '../components/Footer'; 

const Home = () => {
  return (
    <>          
      <Hero />
      <FeaturesSection />
      <TestimonialsSection />
      <DashboardPreview />
      <FAQsSection />
      
    </>
  );
};

export default Home;

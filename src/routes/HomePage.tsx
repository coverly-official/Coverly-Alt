import React from 'react';
import { Hero } from '@/components/home/Hero';
import { TrustBar } from '@/components/home/TrustBar';
import { CategoryBento } from '@/components/home/CategoryBento';
import { HowItWorks } from '@/components/home/HowItWorks';
import { FeaturedSuppliers } from '@/components/home/FeaturedSuppliers';
import { DualPathCTA } from '@/components/home/DualPathCTA';
import { Testimonials } from '@/components/home/Testimonials';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      <Hero />
      <TrustBar />
      <CategoryBento />
      <HowItWorks />
      <FeaturedSuppliers />
      <DualPathCTA />
      <Testimonials />
    </div>
  );
};

export default HomePage;

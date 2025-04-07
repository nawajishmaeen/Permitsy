import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PopularDestinations from '@/components/PopularDestinations';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import PopularCountries from '@/components/PopularCountries';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Shield, Users, Clock, Award, Globe, Zap, ArrowRight, LightbulbIcon, MapPin, FileCheck } from 'lucide-react';
import WhyChooseUs from '@/components/WhyChooseUs';
import TrustedPartners from '@/components/TrustedPartners';
import ApplicationSteps from '@/components/ApplicationSteps';
import { useIsMobile } from '@/hooks/use-mobile';
import VisaComparisonSection from '@/components/VisaComparisonSection';
import TravelTipsSection from '@/components/TravelTipsSection';
import VisaDocumentChecklist from '@/components/VisaDocumentChecklist';
import AddonServicesSection from '@/components/countries/AddonServicesSection';
import { getAddonServices, AddonService } from '@/models/addon_services';

const Index = () => {
  const isMobile = useIsMobile();
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  
  const [addonServices, setAddonServices] = useState<AddonService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const services = await getAddonServices();
        setAddonServices(services.slice(0, 4)); // Get first 4 services for the homepage
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching addon services:", error);
        // Fallback to sample data if there's an error or no services found
        if (addonServices.length === 0) {
          setAddonServices(sampleAddonServices);
        }
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  // Sample add-on services data as fallback
  const sampleAddonServices: AddonService[] = [
    {
      id: '1',
      name: 'Rental Agreement',
      description: 'Legal documentation for property rental with verified attestation',
      price: '1200',
      delivery_days: 3,
      discount_percentage: 20,
      image_url: 'https://images.pexels.com/photos/955395/pexels-photo-955395.jpeg'
    },
    {
      id: '2',
      name: 'Hotel Booking',
      description: 'Premium hotel reservation service with guaranteed confirmation',
      price: '800',
      delivery_days: 2,
      discount_percentage: 15,
      image_url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
    },
    {
      id: '3',
      name: 'Flight Tickets',
      description: 'Discounted international flight booking with flexible changes',
      price: '800',
      delivery_days: 1,
      discount_percentage: 10,
      image_url: 'https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg'
    },
    {
      id: '4',
      name: 'Police Clearance Certificate',
      description: 'Official criminal record verification from authorities',
      price: '2500',
      delivery_days: 7,
      discount_percentage: 5,
      image_url: 'https://images.pexels.com/photos/4021256/pexels-photo-4021256.jpeg'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50/30 overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Enhanced Stats section */}
        <motion.div 
          className="py-12 md:py-16 bg-gradient-to-r from-indigo-50 to-blue-50 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Why Travelers Trust Permitsy</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Our proven track record speaks for itself - join thousands of satisfied travelers who've simplified their visa journey with us.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  icon: Shield, 
                  count: '98%', 
                  label: 'Success Rate', 
                  description: 'Applications approved on first submission',
                  color: 'bg-blue-100 text-blue-600' 
                },
                { 
                  icon: Users, 
                  count: '50k+', 
                  label: 'Happy Travelers', 
                  description: 'Satisfied customers worldwide',
                  color: 'bg-indigo-100 text-indigo-600' 
                },
                { 
                  icon: Clock, 
                  count: '10x', 
                  label: 'Faster Processing', 
                  description: 'Compared to traditional methods',
                  color: 'bg-teal-100 text-teal-600' 
                }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 transform transition duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={`w-14 h-14 rounded-full ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.count}</h3>
                  <p className="text-lg font-medium text-gray-700 mb-2">{stat.label}</p>
                  <p className="text-gray-500 text-center">{stat.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <ApplicationSteps />
        
        {/* Document Checklist - New Section */}
        <VisaDocumentChecklist />
        
        <div className="py-12 md:py-20 bg-white px-4">
          <PopularDestinations />
        </div>
        
        <HowItWorks />
        
        {/* Visa Comparison - New Section */}
        <VisaComparisonSection />
        
        <WhyChooseUs />
        
        <TravelTipsSection />

        {/* Addon Services Section */}
        <AddonServicesSection />
        
        <div className="py-12 md:py-20 bg-gradient-to-b from-blue-50/60 to-white px-4">
          <Testimonials />
        </div>
        
        <TrustedPartners />
        
        <div className="py-12 md:py-20 bg-white px-4">
          <PopularCountries />
        </div>
        
        {/* Admin login section */}
        <motion.div 
          className="py-12 bg-gray-50 border-t border-gray-200 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Portal</h2>
              <p className="text-gray-600 mb-6">
                If you're an administrator, access the admin dashboard to manage countries, visa applications, and more.
              </p>
              <Link to="/admin-login">
                <Button className="bg-navy hover:bg-navy/90 shadow-md transition-all duration-300 hover:shadow-lg">
                  Access Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

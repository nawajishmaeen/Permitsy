import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Plane, BadgeCheck, MapPin, Heart, ChevronRight, Check, Clock, Globe, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

// Add visa package type definition
type VisaPackage = {
  id: string;
  country_id: string;
  name: string;
  government_fee: number;
  service_fee: number;
  processing_days: number;
  total_price: number;
  created_at: string;
  updated_at: string;
};

type CountryCardProps = {
  country: any;
  viewMode: 'grid' | 'list';
  isSaved: boolean;
  onToggleSave: () => void;
  getContinent: (countryName: string) => string;
};

const CountryCard = ({ country, viewMode, isSaved, onToggleSave, getContinent }: CountryCardProps) => {
  const [visaPackage, setVisaPackage] = useState<VisaPackage | null>(null);
  const [isLoadingPackage, setIsLoadingPackage] = useState(false);

  // Fetch visa package for this country
  useEffect(() => {
    const fetchVisaPackage = async () => {
      if (!country.id) return;
      
      setIsLoadingPackage(true);
      try {
        const { data, error } = await supabase
          .from('visa_packages')
          .select('*')
          .eq('country_id', country.id)
          .single();
        
        if (error) {
          console.error('Error fetching visa package:', error);
          setVisaPackage(null);
        } else {
          setVisaPackage(data);
        }
      } catch (err) {
        console.error('Failed to fetch visa package:', err);
        setVisaPackage(null);
      } finally {
        setIsLoadingPackage(false);
      }
    };

    fetchVisaPackage();
  }, [country.id]);
  
  // Helper function to get correct flag URL format based on country name
  const getCountryFlagUrl = (country: any) => {
    // If there's already a valid flag URL stored, use that
    if (country.flag && country.flag.includes('http')) {
      return country.flag;
    }
    
    // Convert country name to ISO code for flag CDN usage
    const countryIsoMap: {[key: string]: string} = {
      'United States': 'us',
      'Canada': 'ca',
      'United Kingdom': 'gb',
      'Australia': 'au',
      'Japan': 'jp',
      'Germany': 'de',
      'France': 'fr',
      'Singapore': 'sg',
      'UAE': 'ae',
      'India': 'in',
      'China': 'cn',
      'Italy': 'it',
      'Spain': 'es'
    };
    
    const isoCode = countryIsoMap[country.name] || 'xx';
    return `https://flagcdn.com/w320/${isoCode.toLowerCase()}.png`;
  };

  // Get visa types for a country 
  const getVisaTypes = (country: any) => {
    return ['Tourist Visa']; // Only show Tourist Visa
  };

  // Generate pricing and details
  const getCountryDetails = (country: any) => {
    // Use visa package data if available
    const visaPackage = country.visa_packages?.[0];
    if (visaPackage) {
      const totalPrice = visaPackage.total_price || 
        (visaPackage.government_fee || 0) + (visaPackage.service_fee || 0);
      
      return {
        price: `₹${totalPrice.toLocaleString('en-IN')}`,
        visaCount: '25K+', // Keep a default high count for now
        entryDate: `Get in ${visaPackage.processing_days || 7} days`,
        flightInfo: '2 direct flights from ₹60k',
        processingTime: `${visaPackage.processing_days || 7} business days`
      };
    }
    
    // Fallback values if no visa package is available
    return {
      price: '₹1,999',
      visaCount: '15K+',
      entryDate: 'Get in 7 days',
      flightInfo: '5 direct flights from ₹60k',
      processingTime: '7-10 business days'
    };
  };

  const { price, visaCount, entryDate, flightInfo, processingTime } = getCountryDetails(country);

  // Grid view card
  if (viewMode === 'grid') {
    return (
      <Link to={`/country/${country.id}`} className="block h-full">
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group rounded-xl border-0 shadow-md">
          <div className="relative">
            <AspectRatio ratio={16/9} className="bg-gray-100">
              <img 
                src={country.banner || 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1000'} 
                alt={country.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1000';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
            </AspectRatio>
            
            {/* Visa count badge */}
            <Badge className="absolute top-3 left-3 bg-blue-600/90 text-white border-0 py-1.5 px-3 rounded-full backdrop-blur-sm">
              {visaCount} Visas on Time
            </Badge>
            
            {/* Special label for certain countries */}
            {country.name === 'Japan' && (
              <div className="absolute top-3 right-3">
                <div className="bg-amber-400/90 text-xs font-bold px-3 py-1.5 rounded-full text-gray-900 flex items-center backdrop-blur-sm">
                  <BadgeCheck className="w-3.5 h-3.5 mr-1" /> 
                  Fast Track
                </div>
              </div>
            )}
            
            {/* Country name and continent */}
            <div className="absolute bottom-3 left-3 z-20">
              <h3 className="font-semibold text-xl text-white mb-1">{country.name}</h3>
              <div className="flex items-center text-sm text-white/90 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                <MapPin size={12} className="mr-1" /> 
                <span>{getContinent(country.name)}</span>
              </div>
            </div>
            
            {/* Flag at bottom right */}
            <div className="absolute bottom-3 right-3 z-20 bg-white/20 backdrop-blur-md rounded-full p-1 shadow-lg border border-white/30">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src={getCountryFlagUrl(country)}
                  alt={`${country.name} flag`} 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/320x160?text=Flag';
                  }}
                />
              </div>
            </div>
            
            {/* Save button */}
            <Button
              size="sm"
              variant="ghost"
              className={`absolute top-11 right-3 z-20 h-8 w-8 p-0 
                ${isSaved 
                  ? 'bg-pink-500/90 text-white hover:bg-pink-600/90 hover:text-white' 
                  : 'bg-black/30 text-white hover:bg-black/40 hover:text-white'
                } backdrop-blur-sm`}
              onClick={(e) => {
                e.preventDefault();
                onToggleSave();
              }}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>
          
          <div className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0 text-indigo-500" />
                <span className="truncate">{processingTime}</span>
              </div>
              {isLoadingPackage ? (
                <div className="flex items-center">
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1 text-gray-400" />
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : (
                <span className="font-bold text-indigo-600">{price}</span>
              )}
            </div>
            
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <Plane className="h-3.5 w-3.5 mr-1 flex-shrink-0 text-indigo-500" />
              <span className="truncate">{flightInfo}</span>
            </div>
            
            <div className="mt-auto">
              <div className="flex flex-wrap gap-1 mb-3">
                {getVisaTypes(country).map((type, i) => (
                  <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                    {type}
                  </span>
                ))}
              </div>
              
              <Button 
                size="sm" 
                className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    );
  }
  
  // List view card
  return (
    <Link to={`/country/${country.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm group">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/4 lg:w-1/5">
            <AspectRatio ratio={16/9} className="md:h-full md:w-full bg-gray-100">
              <img 
                src={country.banner || 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1000'} 
                alt={country.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1000';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gradient-to-b"></div>
              
              {/* Flag overlay */}
              <div className="absolute top-3 left-3 z-20 bg-white/20 backdrop-blur-md rounded-full p-1 shadow-lg border border-white/30 md:bottom-3 md:top-auto">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={getCountryFlagUrl(country)}
                    alt={`${country.name} flag`} 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/320x160?text=Flag';
                    }}
                  />
                </div>
              </div>
              
              {/* Save button */}
              <Button
                size="sm"
                variant="ghost"
                className={`absolute top-3 right-3 z-20 h-8 w-8 p-0 
                  ${isSaved 
                    ? 'bg-pink-500/90 text-white hover:bg-pink-600/90 hover:text-white' 
                    : 'bg-black/30 text-white hover:bg-black/40 hover:text-white'
                  } backdrop-blur-sm`}
                onClick={(e) => {
                  e.preventDefault();
                  onToggleSave();
                }}
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </AspectRatio>
          </div>
          
          <div className="p-4 flex-grow flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="md:w-1/3">
              <div className="flex items-center">
                <h3 className="font-semibold text-lg text-gray-900">{country.name}</h3>
                {country.name === 'Japan' && (
                  <Badge className="ml-2 bg-amber-400 text-gray-900 border-0">Fast Track</Badge>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin size={14} className="mr-1" /> 
                <span>{getContinent(country.name)}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {getVisaTypes(country).map((type, i) => (
                  <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-3 md:mt-0 md:w-1/3">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Clock className="h-4 w-4 mr-1 flex-shrink-0 text-indigo-500" />
                <span>{processingTime}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="h-4 w-4 mr-1 flex-shrink-0 text-indigo-500" />
                <span>{visaCount} visas processed</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center justify-between md:w-1/4 md:justify-end">
              {isLoadingPackage ? (
                <div className="flex items-center">
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1 text-gray-400" />
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : (
                <span className="font-bold text-lg text-indigo-600">{price}</span>
              )}
              <Button 
                size="sm" 
                className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white ml-4"
              >
                Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CountryCard;

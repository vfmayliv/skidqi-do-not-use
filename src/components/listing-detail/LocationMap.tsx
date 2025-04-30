
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationMapProps {
  city: string;
  coordinates?: { lat: number; lng: number };
  language: string;
}

const LocationMap = ({ city, coordinates, language }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  
  // Load Yandex Maps script
  useEffect(() => {
    if (document.getElementById('yandex-maps-script')) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'yandex-maps-script';
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=your-api-key&lang=ru_RU';
    script.async = true;
    
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error('Error loading Yandex Maps script:', error);
    };
    
    document.head.appendChild(script);
  }, []);

  // Initialize map when script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !mapContainer.current) return;
    
    // Wait for ymaps to be available
    if (!(window as any).ymaps) {
      const checkYmaps = setInterval(() => {
        if ((window as any).ymaps) {
          clearInterval(checkYmaps);
          initializeMap();
        }
      }, 100);
      return;
    }
    
    initializeMap();
  }, [isScriptLoaded, coordinates, city]);

  // Initialize Yandex Map
  const initializeMap = () => {
    const ymaps = (window as any).ymaps;
    
    ymaps.ready(() => {
      if (mapRef.current) {
        mapRef.current.destroy();
      }
      
      // Create map instance
      mapRef.current = new ymaps.Map(mapContainer.current, {
        center: coordinates ? [coordinates.lat, coordinates.lng] : [43.25, 76.85], // Default to Almaty if no coords
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl']
      });
      
      // Add controls
      mapRef.current.controls.add('searchControl');
      mapRef.current.controls.add('geolocationControl', { float: 'right' });
      
      // If we have specific coordinates, add a marker
      if (coordinates) {
        const placemark = new ymaps.Placemark([coordinates.lat, coordinates.lng], {
          hintContent: city
        }, {
          preset: 'islands#redDotIconWithCaption'
        });
        
        mapRef.current.geoObjects.add(placemark);
      } else {
        // If we don't have coordinates, search for the city
        const geocoder = ymaps.geocode(city);
        geocoder.then((res: any) => {
          const firstGeoObject = res.geoObjects.get(0);
          
          if (firstGeoObject) {
            const coords = firstGeoObject.geometry.getCoordinates();
            const bounds = firstGeoObject.properties.get('boundedBy');
            
            // Create a placemark at the found location
            const placemark = new ymaps.Placemark(coords, {
              hintContent: city
            }, {
              preset: 'islands#redDotIconWithCaption'
            });
            
            mapRef.current.geoObjects.add(placemark);
            
            // Adjust the map to show the found city
            if (bounds) {
              mapRef.current.setBounds(bounds, {
                checkZoomRange: true
              });
            }
          }
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-primary" />
        {language === 'ru' ? 'Местоположение' : 'Орналасқан жері'}
      </h2>
      <div ref={mapContainer} className="w-full h-[300px] rounded overflow-hidden"></div>
      <div className="mt-3 text-sm text-muted-foreground">
        {city}
      </div>
      <Button variant="outline" className="mt-3 text-sm" size="sm" onClick={() => {
        const url = `https://maps.yandex.ru/?text=${encodeURIComponent(city)}`;
        window.open(url, '_blank');
      }}>
        <MapPin className="h-4 w-4 mr-2" />
        {language === 'ru' ? 'Открыть на Яндекс Картах' : 'Яндекс Карталарда ашу'}
      </Button>
    </div>
  );
};

export default LocationMap;

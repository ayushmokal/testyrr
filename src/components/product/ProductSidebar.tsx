import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductGalleryTabs } from "./ProductGalleryTabs";
import { useState, useEffect } from "react";

interface ProductSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  mainImage: string | null;
  productName: string;
  galleryImages?: string[] | null;
}

export function ProductSidebar({ 
  activeSection, 
  onSectionChange, 
  mainImage, 
  productName,
  galleryImages = []
}: ProductSidebarProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'pictures', label: 'Pictures' },
    { id: 'review', label: 'Expert Review' },
    { id: 'user-reviews', label: 'User Comments' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'comparison', label: 'Comparison' },
  ];

  useEffect(() => {
    const observers = new Map();
    
    sections.forEach(section => {
      if (section.id !== 'pictures') {
        const element = document.getElementById(section.id);
        if (element) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                  setCurrentSection(section.id);
                }
              });
            },
            {
              root: null,
              rootMargin: '-10% 0px -80% 0px',
              threshold: [0.3, 0.7]
            }
          );
          
          observer.observe(element);
          observers.set(section.id, observer);
        }
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'pictures') {
      setIsGalleryOpen(true);
    } else {
      onSectionChange(sectionId);
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <>
      <div className="w-48 space-y-2 sticky top-24">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            className={cn(
              "w-full text-left py-2 px-4 hover:text-primary transition-colors duration-200",
              currentSection === section.id && "text-primary border-l-2 border-primary bg-primary/5"
            )}
          >
            {section.label}
          </button>
        ))}
      </div>

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <ProductGalleryTabs 
            mainImage={mainImage} 
            productName={productName} 
            galleryImages={galleryImages}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
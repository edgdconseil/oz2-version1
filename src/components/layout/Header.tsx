
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileMenuButton from './header/MobileMenuButton';
import DesktopNavigation from './header/DesktopNavigation';
import MobileNavigation from './header/MobileNavigation';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/39be0dd5-afc9-47b6-865b-11cddf22500c.png" 
                alt="Ozego Logo" 
                className="h-10"
              />
            </Link>
          </div>

          <MobileMenuButton 
            mobileMenuOpen={mobileMenuOpen} 
            toggleMobileMenu={toggleMobileMenu} 
          />

          <DesktopNavigation />
        </div>

        <MobileNavigation mobileMenuOpen={mobileMenuOpen} />
      </div>
    </header>
  );
};

export default Header;

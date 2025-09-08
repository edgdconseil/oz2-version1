
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const MobileMenuButton = ({ mobileMenuOpen, toggleMobileMenu }: MobileMenuButtonProps) => {
  return (
    <button 
      className="md:hidden p-2"
      onClick={toggleMobileMenu}
      aria-label="Menu"
    >
      {mobileMenuOpen ? (
        <X className="h-6 w-6 text-ozego-primary" />
      ) : (
        <Menu className="h-6 w-6 text-ozego-primary" />
      )}
    </button>
  );
};

export default MobileMenuButton;

import { Button } from "@/components/ui/button";
import { Menu, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">FinTrack</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("caracteristicas")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Características
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cómo funciona
            </button>
            <button
              onClick={() => scrollToSection("precios")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Precios
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-6">
              Comenzar gratis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("caracteristicas")}
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Características
              </button>
              <button
                onClick={() => scrollToSection("como-funciona")}
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Cómo funciona
              </button>
              <button
                onClick={() => scrollToSection("precios")}
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Precios
              </button>
              <Button className="bg-primary hover:bg-primary/90 text-white font-medium w-full">
                Comenzar gratis
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookies_accepted');
    if (!hasAccepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies_accepted', 'true');
    setVisible(false);
  };

  const handleReject = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm text-center sm:text-left">
          🍪 Usamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra{' '}
          <a href="/privacy" className="text-primary hover:underline">política de privacidad</a>
          {' '}y el uso de cookies.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={handleReject}>
            Rechazar
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
};

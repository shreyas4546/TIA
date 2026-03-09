import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY';

const languages = [
  { code: 'en', name: 'English', currency: 'USD' as CurrencyCode },
  { code: 'hi', name: 'हिन्दी (Hindi)', currency: 'INR' as CurrencyCode },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', currency: 'INR' as CurrencyCode },
  { code: 'bn', name: 'বাংলা (Bengali)', currency: 'INR' as CurrencyCode },
  { code: 'ta', name: 'தமிழ் (Tamil)', currency: 'INR' as CurrencyCode },
  { code: 'te', name: 'తెలుగు (Telugu)', currency: 'INR' as CurrencyCode },
  { code: 'es', name: 'Español (Spanish)', currency: 'EUR' as CurrencyCode },
  { code: 'fr', name: 'Français (French)', currency: 'EUR' as CurrencyCode },
  { code: 'de', name: 'Deutsch (German)', currency: 'EUR' as CurrencyCode },
  { code: 'ja', name: '日本語 (Japanese)', currency: 'JPY' as CurrencyCode },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng: string, currency: CurrencyCode) => {
    i18n.changeLanguage(lng);
    setCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 flex items-center gap-2"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code, lang.currency)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                  i18n.language === lang.code ? 'text-primary font-medium bg-primary/5' : 'text-foreground'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

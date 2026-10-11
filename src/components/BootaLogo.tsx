import React from 'react';
import logoMaroon from '../assets/boota_logo_maroon_notag.png';
import logoWhite from '../assets/boota_logo_white_notag.png';

interface BootaLogoProps {
  variant?: 'vertical' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  inverted?: boolean;
  showSubtitle?: boolean;
}

export const BootaLogo: React.FC<BootaLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  inverted = false,
  showSubtitle = true
}) => {
  const logoSrc = inverted ? logoWhite : logoMaroon;

  const heightClass =
    size === 'sm'
      ? 'h-8'
      : size === 'md'
      ? 'h-11'
      : size === 'lg'
      ? 'h-16'
      : 'h-20';

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center select-none text-center ${className}`}>
        <img
          src={logoSrc}
          alt="Boota"
          className={`${heightClass} w-auto object-contain transition-transform`}
        />
        {showSubtitle && (
          <span
            className={`text-[9px] uppercase tracking-[0.28em] font-semibold mt-2 ${
              inverted ? 'text-white/80' : 'text-[#962949]'
            }`}
          >
            Admin Console
          </span>
        )}
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src={logoSrc}
          alt="Boota"
          className={`${heightClass} w-auto object-contain`}
        />
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Boota"
        className={`${heightClass} w-auto object-contain shrink-0`}
      />
      {showSubtitle && (
        <div className={`flex flex-col border-l ${inverted ? 'border-white/40' : 'border-[#F3D0D9]'} pl-2.5`}>
          <span
            className={`text-[10px] uppercase font-bold tracking-[0.2em] leading-tight ${
              inverted ? 'text-white' : 'text-[#962949]'
            }`}
          >
            Atelier
          </span>
          <span
            className={`text-[9px] uppercase tracking-wider font-medium ${
              inverted ? 'text-white/70' : 'text-stone-500'
            }`}
          >
            Admin Panel
          </span>
        </div>
      )}
    </div>
  );
};

'use client';

import React from 'react';

/**
 * Invisible SVG defs holding color matrix transformation filters for
 * simulating various color vision deficiencies (CVD).
 * 
 * Matrices derived from Machado et al. and standard Rec.601 luma transforms.
 */
export function SvgFilters() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      style={{ position: 'absolute', width: 0, height: 0 }}
    >
      <defs>
        {/* Deuteranopia (Green-blind / M-cone deficiency) */}
        <filter id="lens-deuteranopia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.625 0.375 0.000 0 0
              0.700 0.300 0.000 0 0
              0.000 0.300 0.700 0 0
              0.000 0.000 0.000 1 0
            "
          />
        </filter>

        {/* Protanopia (Red-blind / L-cone deficiency) */}
        <filter id="lens-protanopia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.56667 0.43333 0.00000 0 0
              0.55833 0.44167 0.00000 0 0
              0.00000 0.24167 0.75833 0 0
              0.00000 0.00000 0.00000 1 0
            "
          />
        </filter>

        {/* Tritanopia (Blue-blind / S-cone deficiency) */}
        <filter id="lens-tritanopia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.950 0.050 0.000 0 0
              0.000 0.433 0.567 0 0
              0.000 0.475 0.525 0 0
              0.000 0.000 0.000 1 0
            "
          />
        </filter>

        {/* Achromatopsia (Monochromacy / Complete color blindness) */}
        <filter id="lens-achromatopsia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0.000 0.000 0.000 1 0
            "
          />
        </filter>
      </defs>
    </svg>
  );
}

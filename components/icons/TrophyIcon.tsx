import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props} shapeRendering="crispEdges">
    <path d="M7 4h10v2h-2v3h-2V6H9v3H7V4z" />
    <path d="M5 10h14v2H5v-2z" />
    <path d="M9 14h6v6H9v-6z" />
    <path d="M7 12v2h2v-2H7zm8 0v2h2v-2h-2z" />
    <path d="M5 20h14v2H5v-2z" />
  </svg>
);
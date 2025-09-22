import React from 'react';

export const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props} shapeRendering="crispEdges">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM4 12a8 8 0 018-8v16a8 8 0 01-8-8z" />
    <path d="M14 4.07c1.83.52 3.42 1.63 4.59 3.06L14 7.13V4.07zM14 19.93v-3.06l4.59.06c-1.17 1.43-2.76 2.54-4.59 3z" />
  </svg>
);
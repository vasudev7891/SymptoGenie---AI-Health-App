import React from 'react';

export default function Spinner({ size = 'md' }) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[size];

  return (
    <div className={`${sizeClass} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
  );
}

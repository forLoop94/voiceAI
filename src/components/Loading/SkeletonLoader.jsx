import React from 'react';
import './loading.css';

export function SkeletonLoader() {
  return (
    <div className="skeleton-loader">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  );
}

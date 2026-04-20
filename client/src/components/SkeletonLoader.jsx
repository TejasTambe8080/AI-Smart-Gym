import React from 'react';

const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="premium-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 w-24 skeleton rounded"></div>
          <div className="h-10 w-10 skeleton rounded-lg"></div>
        </div>
        <div className="h-8 w-16 skeleton rounded"></div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full skeleton rounded-xl"></div>
        ))}
      </div>
    );
  }

  return <div className="skeleton rounded-xl w-full h-32"></div>;
};

export default SkeletonLoader;

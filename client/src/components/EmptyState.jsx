import React from 'react';

const EmptyState = ({ icon = '🔍', title = 'No results found', message = 'Try adjusting your filters or creating something new.', action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-3xl border-dashed border-slate-700">
      <div className="text-6xl mb-6 animate-bounce-slow">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 max-w-sm mb-8">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

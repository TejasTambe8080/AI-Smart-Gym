// InsightsCard Component - Displays AI-generated performance insights
import React from 'react';

const InsightsCard = ({ insight }) => {
  if (!insight) return null;

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      case 'caution':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      default:
        return 'bg-slate-500/20 border-slate-500/30 text-slate-300';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'caution':
        return '⚡';
      case 'info':
        return 'ℹ️';
      default:
        return '📊';
    }
  };

  return (
    <div className={`border rounded-xl p-4 ${getSeverityStyle(insight.severity)}`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getSeverityIcon(insight.severity)}</div>
        <div className="flex-1">
          <h4 className="font-bold text-sm mb-1">{insight.title}</h4>
          <p className="text-sm mb-1">{insight.message}</p>
          {insight.details && (
            <p className="text-xs opacity-80 mb-2">{insight.details}</p>
          )}
          {insight.recommendation && (
            <p className="text-xs opacity-75 italic">💡 {insight.recommendation}</p>
          )}
          {insight.progress !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs">
                <span>Progress</span>
                <span>{insight.progress}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${insight.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsCard;

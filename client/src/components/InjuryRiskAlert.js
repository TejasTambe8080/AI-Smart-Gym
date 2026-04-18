// InjuryRiskAlert Component - Displays injury risk warnings
import React from 'react';

const InjuryRiskAlert = ({ riskData }) => {
  if (!riskData || !riskData.risks || riskData.risks.length === 0) {
    return (
      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">✅</div>
          <div>
            <h4 className="font-bold text-green-300">Form Looking Great!</h4>
            <p className="text-sm text-green-200">No injury risks detected. Keep up your current form and continue progressive overload safely.</p>
          </div>
        </div>
      </div>
    );
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      default:
        return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
    }
  };

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      default:
        return '⚡';
    }
  };

  return (
    <div className="space-y-3">
      {/* Overall Risk Summary */}
      <div
        className={`border rounded-xl p-4 ${
          riskData.riskLevel === 'high'
            ? 'bg-red-500/20 border-red-500/30'
            : riskData.riskLevel === 'medium'
            ? 'bg-yellow-500/20 border-yellow-500/30'
            : 'bg-green-500/20 border-green-500/30'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {riskData.riskLevel === 'high'
                ? '🚨'
                : riskData.riskLevel === 'medium'
                ? '⚠️'
                : '✅'}
            </span>
            <div>
              <p className="font-bold text-sm capitalize">{riskData.riskLevel} Risk Level</p>
              <p className="text-xs opacity-75">{riskData.riskCount} issue(s) detected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Risk Cards */}
      {riskData.risks.map((risk, idx) => (
        <div key={idx} className={`border rounded-xl p-4 ${getRiskColor(risk.riskLevel)}`}>
          <div className="flex gap-3">
            <div className="text-2xl">{getRiskBadge(risk.riskLevel)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-sm">{risk.message}</h4>
                <span className="text-xs font-semibold">{risk.riskPercent}% frequency</span>
              </div>
              <p className="text-xs opacity-85 mb-2">{risk.details}</p>
              <div className="bg-slate-800/50 rounded p-2 mb-2">
                <p className="text-xs font-semibold mb-1">💡 How to fix:</p>
                <p className="text-xs opacity-75">{risk.recommendation}</p>
              </div>
              {risk.exercises && risk.exercises.length > 0 && (
                <div className="text-xs">
                  <p className="font-semibold mb-1">Corrective exercises:</p>
                  <div className="flex flex-wrap gap-2">
                    {risk.exercises.map((ex, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-slate-700/50 rounded text-xs"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Recommendations */}
      {riskData.recommendations && riskData.recommendations.length > 0 && (
        <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <h4 className="font-bold text-blue-300 text-sm mb-2">📋 Action Plan</h4>
          <div className="space-y-2">
            {riskData.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-xs font-semibold text-blue-300">→</span>
                <div>
                  <p className="text-xs font-semibold text-blue-300">{rec.title}</p>
                  <p className="text-xs text-blue-200">{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InjuryRiskAlert;

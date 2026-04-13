// ExerciseCard Component - Reusable exercise display card
import React from 'react';

const ExerciseCard = ({ exercise, onSelect, isSelected = false }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'from-green-500 to-green-600';
      case 'intermediate':
        return 'from-yellow-500 to-yellow-600';
      case 'advanced':
        return 'from-red-500 to-red-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const getDifficultyEmoji = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return '🌱';
      case 'intermediate':
        return '⚡';
      case 'advanced':
        return '🔥';
      default:
        return '💪';
    }
  };

  return (
    <div
      onClick={() => onSelect(exercise)}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-105 ${
        isSelected ? 'ring-4 ring-green-500 scale-105' : ''
      }`}
    >
      {/* Image Section */}
      <div className="relative h-40 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
        <img
          src={exercise.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={exercise.name}
          className="w-full h-full object-cover"
        />
        {/* Difficulty Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 bg-gradient-to-r ${getDifficultyColor(
            exercise.difficulty
          )} text-white rounded-lg font-bold text-sm shadow-lg`}
        >
          {getDifficultyEmoji(exercise.difficulty)} {exercise.difficulty}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{exercise.name}</h3>

        {/* Muscle Group Tag */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold capitalize">
            {exercise.muscleGroup}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exercise.description}</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-600 font-semibold">Reps</p>
            <p className="text-lg font-bold text-blue-600">{exercise.targetReps}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-600 font-semibold">Cal</p>
            <p className="text-lg font-bold text-orange-600">~{exercise.caloriesBurned}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-600 font-semibold">Steps</p>
            <p className="text-lg font-bold text-green-600">{exercise.instructions?.length || 0}</p>
          </div>
        </div>

        {/* Equipment Tags */}
        {exercise.equipment && exercise.equipment.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {exercise.equipment.slice(0, 2).map((equip, idx) => (
              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold capitalize">
                {equip}
              </span>
            ))}
            {exercise.equipment.length > 2 && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                +{exercise.equipment.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(exercise);
          }}
          className={`w-full py-2 rounded-lg font-bold transition-all duration-200 ${
            isSelected
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
              : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg'
          }`}
        >
          {isSelected ? '✅ Selected' : '→ Start'}
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;

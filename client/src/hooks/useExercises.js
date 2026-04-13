// useExercises Hook - Custom hook for fetching exercises dynamically
import { useState, useEffect } from 'react';
import { exerciseService } from '../services/api';

export const useExercises = (muscleGroup = null) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (muscleGroup) {
          response = await exerciseService.getExercisesByMuscleGroup(muscleGroup);
        } else {
          response = await exerciseService.getAllExercises();
        }
        
        setExercises(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch exercises');
        console.error('Error fetching exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [muscleGroup]);

  return { exercises, loading, error };
};

export const useMuscleGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await exerciseService.getMuscleGroups();
        setGroups(response.data.groups || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch muscle groups');
        console.error('Error fetching muscle groups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return { groups, loading, error };
};

export default useExercises;

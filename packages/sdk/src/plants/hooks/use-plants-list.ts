'use client';
import { useEffect } from 'react';
import type { PlantFindByCriteriaInput } from '../types/plant-find-by-criteria-input.type.js';
import { usePlants } from './use-plants.js';

export function usePlantsList(
  input?: PlantFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = usePlants();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as PlantFindByCriteriaInput);
    }
  }, [
    enabled,
    input?.pagination?.page,
    input?.pagination?.perPage,
    input?.filters,
    input?.sorts,
  ]);

  return {
    ...findByCriteria,
    refetch: () => findByCriteria.fetch(input as PlantFindByCriteriaInput),
  };
}

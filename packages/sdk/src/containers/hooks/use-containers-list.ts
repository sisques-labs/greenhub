'use client';
import { useEffect } from 'react';
import type { ContainerFindByCriteriaInput } from '../types/container-find-by-criteria-input.type.js';
import { useContainers } from './use-containers.js';

export function useContainersList(
  input?: ContainerFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useContainers();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as ContainerFindByCriteriaInput);
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
    refetch: () => findByCriteria.fetch(input as ContainerFindByCriteriaInput),
  };
}

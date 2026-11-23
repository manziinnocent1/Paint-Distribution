
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { colorService } from "../services/colorService";

import {
  COLOR_QUERY_KEYS,
  COLOR_FAMILY_QUERY_KEYS,
  COLOR_FORMULA_QUERY_KEYS,
} from "../constants/color.constants";

import type {
  CreateColorPayload,
  UpdateColorPayload,
  CreateColorFamilyPayload,
  UpdateColorFamilyPayload,
  CreateColorFormulaPayload,
  UpdateColorFormulaPayload,
} from "../types/color.types";

/* ============================================================
   COLOR MUTATIONS
============================================================ */

export function useColorMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: COLOR_QUERY_KEYS.all,
    });

  const createColor = useMutation({
    mutationFn: (payload: CreateColorPayload) =>
      colorService.createColor(payload),
    onSuccess: invalidate,
  });

  const updateColor = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateColorPayload;
    }) => colorService.updateColor(id, payload),
    onSuccess: invalidate,
  });

  const deleteColor = useMutation({
    mutationFn: (id: string) => colorService.deleteColor(id),
    onSuccess: invalidate,
  });

  return {
    createColor,
    updateColor,
    deleteColor,
    isCreating: createColor.isPending,
    isUpdating: updateColor.isPending,
    isDeleting: deleteColor.isPending,
  };
}

/* ============================================================
   COLOR FAMILY MUTATIONS
============================================================ */

export function useColorFamilyMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: COLOR_FAMILY_QUERY_KEYS.all,
    });
    queryClient.invalidateQueries({
      queryKey: COLOR_QUERY_KEYS.all,
    });
  };

  const createFamily = useMutation({
    mutationFn: (payload: CreateColorFamilyPayload) =>
      colorService.createColorFamily(payload),
    onSuccess: invalidate,
  });

  const updateFamily = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateColorFamilyPayload;
    }) => colorService.updateColorFamily(id, payload),
    onSuccess: invalidate,
  });

  const deleteFamily = useMutation({
    mutationFn: (id: string) =>
      colorService.deleteColorFamily(id),
    onSuccess: invalidate,
  });

  return {
    createFamily,
    updateFamily,
    deleteFamily,
    isCreating: createFamily.isPending,
    isUpdating: updateFamily.isPending,
    isDeleting: deleteFamily.isPending,
  };
}

/* ============================================================
   COLOR FORMULA MUTATIONS
============================================================ */

export function useColorFormulaMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: COLOR_FORMULA_QUERY_KEYS.all,
    });

  const createFormula = useMutation({
    mutationFn: (payload: CreateColorFormulaPayload) =>
      colorService.createColorFormula(payload),
    onSuccess: invalidate,
  });

  const updateFormula = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateColorFormulaPayload;
    }) => colorService.updateColorFormula(id, payload),
    onSuccess: invalidate,
  });

  const deleteFormula = useMutation({
    mutationFn: (id: string) =>
      colorService.deleteColorFormula(id),
    onSuccess: invalidate,
  });

  return {
    createFormula,
    updateFormula,
    deleteFormula,
    isCreating: createFormula.isPending,
    isUpdating: updateFormula.isPending,
    isDeleting: deleteFormula.isPending,
  };
}

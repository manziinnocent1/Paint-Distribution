import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pricingService } from "../services/pricingService";
import { pricingKeys } from "./usePricing";
import type {
  CreatePriceInput,
  CreatePricingRuleInput,
  PriceAdjustmentInput,
  UpdatePriceInput,
} from "../types/pricing.types";

export function useCreatePrice() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePriceInput) =>
      pricingService.create(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: pricingKeys.all });
    },
  });
}

export function useUpdatePrice() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdatePriceInput;
    }) => pricingService.update(id, input),
    onSuccess: (price) => {
      client.invalidateQueries({ queryKey: pricingKeys.all });
      client.setQueryData(pricingKeys.detail(price.id), price);
    },
  });
}

export function useAdjustPrice() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: PriceAdjustmentInput;
    }) => pricingService.adjust(id, input),
    onSuccess: (price) => {
      client.invalidateQueries({ queryKey: pricingKeys.all });
      client.setQueryData(pricingKeys.detail(price.id), price);
      client.invalidateQueries({
        queryKey: pricingKeys.history(price.id),
      });
    },
  });
}

export function useCreatePricingRule() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePricingRuleInput) =>
      pricingService.createRule(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: pricingKeys.rules() });
    },
  });
}
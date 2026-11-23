
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DELIVERY_QUERY_KEYS } from "../constants/delivery.constants";
import { deliveryService } from "../services/deliveryService";
import type {
  DeliveryFormValues,
  DeliveryStatusFormValues,
} from "../types/delivery.types";

export function useDeliveryMutations() {
  const queryClient = useQueryClient();

  const refreshDeliveries = async (id?: string) => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: DELIVERY_QUERY_KEYS.lists(),
      }),
      queryClient.invalidateQueries({
        queryKey: DELIVERY_QUERY_KEYS.stats(),
      }),
      ...(id
        ? [
            queryClient.invalidateQueries({
              queryKey: DELIVERY_QUERY_KEYS.detail(id),
            }),
            queryClient.invalidateQueries({
              queryKey: DELIVERY_QUERY_KEYS.history(id),
            }),
          ]
        : []),
    ]);
  };

  const createDelivery = useMutation({
    mutationFn: (values: DeliveryFormValues) =>
      deliveryService.createDelivery(values),
    onSuccess: () => refreshDeliveries(),
  });

  const updateDelivery = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: DeliveryFormValues;
    }) => deliveryService.updateDelivery(id, values),
    onSuccess: (_, variables) => refreshDeliveries(variables.id),
  });

  const updateDeliveryStatus = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: DeliveryStatusFormValues;
    }) => deliveryService.updateDeliveryStatus(id, values),
    onSuccess: (_, variables) => refreshDeliveries(variables.id),
  });

  const deleteDelivery = useMutation({
    mutationFn: (id: string) => deliveryService.deleteDelivery(id),
    onSuccess: () => refreshDeliveries(),
  });

  return {
    createDelivery,
    updateDelivery,
    updateDeliveryStatus,
    deleteDelivery,
  };
}

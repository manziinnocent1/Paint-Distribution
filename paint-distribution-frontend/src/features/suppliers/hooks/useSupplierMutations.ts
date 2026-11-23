import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { SUPPLIERS_QUERY_KEYS } from "../constants/supplier.constants";
import { supplierService } from "../services/supplierService";

import type {
  CreateSupplierInput,
  SupplierProductInput,
  SupplierStatus,
  UpdateSupplierInput,
} from "../types/supplier.types";

export function useSupplierMutations() {
  const queryClient = useQueryClient();

  const invalidateSuppliers = async (id?: string) => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: SUPPLIERS_QUERY_KEYS.all,
      }),
      id
        ? queryClient.invalidateQueries({
            queryKey: SUPPLIERS_QUERY_KEYS.detail(id),
          })
        : Promise.resolve(),
      id
        ? queryClient.invalidateQueries({
            queryKey: SUPPLIERS_QUERY_KEYS.timeline(id),
          })
        : Promise.resolve(),
    ]);
  };

  const createSupplier = useMutation({
    mutationFn: (input: CreateSupplierInput) =>
      supplierService.createSupplier(input),
    onSuccess: async () => {
      await invalidateSuppliers();
      toast.success("Supplier created successfully.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateSupplier = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateSupplierInput;
    }) => supplierService.updateSupplier(id, input),
    onSuccess: async (supplier) => {
      await invalidateSuppliers(supplier.id);
      toast.success("Supplier updated successfully.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: SupplierStatus;
    }) => supplierService.updateStatus(id, status),
    onSuccess: async (supplier) => {
      await invalidateSuppliers(supplier.id);
      toast.success("Supplier status updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const addProduct = useMutation({
    mutationFn: ({
      supplierId,
      input,
    }: {
      supplierId: string;
      input: SupplierProductInput;
    }) => supplierService.addProduct(supplierId, input),
    onSuccess: async (supplier) => {
      await invalidateSuppliers(supplier.id);
      toast.success("Product added to supplier.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteSupplier = useMutation({
    mutationFn: (id: string) => supplierService.deleteSupplier(id),
    onSuccess: async () => {
      await invalidateSuppliers();
      toast.success("Supplier deleted successfully.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    createSupplier,
    updateSupplier,
    updateStatus,
    addProduct,
    deleteSupplier,
  };
}
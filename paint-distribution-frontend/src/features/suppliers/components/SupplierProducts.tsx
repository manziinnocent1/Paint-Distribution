import { Package } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import type { SupplierProduct } from "../types/supplier.types";
import { formatSupplierCurrency } from "../utils/supplier.utils";

interface SupplierProductsProps {
  products: SupplierProduct[];
}

export function SupplierProducts({ products }: SupplierProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Supplied products ({products.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        {products.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No products are currently associated with this supplier.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Unit price</TableHead>
                  <TableHead>Minimum order</TableHead>
                  <TableHead>Lead time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.productName}
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      {formatSupplierCurrency(
                        product.unitPrice,
                        product.currency,
                      )}
                    </TableCell>
                    <TableCell>{product.minimumOrderQuantity ?? "—"}</TableCell>
                    <TableCell>
                      {product.leadTimeDays != null
                        ? `${product.leadTimeDays} days`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isActive ? "default" : "secondary"}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

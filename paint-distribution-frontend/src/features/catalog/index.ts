// Pages
export { default as CatalogPage } from "./pages/CatalogPage";
export { default as ProductsPage } from "./pages/ProductsPage";
export { default as ProductDetailsPage } from "./pages/ProductDetailsPage";
export { default as CreateProductPage } from "./pages/CreateProductPage";
export { default as EditProductPage } from "./pages/EditProductPage";
export { default as CategoriesPage } from "./pages/CategoriesPage";
export { default as CreateCategoryPage } from "./pages/CreateCategoryPage";
export { default as EditCategoryPage } from "./pages/EditCategoryPage";
export { default as BrandsPage } from "./pages/BrandsPage";
export { default as CreateBrandPage } from "./pages/CreateBrandPage";
export { default as EditBrandPage } from "./pages/EditBrandPage";

// Components
export { default as ProductTable } from "./components/ProductTable";
export { default as ProductForm } from "./components/ProductForm";
// export { default as ProductDetails } from "./components/ProductDetails";
export { default as ProductFilters } from "./components/ProductFilters";
export { default as ProductStatusBadge } from "./components/ProductStatusBadge";
export { default as ProductImageGallery } from "./components/ProductImageGallery";
export { default as ProductVariantTable } from "./components/ProductVariantTable";
export { default as ProductVariantForm } from "./components/ProductVariantForm";
export { default as CategoryTable } from "./components/CategoryTable";
export { default as CategoryForm } from "./components/CategoryForm";
export { default as BrandTable } from "./components/BrandTable";
export { default as BrandForm } from "./components/BrandForm";
export { default as CatalogSummary } from "./components/CatalogSummary";

// Hooks
export { useProducts } from "./hooks/useProducts";
export { useProductDetails } from "./hooks/useProductDetails";
export { useCategories } from "./hooks/useCategories";
export { useBrands } from "./hooks/useBrands";
export { useProductVariants } from "./hooks/useProductVariants";

// Services
export { catalogService } from "./services/catalogService";

// Types
export * from "./types/catalog.types";

// Schemas
export * from "./schemas/catalog.schema";

// Utilities
export * from "./utils/catalog.utils";
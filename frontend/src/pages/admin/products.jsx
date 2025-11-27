import { useState, useMemo } from 'react';
import ProductImageUpload from '@/components/admin/imageUpload';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addProductFormFields } from '../../config/index.js';
import { useAddProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from '@/store/admin/products/productSliceApi';
import { toast } from 'react-toastify';
import CardTile from '@/components/admin/cardTile';
import ProductSkeleton from '@/components/common/skeltons/admin';
import axios from 'axios';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const initialState = {
  image: null,
  name: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  salePrice: '',
  stock: '',
};

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-2000', label: 'Under Rs. 2,000' },
  { value: '2000-5000', label: 'Rs.2,000 - Rs. 5,000' },
  { value: '5000-8000', label: 'Rs. 5,000 - Rs. 8,000' },
  { value: '8000+', label: 'Rs. 8,000+' },
];

const stockFilters = [
  { value: 'all', label: 'All Stock' },
  { value: 'inStock', label: 'In Stock' },
  { value: 'lowStock', label: 'Low Stock (< 10)' },
  { value: 'outOfStock', label: 'Out of Stock' },
];

const AdminProducts = () => {
  const [addProductMenu, setAddProductMenu] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [editId, setEditId] = useState(null);
  const [isProcessingForm, setIsProcessingForm] = useState(false);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [addProduct] = useAddProductMutation();
  const [editProduct] = useUpdateProductMutation();
  const { data: products, isLoading: isProductsLoading, isError } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleteloading }] = useDeleteProductMutation();

  const isEditMode = editId !== null;

  // Get dynamic filter options from API response
  const categoryOptions = useMemo(() => {
    const cats = products?.data?.filterOptions?.categories || [];
    return [
      { value: 'all', label: 'All Categories' },
      ...cats.map(cat => ({ 
        value: cat, 
        label: cat.charAt(0).toUpperCase() + cat.slice(1) 
      }))
    ];
  }, [products?.data?.filterOptions?.categories]);

  const brandOptions = useMemo(() => {
    const brands = products?.data?.filterOptions?.brands || [];
    return [
      { value: 'all', label: 'All Brands' },
      ...brands.map(brand => ({ 
        value: brand, 
        label: brand.charAt(0).toUpperCase() + brand.slice(1) 
      }))
    ];
  }, [products?.data?.filterOptions?.brands]);

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    if (!products?.data?.products) return [];

    return products.data.products.filter((product) => {
      if (!product) return false;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || 
        product.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesBrand = selectedBrand === 'all' || 
        product.brand?.toLowerCase() === selectedBrand.toLowerCase();

      // Price filter (using salePrice or price)
      let matchesPrice = true;
      const price = product.salePrice > 0 ? product.salePrice : product.price;
      if (selectedPriceRange !== 'all') {
        if (selectedPriceRange === '0-2000') matchesPrice = price < 2000;
        else if (selectedPriceRange === '2000-5000') matchesPrice = price >= 2000 && price < 5000;
        else if (selectedPriceRange === '5000-8000') matchesPrice = price >= 5000 && price < 8000;
        else if (selectedPriceRange === '8000+') matchesPrice = price >= 8000;
      }

      // Stock filter
      let matchesStock = true;
      const stock = parseInt(product.stock);
      if (selectedStock !== 'all') {
        if (selectedStock === 'inStock') matchesStock = stock > 0;
        else if (selectedStock === 'lowStock') matchesStock = stock > 0 && stock < 10;
        else if (selectedStock === 'outOfStock') matchesStock = stock === 0;
      }

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedPriceRange, selectedStock]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedBrand !== 'all' || 
    selectedPriceRange !== 'all' || selectedStock !== 'all' || searchQuery !== '';

  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedBrand !== 'all',
    selectedPriceRange !== 'all',
    selectedStock !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedPriceRange('all');
    setSelectedStock('all');
  };

  async function uploadImageToCloudinary() {
    try {
      const data = new FormData();
      data.append('my_file', imageFile);
      const res = await axios.post(
        'http://localhost:8000/api/v1/admin/products/imageUpload',
        data,
        { withCredentials: true }
      );
      if (res?.data?.data?.secure_url) {
        const imageUrl = res.data.data.secure_url;
        setUploadedImageUrl(imageUrl);
        return imageUrl;
      } else {
        throw new Error('No secure_url returned');
      }
    } catch (error) {
      toast.error('Image upload failed');
      throw error;
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsProcessingForm(true);
    try {
      if (!formData.name || !formData.category || !formData.price || !formData.stock) {
        return toast.error('Name, Category, Price, and Stock are required.');
      }
      let finalImageUrl = uploadedImageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImageToCloudinary();
      }
      if (!finalImageUrl && !isEditMode) {
        toast.error('Please upload an image');
        return;
      }
      const payload = { ...formData, image: finalImageUrl };
      const res = isEditMode
        ? await editProduct({ id: editId, ...payload }).unwrap()
        : await addProduct(payload).unwrap();
      if (res.success) {
        toast.success(isEditMode ? 'Product updated successfully' : 'Product added successfully');
        setFormData(initialState);
        setImageFile(null);
        setUploadedImageUrl('');
        setAddProductMenu(false);
        setEditId(null);
      }
    } catch (error) {
      if (error?.status === 'FETCH_ERROR' || error?.error?.includes('Failed to fetch')) {
        toast.error('Sorry.. Something went wrong');
      } else {
        toast.error(error?.data?.message || error.error || 'Something went wrong');
      }
    } finally {
      setIsProcessingForm(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteProduct(id).unwrap();
      if (res.success) {
        toast.success('Product deleted successfully');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-sm text-muted-foreground">
              {products?.data?.pagination?.total || 0} total products
            </p>
          </div>
          <Button onClick={() => setAddProductMenu(true)}>Add New Product</Button>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4 border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandOptions.map((brand) => (
                      <SelectItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Status</label>
                <Select value={selectedStock} onValueChange={setSelectedStock}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stock status" />
                  </SelectTrigger>
                  <SelectContent>
                    {stockFilters.map((stock) => (
                      <SelectItem key={stock.value} value={stock.value}>
                        {stock.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} of {products?.data?.products?.length || 0} products
                </span>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive">
                  <X className="h-4 w-4 mr-1" />
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {isProductsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">Failed to load products.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => item && (
              <CardTile
                key={item._id}
                item={item}
                setEditId={setEditId}
                setFormData={setFormData}
                setProductMenu={setAddProductMenu}
                setUploadedImageUrl={setUploadedImageUrl}
                onDelete={handleDelete}
                isDeleteloading={isDeleteloading}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground mb-2">
                {hasActiveFilters ? 'No products match your filters' : 'No Products Found'}
              </div>
              {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters}>
                  Clear filters to see all products
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Product Sheet */}
      <Sheet
        open={addProductMenu}
        onOpenChange={() => {
          setAddProductMenu(false);
          setEditId(null);
          setUploadedImageUrl(null);
          setFormData(initialState);
        }}
      >
        <SheetContent side="right" className="overflow-auto p-4">
          <SheetHeader>
            <SheetTitle>{isEditMode ? 'Edit Product' : 'Add Product'}</SheetTitle>
            <SheetDescription>
              {isEditMode
                ? 'Update the product details and save changes.'
                : 'Fill in the product details to add a new item to your inventory.'}
            </SheetDescription>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile} 
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}  
            isEditMode={isEditMode}
          />
          <CommonForm
            formData={formData}
            setFormData={setFormData}
            registerFormControls={addProductFormFields}
            buttonText={isEditMode ? 'Update' : 'Add'}
            onSubmit={onSubmit}
            isLoading={isProcessingForm}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminProducts;
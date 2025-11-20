// @ts-nocheck
import ProductSkeleton from '@/components/common/skeltons/admin';
import ProductFilter from '@/components/shopping/filter';
import CardProduct from '@/components/shopping/productCard';
import ProductDetailsDialog from '@/components/shopping/productDetailsDialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { sortOptions } from '@/config';
import CartItemActions from '@/hooks/cartItemActions';
import { useGetProductsWithFilterQuery } from '@/store/user/userProductSliceApi';
import { ArrowUpDownIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'react-toastify';

const ShoppingListing = () => {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('title-atoz');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParam, setSearchParam] = useSearchParams();
  const [openProductDetailsDialog, setOpenProductDetailsDialog] = useState(false);
  const [productId, setProductId] = useState();

  const { data: response, isLoading, isError } = useGetProductsWithFilterQuery({
    filters,
    sort,
    page: currentPage,
    limit: 12
  });

  const products = response?.data?.data || [];
  const pagination = response?.pagination || {};

  const [addingToCartMap, setAddingToCartMap] = useState({}); 
  const { addItemToCart } = CartItemActions();

  function handleSort(value) {
    setSort(value);
    setCurrentPage(1);
  }

  const handleAddToCart = async (productId) => {
    setAddingToCartMap(prev => ({ ...prev, [productId]: true }));

    try {
      await addItemToCart(productId);
    } catch (error) {
      if (error?.status === "FETCH_ERROR" || error?.error?.includes("Failed to fetch")) {
        toast.error("Sorry..Something Went Wrong");
      } else {
        toast.error(error?.data?.message || error.error || "Something went wrong");
      }
    } finally {
      setAddingToCartMap(prev => ({ ...prev, [productId]: false }));
    }
  };

  function handleFilter(getSecionId, getCurrentOption) {
    setFilters(prev => ({
      ...prev,
      [getSecionId]: prev[getSecionId]?.includes(getCurrentOption)
        ? prev[getSecionId].filter(opt => opt !== getCurrentOption)
        : [...(prev[getSecionId] || []), getCurrentOption],
    }));
    setCurrentPage(1);
  }

  function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(',')
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
      }
    }

    return queryParams.join('&')
  }

  function handleGetProductdetails(productId) {
    setProductId(productId);
    setOpenProductDetailsDialog(true);
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    setSort('title-atoz');
  }, [])

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParam(new URLSearchParams(createQueryString));
    }
  }, [filters, setSearchParam])

  useEffect(() => {
    const categoryParam = searchParam.get('category');
    const brandParam = searchParam.get('brand');

    if (categoryParam || brandParam) {
      setFilters(prev => ({
        ...prev,
        ...(categoryParam && { category: categoryParam.split(',') }),
        ...(brandParam && { brand: brandParam.split(',') })
      }));
    }
  }, [searchParam]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr] gap-6 p-4 md:p-4'>
      <ProductFilter handleFilter={handleFilter} filters={filters} />

      <div className='bg-background w-full rounded-lg shadow-sm'>
        <div className='p-4 border-b flex items-center justify-between'>
          <h2 className='text-lg font-extrabold'>All Products</h2>
          <div className='flex item-center gap-3'>
            <span className='text-muted-foreground'>{pagination.totalProducts || 0} results</span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='flex items-center gap-1'>
                  <ArrowUpDownIcon className='h-4 w-4' />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='w-[200px]'>
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map(sortItem =>
                    <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  )}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-4 p-2 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {isLoading ? (
            [...Array(12)].map((_, i) => <ProductSkeleton key={i} />)
          ) : isError ? (
            <div className="flex items-center justify-center text-2xl font-bold col-span-full">
              No Products Found
            </div>
          ) : products?.length > 0 ? (
            products.map((item) => (
              <CardProduct
                key={item._id}
                item={item}
                handleGetProductdetails={handleGetProductdetails}
                handleAddToCart={handleAddToCart}
                isAddingToCart={addingToCartMap[item._id]} 
              />
            ))
          ) : (
            <div className="flex items-center justify-center text-2xl font-bold col-span-full">
              No Products Found
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className='flex items-center justify-center gap-2 p-4 border-t hover:cursor-pointer'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage || isLoading}
              className='flex items-center gap-1'
            >
              <ChevronLeft className='h-4 w-4' />
              Previous
            </Button>

            <div className='flex items-center gap-1 hover:cursor-pointer'>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                  className='w-8 h-8 p-0'
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage || isLoading}
              className='flex items-center gap-1 hover:cursor-pointer'
            >
              Next
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        )}

        <ProductDetailsDialog
          open={openProductDetailsDialog}
          setOpen={setOpenProductDetailsDialog}
          productId={productId}
          setProductId={setProductId}
          handleAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default ShoppingListing;

import ProductSkeleton from '@/components/common/skeltons/admin';
import ProductFilter from '@/components/shopping/filter';
import CardProduct from '@/components/shopping/productCard';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { sortOptions } from '@/config';
import { useGetProductsQuery } from '@/store/admin/products/productSliceApi';
import { ArrowUpDownIcon } from 'lucide-react';


const ShoppingListing = () => {

  const{data:products,isLoading,isError} = useGetProductsQuery();

  return (
    <div className='grid grid-cols-1 md:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr] gap-6 p-4 md:p-4'>
      <ProductFilter/>
      <div className='bg-background w-full rounded-lg shadow-sm'>
         <div className='p-4 border-b flex items-center justify-between '>
            <h2 className='text-lg font-extrabold '>All Products</h2>
            <div className='flex item-center gap-3'>
                <span className='text-muted-foreground'>{products?.data?.products?.length} results</span>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className='flex items-center gap-1'>
                    <ArrowUpDownIcon className='h-4 w-4'/>
                    <span>Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-[200px]'>
                  <DropdownMenuRadioGroup>
                    {
                      sortOptions.map(sortItem => <DropdownMenuRadioItem key={sortItem.id}>
                          {sortItem.label}
                      </DropdownMenuRadioItem>)
                    }
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 p-2 xl:grid-cols-5'>
              {isLoading?(
                 [...Array(6)].map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))
              ):isError?(
                <div className="flex items-center justify-center text-2xl font-bold col-span-full">
                  No Products Found
                </div>
              ):(
                products?.data?.products?.length > 0 ? (
                    products.data.products.map((item) => (
                    <CardProduct key={item._id} item={item}/>
                  ))) : (
                    <div className="flex items-center justify-center text-2xl font-bold col-span-full">
                      No Products Found
                    </div>
                  )
              )}
          </div>
        </div>
    </div>
  )
}

export default ShoppingListing;
import ProductSkeleton from '@/components/common/skeltons/admin';
import ProductFilter from '@/components/shopping/filter';
import CardProduct from '@/components/shopping/productCard';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { sortOptions } from '@/config';
import { useGetProductsWithFilterQuery } from '@/store/user/userProductSliceApi';
import { ArrowUpDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createSearchParams, useSearchParams } from 'react-router';


const ShoppingListing = () => {
 const [filters, setFilters] = useState({});
 const [sort, setSort] = useState('title-atoz');
 const [searchParam, setSearchParam] = useSearchParams();
  
 
 const { data: products, isLoading, isError } = useGetProductsWithFilterQuery({ 
    filters, 
    sort 
  });

  


  function handleSort(value){
    setSort(value);
  }

  function handleFilter(getSecionId, getCurrentOption) {

    setFilters(prev => ({
      ...prev,
      [getSecionId]: prev[getSecionId]?.includes(getCurrentOption)
        ? prev[getSecionId].filter(opt => opt !== getCurrentOption)
        : [...(prev[getSecionId] || []), getCurrentOption],
    }));
}

function createSearchParamsHelper(filterParams){
 const queryParams = [];

 for(const [key,value] of  Object.entries(filterParams)){
  if(Array.isArray(value) && value.length>0){
    const paramValue = value.join(',')
    queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
  }
 }

 return queryParams.join('&')
}

useEffect(()=>{
  setSort('title-atoz');
},[])

useEffect(()=>{
  if(filters && Object.keys(filters).length>1){
    const createQueryString = createSearchParamsHelper(filters);
    setSearchParam(new URLSearchParams(createQueryString));
  }
},[filters,setSearchParam])

 
  return (
    <div className='grid grid-cols-1 md:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr] gap-6 p-4 md:p-4'>
      <ProductFilter  handleFilter={handleFilter}/>
      <div className='bg-background w-full rounded-lg shadow-sm'>
         <div className='p-4 border-b flex items-center justify-between '>
            <h2 className='text-lg font-extrabold '>All Products</h2>
            <div className='flex item-center gap-3'>
                <span className='text-muted-foreground'>{products?.data?.length} results</span>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className='flex items-center gap-1'>
                    <ArrowUpDownIcon className='h-4 w-4'/>
                    <span>Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-[200px]'>
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {
                      sortOptions.map(sortItem => <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                          {sortItem.label}
                      </DropdownMenuRadioItem>)
                    }
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid gap-4 p-2 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {isLoading ? (
                [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
              ) : isError ? (
                <div className="flex items-center justify-center text-2xl font-bold col-span-full">
                  No Products Found
                </div>
              ) : products?.data?.length > 0 ? (
                products.data.map((item) => <CardProduct key={item._id} item={item} />)
              ) : (
                <div className="flex items-center justify-center text-2xl font-bold col-span-full">
                  No Products Found
                </div>
              )}
          </div>
        </div>
    </div>
  )
}

export default ShoppingListing;
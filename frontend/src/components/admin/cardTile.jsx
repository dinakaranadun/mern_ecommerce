import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'
import { Tag, TrendingDown } from 'lucide-react';
import { Spinner } from '../ui/shadcn-io/spinner';


const CardTile = ({item,setEditId,setProductMenu,setFormData,setUploadedImageUrl,onDelete,isDeleteloading}) => {
  console.log(item)
  return (
    <Card className='max-w-sm pt-0'>
      <CardContent className='px-0'>
        <img
          src={item.image}
          alt={item.name}
          className='aspect-video h-70 rounded-t-xl object-cover'
        />
      </CardContent>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
        
        <div className='flex flex-wrap items-center gap-4 pt-3'>
          <div className='flex items-center gap-1.5 text-gray-700'>
            <Tag className='w-4 h-4 flex-shrink-0' />
            <span className='text-sm font-medium'>Rs. {item.price}</span>
          </div>
          
          {item.salePrice && (
            <div className='flex items-center gap-1.5 text-green-600'>
              <TrendingDown className='w-4 h-4 flex-shrink-0' />
              <span className='text-sm font-semibold'>Rs. {item.salePrice}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardFooter className='block space-y-2 space-x-2 gap-2 lg:flex-row'>
        <Button onClick={
          () => {
            setEditId(item._id);
            setProductMenu(true);
            setFormData(item);
            setUploadedImageUrl(item.image);
          }}>
          Edit
        </Button>
        <Button variant={'destructive'} onClick={()=>onDelete(item._id)}>{isDeleteloading?<Spinner/>:"Delete"}</Button>
      </CardFooter>
    </Card>
  )
}

export default CardTile

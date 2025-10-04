import ProductImageUpload from '@/components/admin/imageUpload';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { addProductFormFields } from '@/config';
import React, { useState } from 'react';

const initialState = {
  image: null,
  name: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  salePrice: '',
  stock: ''
};

const AdminProducts = () => {
  const [addproductMenu, setAddproductMenu] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [imageFile,setImageFile] = useState(null);
  const [uploadedImageUrl,setUploadedImageUrl] = useState('');
  

 

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <div className='flex justify-end w-full mb-5'>
        <Button
          className='hover:cursor-pointer'
          onClick={() => setAddproductMenu(true)} 
        >
          Add New Product
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'></div>

      <Sheet open={addproductMenu} onOpenChange={setAddproductMenu}>
        <SheetContent side='right' className='overflow-auto'>
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
          </SheetHeader>
          <ProductImageUpload imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl} />
          <div className='p-6'>
            <CommonForm
            registerFormControls={addProductFormFields}
              formData={formData}
              setFormData={setFormData}
              buttonText='add'
              onSubmit={onSubmit}
              isLoading={true}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminProducts;

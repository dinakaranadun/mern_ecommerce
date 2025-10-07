import React, { useState } from 'react';
import ProductImageUpload from '@/components/admin/imageUpload';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { addProductFormFields } from '@/config';
import { useAddProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from '@/store/admin/products/productSliceApi';
import { toast } from 'react-toastify';
import CardTile from '@/components/admin/cardTile';
import ProductSkeleton from '@/components/common/skeltons/admin';

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

const AdminProducts = () => {
  const [addProductMenu, setAddProductMenu] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [editId,setEditId] = useState(null);

  const [addProduct, { isLoading: isAddLoading }] = useAddProductMutation();
  const [editProduct,{isLoading:isUpdateLoading}] = useUpdateProductMutation();
  const { data: products, isLoading: isProductsLoading, isError } = useGetProductsQuery();
  const [deleteProduct,{isLoading:isDeleteloading}] = useDeleteProductMutation();


  const isEditMode = editId !== null;
  const isLoading = isAddLoading || isUpdateLoading;

  

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.category || !formData.price || !formData.stock) {
        return toast.error('Name, Category, Price, and Stock are required.');
      }

      if (!uploadedImageUrl) {
        return toast.error('Please upload a product image.');
      }
       let res;
      if(isEditMode){
        res = await editProduct({id: editId, ...formData, image: uploadedImageUrl }).unwrap();
      }else{
        res = await addProduct({ ...formData, image: uploadedImageUrl }).unwrap();
      }
      

      if (res.success) {
        toast.success(isEditMode ? 'Product updated successfully' : 'Product added successfully');
        setFormData(initialState);
        setImageFile(null);
        setUploadedImageUrl('');
        setAddProductMenu(false);
      }
    } catch (error) {
      if (error?.status === 'FETCH_ERROR' || error?.error?.includes('Failed to fetch')) {
        toast.error('Sorry.. Something Went Wrong');
      } else {
        toast.error(error?.data?.message || error.error || 'Something went wrong');
      }
    }
  };

  const handleDelete = async(id)=>{
    try {
       const res = await deleteProduct(id).unwrap();
       if(res.success){
        toast.success('Product deleted successfully')
       }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete product');
    }
  }

  

  return (
    <div className="w-full flex flex-col gap-6"> 
      <div className="flex justify-end w-full">
        <Button onClick={() => setAddProductMenu(true)}>Add New Product</Button>
      </div>
      {isProductsLoading ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 text-lg font-semibold">
          Failed to load products.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {products?.data?.products?.length > 0 ? (
            products.data.products.map((item) => (
              <CardTile key={item._id} item={item} setEditId={setEditId} setProductMenu={setAddProductMenu} setFormData={setFormData} setUploadedImageUrl={setUploadedImageUrl} onDelete={handleDelete} isDeleteloading={isDeleteloading}/>
            ))
          ) : (
            <div className="flex items-center justify-center text-2xl font-bold col-span-full">
              No Products Found
            </div>
          )}
        </div>
      )}


    <Sheet open={addProductMenu} onOpenChange={
      ()=>{setAddProductMenu(false); 
        setEditId(null);
        setUploadedImageUrl(null);
        setFormData(initialState);}
      } >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{isEditMode?"Edit Product":"Add Product"}</SheetTitle>
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

          <div className="p-6">
            <CommonForm
              registerFormControls={addProductFormFields}
              formData={formData}
              setFormData={setFormData}
              buttonText={isEditMode? "Save":"Add Product"}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          </div>
        </SheetContent>
    </Sheet>
    </div>
  );
};

export default AdminProducts;

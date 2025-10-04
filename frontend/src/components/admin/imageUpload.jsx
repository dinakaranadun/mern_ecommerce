import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloud, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";


function ProductImageUpload({imageFile,setImageFile,uploadedImageUrl,setUploadedImageUrl}){
    const inputRef = useRef(null);

    function handleImageFileChange(e){
         const selectedFile = e.target.files?.[0];
         if(selectedFile) setImageFile(selectedFile);
    }
    function handleDragover(e){
        e.preventDefault();
    }

    function handleDrop(e){
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0]; 
        if(droppedFile) setImageFile(droppedFile);
    }

    function handleRemoveImage() {
        setImageFile(null);
        if(inputRef.current){
            inputRef.current.value = '';
        }
    }

    async function uploadImageToCloudinary() {
       const data = new FormData();
       data.append('my_file',imageFile)

       const response = await axios.post('http://localhost:8000/api/v1/admin/products/imageUpload',data,{
        withCredentials:true,
       });

        if(response?.data?.data?.secure_url) {
            setUploadedImageUrl(response.data.data.secure_url);
        }

    }


    useEffect(()=>{
        if(imageFile !== null) uploadImageToCloudinary()

    },[imageFile])

    return(
        <div className="w-full max-w-md mx-auto">
            <label className="text-sm font-bold pl-6 block mb-4">Upload Images</label>
            <div className="border-2 border-dashed rounded-lg p-6 mx-2" onDragOver={handleDragover} onDrop={handleDrop}>
                <Input id="image-upload" type='file' hidden ref={inputRef} onChange={handleImageFileChange} /> 
                {
                    !imageFile?(
                    
                    <Label htmlFor="image-upload" className='flex flex-col items-center justify-center h-32 cursor-pointer '> 
                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-2"/>
                        <span>Drag & Drop or Click to Upload Image</span>
                    </Label>
                    
                    ) : 
                    (
                        <div className="flex items-center justify-between">
                            <div>
                                <FileIcon className="w-8 text-primary mr-2 h-8"/>
                            </div>
                            <p className="text-sm font-medium">{imageFile.name}</p>
                            <Button variant='ghost' size='icon' className='text-muted-foreground hover:text-foreground' onClick={handleRemoveImage}> {/* Changed varient to variant */}
                                <XIcon className="w-4 h-4"/>
                                <span className="sr-only">Remove File</span>
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ProductImageUpload;



import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloud, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "../ui/shadcn-io/spinner";

function ProductImageUpload({
    imageFile,
    setImageFile,
    uploadedImageUrl,
    setUploadedImageUrl
}) {
    const inputRef = useRef(null);
    const [isImageLoading, setImageLoading] = useState(false);

    function handleImageFileChange(e) {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) setImageFile(selectedFile);
    }

    function handleDragover(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) setImageFile(droppedFile);
    }

    function handleRemoveImage() {
        setImageFile(null);
        setUploadedImageUrl(''); // Clear uploaded URL too
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    async function uploadImageToCloudinary() {
        try {
            const data = new FormData();
            data.append('my_file', imageFile);
            setImageLoading(true);

            const response = await axios.post(
                'http://localhost:8000/api/v1/admin/products/imageUpload',
                data,
                { withCredentials: true }
            );

            if (response?.data?.data?.secure_url) {
                setUploadedImageUrl(response.data.data.secure_url);
                toast.success('Image uploaded successfully');
            }
        } catch (error) {
            if (error?.status === "FETCH_ERROR" || error?.error?.includes("Failed to fetch")) {
                toast.error("Sorry..Something Went Wrong");
            } else {
                toast.error(error?.data?.message || error.error || "Something went wrong");
            }
        } finally {
            setImageLoading(false);
        }
    }

    useEffect(() => {
        if (imageFile !== null) uploadImageToCloudinary();
    }, [imageFile]);

    // Check if we have an existing uploaded image (no new file selected)
    const hasUploadedImage = uploadedImageUrl && !imageFile;

    return (
        <div className="w-full max-w-md mx-auto">
            <label className="text-sm font-bold pl-6 block mb-4">Upload Images</label>
            <div 
                className="border-2 border-dashed rounded-lg p-6 mx-2" 
                onDragOver={handleDragover} 
                onDrop={handleDrop}
            >
                <Input 
                    id="image-upload" 
                    type='file' 
                    hidden 
                    ref={inputRef} 
                    onChange={handleImageFileChange}
                    accept="image/*"
                /> 

                {/* Show existing image when available */}
                {hasUploadedImage ? (
                    <div className="space-y-2">
                        <div className="relative">
                            <img 
                                src={uploadedImageUrl} 
                                alt="Product" 
                                className="w-full h-32 object-cover rounded-md"
                            />
                            <Button 
                                variant='destructive' 
                                size='icon' 
                                className='absolute top-2 right-2'
                                onClick={handleRemoveImage}
                            > 
                                <XIcon className="w-4 h-4"/>
                                <span className="sr-only">Remove Image</span>
                            </Button>
                        </div>
                        <Label 
                            htmlFor="image-upload" 
                            className='flex items-center justify-center p-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground'
                        > 
                            Click to change image
                        </Label>
                    </div>
                ) : !imageFile ? (
                    /* Upload area when no image */
                    <Label 
                        htmlFor="image-upload" 
                        className='flex flex-col items-center justify-center h-32 cursor-pointer'
                    > 
                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-2"/>
                        <span>Drag & Drop or Click to Upload Image</span>
                    </Label>
                ) : (
                    /* Uploading new image */
                    isImageLoading ? (
                        <div className="flex items-center justify-center h-32">
                            <Spinner/>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileIcon className="w-8 text-primary h-8"/>
                                <p className="text-sm font-medium">{imageFile.name}</p>
                            </div>
                            <Button 
                                variant='ghost' 
                                size='icon' 
                                className='text-muted-foreground hover:text-foreground' 
                                onClick={handleRemoveImage}
                            > 
                                <XIcon className="w-4 h-4"/>
                                <span className="sr-only">Remove File</span>
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default ProductImageUpload;
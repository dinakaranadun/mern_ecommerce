import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { UploadCloud, X } from "lucide-react";
import { Button } from "../ui/button";


function ProductImageUpload({
    setImageFile,
    uploadedImageUrl,
    setUploadedImageUrl
}) {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    function handleImageFileChange(e) {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setImageFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    }

    function handleDragover(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setImageFile(droppedFile);
            const url = URL.createObjectURL(droppedFile);
            setPreviewUrl(url);
        }
    }

    function handleRemoveImage() {
        setImageFile(null);
        setUploadedImageUrl('');
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    const displayImageUrl = uploadedImageUrl || previewUrl;
    const hasImage = displayImageUrl !== null && displayImageUrl !== '';

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

                {hasImage ? (
                    <div className="space-y-2">
                        <div className="relative">
                            <img 
                                src={displayImageUrl} 
                                alt="Product preview" 
                                className="w-full h-32 object-cover rounded-md"
                            />
                            <Button 
                                variant='destructive' 
                                size='icon' 
                                className='absolute top-2 right-2'
                                onClick={handleRemoveImage}
                            > 
                                <X className="w-4 h-4"/>
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
                ) : (
                    <Label 
                        htmlFor="image-upload" 
                        className='flex flex-col items-center justify-center h-32 cursor-pointer'
                    > 
                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-2"/>
                        <span>Drag & Drop or Click to Upload Image</span>
                    </Label>
                )}
            </div>
        </div>
    );
}

export default ProductImageUpload;
"use client";
import { useEffect, useState } from 'react';
import EXIF from 'exif-js';
import Preview from './_components/preview';

interface ImageUploaderProps {
    onImageUpload: (file: Blob) => void;
    reset?: boolean;
    hidden?: boolean;
}

export default function ImageUploader({onImageUpload, reset}: ImageUploaderProps) {
    const [image, setImage] = useState<string | null>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    useEffect(() => {
        if (reset) {
            setImage(null);
            setIsImageUploaded(false);
        }
    }, [reset]);

    const fixImageOrientation = (file: File, callback: (blob: Blob) => void) => {
        EXIF.getData(file, function () {
            try {
                const orientation = EXIF.getTag(this, 'Orientation') || 1;
                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    if (!ctx) {
                        console.error('Canvas context is not supported');
                        return;
                    }
    
                    if (orientation > 4) {
                        canvas.width = img.height;
                        canvas.height = img.width;
                    } else {
                        canvas.width = img.width;
                        canvas.height = img.height;
                    }
    
                    switch (orientation) {
                        case 2:
                            ctx.transform(-1, 0, 0, 1, img.width, 0);
                            break;
                        case 3:
                            ctx.transform(-1, 0, 0, -1, img.width, img.height);
                            break;
                        case 4:
                            ctx.transform(1, 0, 0, -1, 0, img.height);
                            break;
                        case 5:
                            ctx.transform(0, 1, 1, 0, 0, 0);
                            break;
                        case 6:
                            ctx.transform(0, 1, -1, 0, img.height, 0);
                            break;
                        case 7:
                            ctx.transform(0, -1, -1, 0, img.height, img.width);
                            break;
                        case 8:
                            ctx.transform(0, -1, 1, 0, 0, img.width);
                            break;
                        default:
                            break;
                    }
                    
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const previewURL = URL.createObjectURL(blob);
                            setImage(previewURL);
                            setImageDimensions({ width: canvas.width, height: canvas.height });
                            callback(blob);
                        }
                    }, file.type);
                }
            } catch (error) {
                console.error('Error reading EXIF data:', error);
                const previewUrl = URL.createObjectURL(file);
                setImage(previewUrl);
                callback(file);
            };
        });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            fixImageOrientation(file, (blob) => {
                onImageUpload(blob);
            });
            setIsImageUploaded(true);
    }};

    return (
        <div>        
            <div className="flex flex-col items-center justify-center w-[75vw] h-[50vh]">
                { !isImageUploaded ? (
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, HEIC, etc.</p>
                        </div>
                        <input id="dropzone-file" type="file" accept='image/*' className="hidden" onChange={handleFileChange}/>
                    </label>
                ) : (null)}
            {image && imageDimensions && (<Preview image={image} width={imageDimensions.width} height={imageDimensions.height}/>)}
            </div>
        </div>
    );
}
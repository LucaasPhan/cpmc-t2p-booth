"use client";
import { useEffect, useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import { Raleway } from "next/font/google";

const raleway = Raleway({
    subsets: ["vietnamese"],
});

export default function Home() {
  const [resetUpload, setResetUpload] = useState(false);
  const [hidden, setHidden] = useState(true);


  useEffect(() => {
    if (resetUpload) {
      setResetUpload(false);
    }
  }, [resetUpload]);

  const handleImageUpload = async (file: Blob) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Unexpected response:', text);
        throw new Error('Server returned non-JSON response');
      }

      const result = await response.json();
      if (result) {
        setHidden(false);
        console.log(result)
      }
  
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <>
      <div className={`w-[100vw] h-[100vh] py-10 md:py-20 md:p-20 flex flex-col items-center justify-start ${raleway.className} gap-y-10`}>
        <h1 className=' text-5xl md:text-6xl font-bold'>CPMC PHOTO UPLOAD</h1>
        <ImageUploader onImageUpload={handleImageUpload} reset={resetUpload}/>
        { !hidden && (
          <button onClick={() => {setResetUpload(true); setHidden(true)}} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>UPLOAD 1 ẢNH KHÁC</button>
          
        )}
      </div>
    </>
  );
}
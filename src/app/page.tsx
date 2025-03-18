"use client";
import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import { Raleway } from "next/font/google";

const raleway = Raleway({
    subsets: ["vietnamese"],
});

export default function Home() {
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
  
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <>
      <div className={`w-[100vw] h-[100vh] p-10 flex flex-col items-center justify-start ${raleway.className}`}>
        <h1 className='text-6xl font-bold'>PHOTO PRINTING</h1>
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>
    </>
  );
}
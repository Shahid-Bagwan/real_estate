import React from 'react';
import { useState } from 'react';
import { getDownloadURL, ref, getStorage, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
export default function CreateListing() {
    const [files, setFiles] = React.useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [error, setError] = useState("");
    const handleImageSubmit = async () => {
        if (!files) return;
        if (files?.length > 0 && files?.length + formData.imageUrls.length <= 6) {

            const promises = [];
            setUploading(true);
            setError("");
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setUploading(false);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }).catch((error) => {
                setError('Image upload failed (2 mb max per image)');
                setUploading(false);
            });

        }
        else {
            setError('You can only upload 6 images per listing');
            setUploading(false);
        }

    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const filename = Date.now() + file.name;
            const reference = ref(storage, filename);
            const uploadTask = uploadBytesResumable(reference, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );

        });
    }

    const deleteImage = (index: number) => {
        const newImageUrls = formData.imageUrls.filter((url, i) => i !== index);
        setFormData({ ...formData, imageUrls: newImageUrls });
    };
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Create a Listing
            </h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type='text'
                        placeholder='Name'
                        className='border p-3 rounded-lg'
                        id='name'
                        maxLength={62}
                        minLength={10}
                        required
                    />
                    <textarea
                        placeholder='Description'
                        className='border p-3 rounded-lg'
                        id='description'
                        required
                    />
                    <input
                        type='text'
                        placeholder='Address'
                        className='border p-3 rounded-lg'
                        id='address'
                        required
                    />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sale' className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5' />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-5 '>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='bedrooms'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                            />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='bathrooms'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                            />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='regularPrice'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                            />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='discountPrice'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                            />
                            <div className='flex flex-col items-center'>
                                <p>Discounted price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => { setFiles(e.target.files) }} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                        <button type='button' onClick={handleImageSubmit} disabled={uploading} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading' : 'Upload'}</button>
                    </div>
                    <p className='text-red-700'>{error && error}</p>
                    {formData.imageUrls.length > 0 ? formData.imageUrls.map((url, index) => (
                        <div
                            key={url}
                            className='flex justify-between p-3 border items-center'>
                            <img src={url} alt="" className='w-20 h-20 object-contain rounded-lg' />
                            <button onClick={() => deleteImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                        </div>
                    )) : ""
                    }
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
                </div>
            </form>
        </main>
    );
}
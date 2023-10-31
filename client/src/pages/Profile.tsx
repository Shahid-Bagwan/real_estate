import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, getStorage, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef<HTMLInputElement>(null);
  const [profilepic, setProfilepic] = useState(undefined);
  const [filepercent, setFilepercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEffect(() => {
   if (profilepic) {

      handleFileUpload(profilepic);
    }
  }, [profilepic]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleFileUpload = (profilepic) => {
    const storage = getStorage(app);
    const filename = Date.now() + profilepic;
    const reference = ref(storage, `profilepic/${filename}`);
    const uploadTask = uploadBytesResumable(reference, profilepic);
    
    uploadTask.on(
      "state_changed",
      // snapshot is the progress of the upload,we can use it to show the progress bar
      (snapshot: { bytesTransferred: number; totalBytes: number; }) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilepercent(Math.round(progress));
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (error) => {
        setFileUploadError(true);
      },
      () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilepic: downloadURL });
        });
      }
    );
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" 
        onChange={(e) =>{
          {/*  eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/*  @ts-ignore */}
          setProfilepic(e.target.files[0]) 
        } 
        } />
        <img
          onClick={() => fileRef.current?.click()}
          /*  eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          /*  @ts-ignore */
          src={formData.profilepic ||currentUser.profilepic}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">

        {fileUploadError ? (
          <span className="text-red-700">Image Upload Erro : size should be less than 2 mb</span>
        ) : filepercent > 0 && filepercent < 100 ? (
          <span className="text-green-700"> {`Uploading : ${filepercent}`}</span>
        ) : filepercent === 100 ? (
          <span className="text-green-700"> Image Uploaded Successfully</span>
        ) : (
          ""
        )
        }
        </p>

        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}

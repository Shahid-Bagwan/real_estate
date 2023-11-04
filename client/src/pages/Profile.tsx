import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  ref,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  //eslint-disable-next-line
  // @ts-ignore
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [profilepic, setProfilepic] = useState(undefined);
  const [filepercent, setFilepercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [listingData, setListingData] = useState([]);
  const [deleteListingError, setDeleteListingError] = useState(false);

  useEffect(() => {
    if (profilepic) {
      handleFileUpload(profilepic);
    }
  }, [profilepic]);

  const handleFileUpload = (profilepic) => {
    const storage = getStorage(app);
    const filename = Date.now() + profilepic;
    const reference = ref(storage, `profilepic/${filename}`);
    const uploadTask = uploadBytesResumable(reference, profilepic);

    uploadTask.on(
      "state_changed",
      // snapshot is the progress of the upload,we can use it to show the progress bar
      (snapshot: { bytesTransferred: number; totalBytes: number }) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilepercent(Math.round(progress));
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePic: downloadURL });
        });
      }
    );
  };

  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const updatedUser = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await updatedUser.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const deleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const deletedUser = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await deletedUser.json();
      if (data.status === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.meesage));
    }
  };

  const signOut = async () => {
    try {
      dispatch(signOutUserStart());
      const signOutUser = await fetch(`/api/auth/signout`);
      const data = await signOutUser.json();
      if (data.status === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.meesage));
    }
  };

  const showlistings = async () => {
    try {
      setShowListingError(false);
      const data = await fetch(`/api/user/listings/${currentUser._id}`);
      const listingData = await data.json();
      if (listingData.success === false) {
        setShowListingError(true);
        return;
      }
      setListingData(listingData);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const deletelisting = async (id) => {
    try {
      setDeleteListingError(false);
      const data = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const deletedListing = await data.json();
      if (deletedListing.success === false) {
        setDeleteListingError(true);
        return;
      }

      setListingData(listingData.filter((listing) => listing._id !== id));
    } catch (error) {
      setDeleteListingError(true);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={formSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => {
            setProfilepic(e.target.files[0]);
          }}
        />
        <img
          onClick={() => fileRef.current?.click()}
          /*  eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          /*  @ts-ignore */
          src={formData.profilePic || currentUser.profilePic}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Image Upload Erro : size should be less than 2 mb
            </span>
          ) : filepercent > 0 && filepercent < 100 ? (
            <span className="text-green-700">
              {" "}
              {`Uploading : ${filepercent}`}
            </span>
          ) : filepercent === 100 ? (
            <span className="text-green-700"> Image Uploaded Successfully</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleFormData}
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleFormData}
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleFormData}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={deleteUser} className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span onClick={signOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-600">{error ? `${error.message}` : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "Update Successfully" : ""}
      </p>
      <button onClick={showlistings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-green-700 w-full">
        {showListingError ? "Error showing listings" : ""}
      </p>
      {listingData && listingData.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {listingData.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => deletelisting(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>

                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-red-600">
        {deleteListingError ? "Error deleting listing" : ""}
      </p>
    </div>
  );
}

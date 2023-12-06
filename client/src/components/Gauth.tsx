import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";

export default function Gauth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const googleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch(
        "https://real-estate-backend-mu.vercel.app/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            imageurl: result.user.photoURL,
          }),
        }
      );
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("the authentification failed");
    }
  };
  return (
    <button
      className="bg-orange-400 text-white p-3 rounded-lg uppercase hover:opacity-95"
      type="button"
      onClick={googleAuth}
    >
      Continue with google
    </button>
  );
}

// export default Gauth;

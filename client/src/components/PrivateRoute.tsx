import { useSelector } from "react-redux";
import{Outlet, Navigate} from 'react-router-dom';
const PrivateRoute = () => {
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    const{currentUser} = useSelector((state) => state.user);
  return currentUser ? <Outlet/> : <Navigate to='/sign-in'/>
   
}

export default PrivateRoute;
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebase";
import { logoutRequest } from "../features/auth/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const signOut = () => {
    auth.signOut();
    dispatch(logoutRequest());
    navigate("/");
  };

  return (
    <div>
      {user ? <div>{user.displayName} 님</div> : <div>손님</div>}
      <NavLink to={"/"}>Cozy</NavLink>
      <NavLink to={"/main"}>거래소</NavLink>
      <NavLink to={"/assets"}>자산현황</NavLink>
      <NavLink to={"/mypage"}>마이페이지</NavLink>
      <NavLink to={"/transaction-history"}>거래내역</NavLink>
      <button onClick={signOut}>로그아웃</button>
    </div>
  );
}

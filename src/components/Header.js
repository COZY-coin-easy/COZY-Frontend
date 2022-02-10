import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Header() {
  const navigate = useNavigate();

  const signOut = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div>
      <div>유저명</div>
      <NavLink to={"/"}>Cozy</NavLink>
      <NavLink to={"/main"}>거래소</NavLink>
      <NavLink to={"/assets"}>자산현황</NavLink>
      <NavLink to={"/transaction-history"}>거래내역</NavLink>
      <NavLink to={"/:userId"}>마이페이지</NavLink>
      <button onClick={signOut}>로그아웃</button>
    </div>
  );
}

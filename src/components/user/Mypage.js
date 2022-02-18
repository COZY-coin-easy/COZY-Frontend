import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { signInWithGoogle } from "../../firebase";
import {
  BLACK,
  WHITE,
  MAIN_COLOR_1,
  MAIN_COLOR_2,
  MAIN_COLOR_3,
} from "../../constants/styles";

export default function MyPage() {
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <>
      <Anchor />
      {!isLoggedIn ? (
        <>
          <Message>로그인 후 이용 가능한 서비스입니다.</Message>
          <Button onClick={signInWithGoogle}>구글 로그인</Button>
        </>
      ) : (
        <>
          <Container>
            <Bar />
            <Title>마이페이지</Title>
          </Container>
          <ContentsContainer>
            <Content>이름</Content>
            <Content>{user.displayName}</Content>
          </ContentsContainer>
          <ContentsContainer>
            <Content>E-mail</Content>
            <Content>{user.email}</Content>
          </ContentsContainer>
        </>
      )}
    </>
  );
}

const Anchor = styled.span`
  display: block;
  height: 80px;
  visibility: hidden;
`;

const Title = styled.div`
  margin-left: 7px;
  font-weight: 500;
  font-size: 2rem;
  color: ${BLACK};
`;

const Content = styled.div`
  width: 300px;
  font-weight: 500;
  font-size: 1.3rem;
  color: ${BLACK};
`;

const Bar = styled.div`
  width: 7px;
  height: 40px;
  margin-left: 20px;
  background-color: ${MAIN_COLOR_1};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px 50px 20px;
`;

const ContentsContainer = styled(Container)`
  justify-content: space-evenly;
  text-align: left;
  margin: 20px;
  margin-left: 50px;
`;

const Message = styled.h4`
  text-align: center;
`;

const Button = styled.button`
  height: 35px;
  width: 100px;
  display: block;
  margin: auto;
  background: ${MAIN_COLOR_3};
  color: ${WHITE};
  border-color: ${MAIN_COLOR_3};
  border-style: none;
  border-radius: 0.2rem;
  cursor: pointer;

  :hover {
    background-color: ${MAIN_COLOR_2};
    border-color: ${MAIN_COLOR_2};
    color: ${WHITE};
    transition: 0.2s;
  }
`;

import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { BLACK, MAIN_COLOR_1 } from "../constants/styles";

export default function MyPage() {
  const user = useSelector((state) => state.user.user);

  return (
    <>
      <Anchor />
      <Container>
        <Bar />
        <Title>마이페이지</Title>
      </Container>
      <ContentContainer>
        <Content>이름</Content>
        <Content>{user.displayName}</Content>
      </ContentContainer>
      <ContentContainer>
        <Content>E-mail</Content>
        <Content>{user.email}</Content>
      </ContentContainer>
    </>
  );
}

const Anchor = styled.span`
  display: block;
  height: 70px;
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

const ContentContainer = styled(Container)`
  justify-content: space-evenly;
  text-align: left;
  margin: 20px;
  margin-left: 50px;
`;

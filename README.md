# 💸 Coin is Easy

<img width="2030" alt="image" src="https://user-images.githubusercontent.com/85345068/154671701-c9187aae-ef74-4d09-b34f-c98352ef109f.png">
초보자를 위한 가상화폐 모의 투자 Cozy입니다!

부자가 되고 싶나요? 성투하고 싶은데 피 같은 내 돈 잃을까봐 무서우신가요?

실전 투자 하기 전 미리 매수, 매도 연습하고 실시간으로 변하는 코인 시세와 차트를 보며 실제 코인 시장에 대한 감각을 키우세요!

Cozy가 여러분의 성투를 도와드리겠습니다.

## 📈Preview

[시연 영상]
- 부가 설명 추가하는게 나을까? 아니면 그냥 영상 또는 이미지만 첨부?

## 🚀 ShortCut
- 💡 Motivation
- ✅ Features
- 📅 Schedule
- 🖥 Tech Stack
- 🕹 Getting Started
- 🤔 Why we used it
- 🔥 Challenge


## 💡 Motivation
과거엔 성실히 일하고 돈을 모으면 누구나 중산층, 내 집 마련을 할 수 있는 시대가 있었습니다. 하지만 내 월급 빼고 다 오르는 요즘. 근로 소득으로는 이제 돈을 모으기 힘든 시대가 도래했습니다.

많은 2030 들이 적급보다 수익률이 좋다며 코인 시장에 뛰어들며 주식 열풍이 불었습니다. 하지만 손해를 본 젊은이들이 많은게 현실이죠.

왜 일까요? 지식, 공부의 부족도 있겠지만 코인 시장의 흐름을 읽지 못 하고 잃어 가며 배우기 때문이라고 생각했습니다.

피 같은 돈을 그렇게 쉽게 잃었는데도 존버하면 된다며 애써 위로하는 분들을 외면할 수 없었습니다.

그래서 코인을 처음 시작하려는 초보자 분들을 위해 연습할 수 있는 모의 거래소 Cozy를 만들게 되었습니다.


## ✅ Features
👉 사용자는 **실시간으로 가상화폐의 시세, 24시간 내 변동률, 거래량**을 확인할 수 있습니다.

👉 사용자는 **실시간으로 변하는 차트**를 볼 수 있습니다.

👉 사용자는 차트와 실시간으로 변하는 코인 시세를 보며 **매수, 매도**를 할 수 있습니다.

👉 **사용자가 보유한 자산(코인), 그리고 나의 수익률**을 볼 수 있습니다.

👉 **사용자가 거래한 내역**을 볼 수 있습니다.

## 🌎 Deploy
### Client
- Netlify Client 배포 👉 **https://www.coineasy.site**
### Server

## 📅 Schedule
기획 : 2022/1/24 ~ 2022/1/30 (1주간)

1주차 아이디어 및 기술스택 검토

개발 : 2022/2/04 ~ 2020/2/18 (2주간)

2주차 기능 구현

3주차 UI / 배포

## 🖥 Tech Stack
### Frontend
- React(Create-react-app)
- React-router-dom
- Redux
- Redux-saga
- Redux-toolkit
- Firebase
- Styled-Component
- Jest(Test)

### Backend
- Express 
- Websocket
- Mongo db
- Mongoose
- Firebase-admin
- Supertest(Test)

### Convention
- prettier
- eslint


## 🕹 Getting Started
### Installation
- Local 환경에서 실행하기 위해서 몇 가지 사전 준비가 필요합니다.
- 각 Repository를 Clone 한 후, .env 파일에 환경 변수를 입력해주세요.

- Frontend
```
git clone https://github.com/COZY-coin-easy/COZY-Frontend.git
npm install
npm run start
```

- Backend
```
git clone https://github.com/COZY-coin-easy/COZY-Backend.git
npm install
npm run start
```


## 🤔 Why we used it
### Web Socket
실시간으로 바뀌는 코인 시세를 새로 고침 없이 바로 확인하기 위해서 양방향 통신 방법인 web socket을 사용했습니다. 클라이언트와 서버 간 통신은 해봤어도 클라이언트<->서버, 서버<->빗썸 간 2번 통신을 통해 빗썸 데이터를 클라이언트 서버로 데이터를 넘겨주기 위해 2개의 소켓을 연결하는 것은 새로운 도전이었습니다.

클라이언트와 서버 간 통신을 열어주기만 하면 서로 이벤트를 듣고 있다가 이벤트의 변화가 발생하면 서로에게 데이터를 보내주는 것이 불규칙적으로 발생하는 코인 데이터를 다루기에 안성 맞춤이었습니다. 하지만 빗썸에서 제공해주는 190개의 코인 데이터가 산발적으로 유입되는 것을 다루다보니 어떻게 처리해야할지에 대한 고민이 생겼고 단순 react, redux 상태 관리만으로는 한계가 있다고 생각했습니다. 그래서 비동기 처리가 가능한 redux saga와 redux 를 보다 편리하게 사용할 수 있게 하는 redux toolkit을 사용하게 되었습니다.

### Redux Saga 
web socket으로 실시간으로 발생하는 코인 데이터를 다루는 것이 이번 프로젝트의 생명이라고 생각했습니다. 실시간으로 데이터 처리와 렌더링을 동시에 하기 위해서는 비동기 처리와 동기적으로 데이터를 다룰 수 있는 함수 사용이 필수였습니다. 그래서 Generator 함수 기능을 활용할 수 있는 Redux Saga를 사용하기로 결정했습니다.

Generator 함수에 대한 개념을 새로 익히면서 러닝 커브가 높은 Redux Saga라는 새로운 미들웨어에 대해 공부를 하다보니 손에 익을 때까지의 시간이 조금 필요했지만, Redux Saga를 사용해보니 왜 Web socket과 찰떡이라고 하는지 이해 됐습니다. 앞서 말씀드린 코인 데이터를 Generator 기능으로 관리해 주도적으로 데이터 관리를 할 수 있었고 Redux Saga의 정형화 된 로직이 이해가 된 후에는 오히려 작성하기 편해 속도가 올랐습니다.

그리고 Redux에서 상태 관리를 하니 코인 시세가 필요한 컴포넌트에서 재사용하기 편리했습니다. 그러다보니 처음 각 컴포넌트 별로 state 관리를 하기 위한 코드 몇 십줄이 dispatch를 활용한 몇 줄로 줄어드는 것을 경험한 것은 정말 신선한 충격이었습니다.

### Redux Toolkit

### Bithumb Api
세계 코인 거래소를 평가하는 '거래 점수' 라는 기준으로 빗썸 api를 선정했습니다. 거래 점수란 웹 트래픽 요인, 평균 유동성, 볼륨 및 교환에 의해 보고된 볼륨이 적합한 신뢰도에 기반하여 순위를 정한 기준으로서 데이터의 신뢰도가 중요한 중요 지표라고 생각했습니다. 10점 만점 중에 7점 이상, 그리고 초보자를 위한 모의 거래소이기 때문에 원화 데이터(KRW)를 제공해주는 거래소여야 했습니다. 빗썸과 업비트 중 7점인 빗썸을 택했으며 대중성도 있어 초보자들이 친근하게 접근할 수 있을거라 생각했습니다.



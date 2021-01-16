# se109a-blog

a simple blog web application

## Setup

```
npm install
```

## Run

run backend server

```
npm start
```

run frontend server

```
npm run client
```

## Test

API test

```
npm run test:api
```

E2E test

```
npm run test:e2e
```

## 專案成員

- 110713305 資工三 黃朝新

## 開發方式

- 螺旋模式開發
- 合作模式用 github flow

## 系統分析

### User Story

登入驗證：

- 註冊
- 登入
- 登出

貼文：

- 使用者可以檢視所有貼文
- 使用者可以檢視單一貼文
- 使用者可以新增貼文
- 使用者可以修改自己發布的貼文
- 使用者可以刪除自己發布的貼文

## 系統設計

資料庫、API、前端介面

### 資料庫

![image](https://plantuml-server.kkeisuke.app/svg/ROvD2W8n38NtEKN0pOZq3kF6ZPlPU80o3Lfe6qaY8iFStRJWparU_hx7czMYsAiM06gMxOCt9S4D44-OqxHSZzw6uAN5IYvKOowkpwZwPacm-_235rRx2nzm5Oh6udkSBkFWHEcEApTpldVzXyxcdZ1o1CdtXmNUXZF0J2rvs2y0.svg)

### API

登入驗證

| Method | URL         | Result |
| ------ | ----------- | ------ |
| POST   | auth/signup | 註冊   |
| POST   | auth/login  | 登入   |
| POST   | auth/logout | 登出   |

貼文

| Method | URL       | Result       |
| ------ | --------- | ------------ |
| GET    | /posts    | 檢視所有貼文 |
| GET    | /post/:id | 檢視一則貼文 |
| PUT    | /post/:id | 更新一則貼文 |
| DELETE | /post/:id | 刪除一則貼文 |

## 實作

Node.js + Mongodb + Vanilla.js

- 後端 API 以 TDD 開發

## 測試

單元測試、整合測試、E2E 測試
mocha、chai、supertest、puppeteer

- 用 Supertest 做整合測試
- 用 Puppteer 做端對端的測試

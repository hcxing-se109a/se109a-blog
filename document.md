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

### 測試結果：

後端 API

```
user@DESKTOP-9VVBDPS MINGW64 /d/Xing/Web-Dev/Projects/se109a-blog (test/e2e)
$ npm run test:api

> se109a-blog@1.0.0 test:api D:\Xing\Web-Dev\Projects\se109a-blog
> mocha ./test/**/*.test.js

Server: http://localhost:3000


  API: auth
    POST api/auth/signup
  <-- POST /api/auth/signup
  --> POST /api/auth/signup 201 685ms 34b
      √ should create user (709ms)
  <-- POST /api/auth/signup
  xxx POST /api/auth/signup 400 19ms -
      √ should throw an error if Email has been use
    POST api/auth/login
  <-- POST /api/auth/login
  --> POST /api/auth/login 200 350ms 314b
      √ should login with the right email and password (351ms)
  <-- POST /api/auth/login
  xxx POST /api/auth/login 400 293ms -
      √ should throw an error when email or password is invalid (296ms)
    POST /api/auth/logout
  <-- POST /api/auth/logout
  --> POST /api/auth/logout 200 4ms 29b
      √ should logout

  API: post
    POST api/auth/signup
  <-- POST /api/auth/signup
  --> POST /api/auth/signup 201 327ms 34b
      √ sign up with test user (329ms)
    POST api/auth/login
  <-- POST /api/auth/login
  --> POST /api/auth/login 200 317ms 314b
      √ login with test user (321ms)
    POST /api/post
  <-- POST /api/post
  --> POST /api/post 201 56ms 268b
      √ should create a new post (59ms)
    GET /api/posts
  <-- GET /api/posts
  --> GET /api/posts 200 62ms 1.59kb
      √ should return all posts (63ms)
    GET /api/post/:id
  <-- GET /api/post/60032529125ee74b24f21d91
  <-- GET /api/post/60032529125ee74b24f21d91
  --> GET /api/post/60032529125ee74b24f21d91 200 19ms 267b
      √ should return a post
    PUT /api/posts/:id
  <-- PUT /api/post/60032529125ee74b24f21d91
  --> PUT /api/post/60032529125ee74b24f21d91 200 45ms 281b
      √ should update a post (48ms)
    DELETE /api/post/:id
  <-- DELETE /api/post/60032529125ee74b24f21d91
  --> DELETE /api/post/60032529125ee74b24f21d91 200 41ms 38b
      √ should delete a post (43ms)
```

端對端測試：

```
user@DESKTOP-9VVBDPS MINGW64 /d/Xing/Web-Dev/Projects/se109a-blog (test/e2e)
$ npm run test:e2e

> se109a-blog@1.0.0 test:e2e D:\Xing\Web-Dev\Projects\se109a-blog
> mocha ./test/client

Server: http://localhost:3000


  End-to-End test:
Serving "./client" at http://127.0.0.1:8080
Ready for changes
    client side test:
GET /favicon.ico 404 2.480 ms - 150
      √ show home page (1944ms)
      √ should show sign up page
  <-- OPTIONS /api/auth/signup
  --> OPTIONS /api/auth/signup 204 3ms
  <-- POST /api/auth/signup
  --> POST /api/auth/signup 201 382ms 34b
      √ should show login page after sign up (1128ms)
  <-- OPTIONS /api/auth/login
  --> OPTIONS /api/auth/login 204 1ms
  <-- POST /api/auth/login
  --> POST /api/auth/login 200 314ms 314b
  <-- OPTIONS /api/posts?page=1
  --> OPTIONS /api/posts?page=1 204 6ms
  <-- GET /api/posts?page=1
  --> GET /api/posts?page=1 200 66ms 1.88kb
      √ should show home page after login (1108ms)
  <-- OPTIONS /api/post
  --> OPTIONS /api/post 204 1ms
  <-- POST /api/post
  --> POST /api/post 201 62ms 268b
  <-- GET /api/posts?page=1
  --> GET /api/posts?page=1 200 61ms 1.59kb
      √ create a post (1236ms)
  <-- OPTIONS /api/post/60032745fcb3144838f14a09
  --> OPTIONS /api/post/60032745fcb3144838f14a09 204 2ms
  <-- GET /api/post/60032745fcb3144838f14a09
  --> GET /api/post/60032745fcb3144838f14a09 200 34ms 267b
      √ view a post (1078ms)
  <-- GET /api/post/60032745fcb3144838f14a09
  --> GET /api/post/60032745fcb3144838f14a09 200 21ms 267b
  <-- PUT /api/post/60032745fcb3144838f14a09
  --> PUT /api/post/60032745fcb3144838f14a09 200 51ms 281b
  <-- GET /api/posts?page=1
  --> GET /api/posts?page=1 200 61ms 1.61kb
      √ edit a post (1619ms)
  <-- DELETE /api/post/60032745fcb3144838f14a09
  --> DELETE /api/post/60032745fcb3144838f14a09 200 43ms 38b
      √ delete a post (533ms)
  <-- OPTIONS /api/auth/logout
  --> OPTIONS /api/auth/logout 204 0ms
  <-- POST /api/auth/logout
  --> POST /api/auth/logout 200 16ms 29b
      √ should show login page after logout (1061ms)


  9 passing (11s)
```

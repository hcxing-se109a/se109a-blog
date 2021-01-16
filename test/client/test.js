const app = require("../../server/app.js");
const server = app.listen();
const liveServer = require("live-server");
const expect = require("chai").expect;
const mongoose = require("mongoose");
const testData = require("../data");
const puppeteer = require("puppeteer");
require("dotenv").config();

const clientURL = "http://localhost:8080";

let { user, post } = testData;

let browser, page;

describe("End-to-End test: ", () => {
  before(async () => {
    await liveServer.start({ root: "./client", open: false });
    mongoose.createConnection(`${process.env.MONGODB_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      browser = await puppeteer.launch({
        ignoreDefaultArgs: true,
        headless: false,
      });
      page = await browser.newPage();
    } catch (error) {
      console.log(error.message);
    }
  });

  after(async () => {
    try {
      // 刪除 user 的測試資料
      await testData.deleteTestUser();
      server.close();
      mongoose.connection.close();

      await browser.close();
    } catch (error) {
      console.log(error.message);
    }
  });

  describe("client side test:", () => {
    it("show home page", async () => {
      await page.goto(`${clientURL}`, { timeout: 3000 });
      await page.click("a[href='#/signup']");
    });

    it("should show sign up page", async () => {
      let header = await page.evaluate(() => {
        return document.querySelector("h2").innerHTML;
      });
      expect(header).to.be.equal("註冊");
    });

    it("should show login page after sign up", async () => {
      await page.type("#email", user.email);
      await page.type("#name", user.name);
      await page.type("#password", user.password);
      await page.click(".btn");
      await page.waitForTimeout(1000);

      let header = await page.evaluate(() => {
        return document.querySelector("h2").innerHTML;
      });
      expect(header).to.be.equal("登入");
    });

    it("should show home page after login", async () => {
      await page.type("#email", user.email);
      await page.type("#password", user.password);
      await page.click("button");
      await page.waitForTimeout(1000);
      let userName = await page.evaluate(() => {
        return document.querySelector(".user-name").innerHTML;
      });
      expect(userName).to.be.equal(user.name);
    });

    it("create a post", async () => {
      try {
        await page.click(".modal-trigger");
        await page.type("#title", post.title);
        await page.type("#content", post.content);
        await page.click(".modal-footer button");
        await page.waitForTimeout(500);
        let header = await page.evaluate(() => {
          return document.querySelector(".post h1").innerHTML;
        });
        expect(header).to.be.equal(post.title);
        await page.waitForTimeout(500);
      } catch (error) {
        console.log(error.message);
      }
    });

    it("view a post", async () => {
      await page.click(".post .view-post-btn");
      await page.waitForTimeout(500);

      let postTitle = await page.evaluate(() => {
        return document.querySelector(".view-title").innerHTML;
      });
      expect(postTitle).to.be.equal(post.title);
      await page.click(".close-view");
      await page.waitForTimeout(500);
    });

    it("edit a post", async () => {
      await page.click(".post .edit-post-btn");
      await page.waitForTimeout(500);

      let newTitle = post.title + "-edited";

      await page.type(".edit-title", "-edited");
      await page.type(".edit-content", "-edited");
      await page.click(".modal.edit .modal-footer button");
      await page.waitForTimeout(1000);
      let header = await page.evaluate(() => {
        return document.querySelector(".post h1").innerHTML;
      });
      expect(header).to.be.equal(newTitle);
    });

    it("delete a post", async () => {
      await page.click(".post .delete-post-btn");
      await page.waitForTimeout(500);

      let postTitle = await page.evaluate(() => {
        return document.querySelector(".post h1").innerHTML;
      });
      expect(postTitle).to.not.equal(post.title);
    });

    it("should show login page after logout", async () => {
      await page.click("a[href='#/logout']");
      await page.waitForTimeout(1000);
      let header = await page.evaluate(() => {
        return document.querySelector("h2").innerHTML;
      });
      expect(header).to.be.equal("登入");
    });
  });
});

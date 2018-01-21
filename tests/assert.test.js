"use strict";


const Ghoul = require('../lib/ghoul');
const utils = require('./utils');

describe("Assert", () => {
    let browser;
    beforeEach(async () => {
        browser = await Ghoul.createBrowser();
    });

    it("Exists", async () => {
        await browser.open("http://localhost:3456/index.html");
        await browser.assert.exists("h1");
        await browser.assert.exists(".container");
    });

    it("Exists Throws", async () => {
        await browser.open("http://localhost:3456/index.html");
        await utils.assertThrowsAsync(async () => {
            await browser.assert.exists("h2");
        });
        await utils.assertThrowsAsync(async () => {
            await browser.assert.exists(".not_container");
        });
    });

    it("Text", async () => {
        await browser.open("http://localhost:3456/index.html");
        await browser.assert.text("h1", "Main Title");
    });
    it("Multiple Texts", async () => {
        await browser.open("http://localhost:3456/index.html");
        await browser.assert.text("p", "My first paragraph");
        await browser.assert.text("p", "My second paragraph");
    });

    it("Text Throws", async () => {
        await browser.open("http://localhost:3456/index.html");
        await utils.assertThrowsAsync(async () => {
            await browser.assert.text("h1", "My first paragraph");
        });
        await utils.assertThrowsAsync(async () => {
            await browser.assert.text("h2", "My first paragraph");
        });
        await utils.assertThrowsAsync(async () => {
            await browser.assert.text(".container p", "My seconds paragraph");
        });
    });

    it("Is Visible", async() => {
        await browser.open("http://localhost:3456/index.html");
        await browser.assert.visible("h1");
        await browser.assert.visible(".container p");
        await browser.assert.visible("p");
    });

    it("Is Visible Throws", async() => {
        await browser.open("http://localhost:3456/index.html");
        await utils.assertThrowsAsync(async () => {
            await browser.assert.visible(".hidden-text");
        });
    });

    it("Is Visible Styled", async() => {
        await browser.open("http://localhost:3456/index.html");
        await utils.assertThrowsAsync(async () => {
            await browser.assert.visible(".hidden-text2");
        });
    });

    it("Is Visible When Element Not Exists", async() => {
        await browser.open("http://localhost:3456/index.html");
        await utils.assertThrowsAsync(async () => {
            await browser.assert.visible(".not-exists");
        });
    });

});

"use strict";

const Wendigo = require('../..');
const utils = require('../test_utils');
const configUrls = require('../config.json').urls;

describe("Assert Text", function() {
    this.timeout(5000);
    let browser;

    before(async() => {
        browser = await Wendigo.createBrowser();
    });

    beforeEach(async() => {
        await browser.open(configUrls.index);
    });

    after(async() => {
        await browser.close();
    });

    it("Text", async() => {
        await browser.assert.text("h1", "Main Title");
    });

    it("Text From Node", async() => {
        const node = await browser.query("h1");
        await browser.assert.text(node, "Main Title");
    });

    it("Text From Xpath", async() => {
        await browser.assert.text("//h1", "Main Title");
    });

    it("Multiple Texts", async() => {
        await browser.assert.text("p", "My first paragraph");
        await browser.assert.text("p", "My second paragraph");
    });

    it("Text Regex", async() => {
        await browser.assert.text("h1", /Main\sTitle/);
    });

    it("Text Throws", async() => {
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.text("h1", "My first paragraph");
        }, `[assert.text] Expected element "h1" to have text "My first paragraph", "Main Title" found.`);
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.text("h2", "My first paragraph");
        }, `[assert.text] Expected element "h2" to have text "My first paragraph", no text found.`);
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.text(".container p", "My second paragraph");
        }, `[assert.text] Expected element ".container p" to have text "My second paragraph", "My first paragraph" found.`);
    });

    it("Text Regex Throws", async() => {
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.text("h1", /My\sfirst\sparagraph/);
        }, `[assert.text] Expected element "h1" to have text "/My\\sfirst\\sparagraph/", "Main Title" found.`);
    });

    it("Multiple Text Throws", async() => {
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.text("p", "My paragraph");
        }, `[assert.text] Expected element "p" to have text "My paragraph", "My first paragraph My second paragraph" found.`);
    });

    it("Text Throws With Custom Message", async() => {
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.text("h1", "My first paragraph", "text failed");
        }, `[assert.text] text failed`);
    });

    it("Text Without Expected Parameter Throws", async() => {
        await utils.assertThrowsAsync(async() => {
            await browser.assert.text("h1");
        }, `Error: [assert.text] Missing expected text for assertion.`);
    });

    it("Not Text Without Expected Parameter Throws", async() => {
        await utils.assertThrowsAsync(async() => {
            await browser.assert.not.text("h1");
        }, `Error: [assert.not.text] Missing expected text for assertion.`);
    });

    it("Not Text", async() => {
        await browser.assert.not.text("h1", "Not Main Title");
    });

    it("Not Text Not Exists", async() => {
        await browser.assert.not.text("h2", "Not Main Title");
    });

    it("Not Multiple Texts", async() => {
        await browser.assert.not.text("p", "not a paragraph");
    });

    it("Not Multiple Texts Throws", async() => {
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.not.text("p", "My first paragraph");
        }, `[assert.not.text] Expected element "p" not to have text "My first paragraph".`);
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.not.text("p", "My second paragraph");
        }, `[assert.not.text] Expected element "p" not to have text "My second paragraph".`);
    });

    it("Not Text Throws With Custom Message", async() => {
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.not.text("p", "My first paragraph", "not text failed");
        }, `[assert.not.text] not text failed`);
    });

    it("Multiple Texts in Array", async() => {
        await browser.assert.text("p", ["My first paragraph", "My second paragraph"]);
        await browser.assert.text("p", ["My first paragraph"]);
    });

    it("Multiple Texts in Array With Regex", async() => {
        await browser.assert.text("p", ["My first paragraph", /My\ssecond\sparagraph/]);
        await browser.assert.text("p", ["My first paragraph"]);
    });

    it("Multiple Texts in Array Throws", async() => {
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.text("p", ["My first paragraph", "My paragraph"]);
        }, `[assert.text] Expected element "p" to have text "My paragraph", "My first paragraph My second paragraph" found.`);
    });

    it("Not Multiple Texts in Array", async() => {
        await browser.assert.not.text("p", ["not a correct text", "another incorrect text"]);
    });

    it("Not Multiple Texts in Array Throws", async() => {
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.not.text("p", ["My first paragraph", "not a correct text"]);
        }, `[assert.not.text] Expected element "p" not to have text "My first paragraph".`);
    });

    it("Text With Empty Parameter Array Throws", async() => {
        await utils.assertThrowsAsync(async() => {
            await browser.assert.text("h1", []);
        }, `Error: [assert.text] Missing expected text for assertion.`);
    });

    it("Not Text With Empty Parameter Array Throws", async() => {
        await utils.assertThrowsAsync(async() => {
            await browser.assert.not.text("h1", []);
        }, `Error: [assert.not.text] Missing expected text for assertion.`);
    });

    it("Text Throws With DOM Object Selector", async() => {
        const element = await browser.query("h1");
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.text(element, "My first paragraph");
        }, `[assert.text] Expected element "h1" to have text "My first paragraph", "Main Title" found.`);
    });

    it("Assert Empty Text", async() => {
        await browser.open(configUrls.emptyText);
        await browser.assert.text(".empty-p", "");
    });

    it("Assert Empty Text Throws", async() => {
        await browser.open(configUrls.emptyText);
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.text("h1", "");
        }, `[assert.text] Expected element "h1" to have text "", "Main Title" found.`);
    });

    it("Assert Not Empty Text", async() => {
        await browser.open(configUrls.emptyText);
        await browser.assert.not.text("h1", "");
    });

    it("Assert Not Empty Text Throws", async() => {
        await browser.open(configUrls.emptyText);
        await utils.assertThrowsAssertionAsync(async() => {
            await browser.assert.not.text(".empty-p", "");
        }, `[assert.not.text] Expected element ".empty-p" not to have text "".`);
    });

    it("Button Text", async() => {
        await browser.open(configUrls.click);
        await browser.assert.text(".btn", "click me");
    });

    it("Text With <br>", async() => {
        await browser.open(configUrls.weirdText);
        await browser.assert.text(".text-br", "This is\na text");
    });
});

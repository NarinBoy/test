/**
 * Tests for index.html
 *
 * Uses Jest with jest-environment-jsdom to parse and query the static HTML
 * exactly as a browser would, without spinning up a real browser process.
 */

const fs = require("fs");
const path = require("path");

// Load the HTML file once before all tests.
beforeAll(() => {
  const html = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf8");
  document.documentElement.innerHTML = html;
});

describe("index.html", () => {
  describe("page title", () => {
    test('has the title "Document"', () => {
      // jsdom reflects <title> in document.title.
      expect(document.title).toBe("Document");
    });
  });

  describe('div with class "1"', () => {
    test("the div element exists in the document", () => {
      const div = document.querySelector("div.\\31 ");
      // CSS escaping: class names that start with a digit require \31 (code point for '1').
      // As a fallback we also check via getElementsByClassName.
      const divByClass = document.getElementsByClassName("1")[0];
      expect(divByClass).not.toBeUndefined();
      expect(divByClass).not.toBeNull();
    });

    test('the div contains the text "Hello, World!"', () => {
      const div = document.getElementsByClassName("1")[0];
      expect(div.textContent.trim()).toBe("Hello, World!");
    });
  });
});

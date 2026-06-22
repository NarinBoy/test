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

  describe("toggleGreeting()", () => {
    // Re-read the HTML and inject the script before each test so that
    // toggleGreeting() is defined and the #greeting element is in its
    // initial state (display: none).
    beforeEach(() => {
      const fs = require("fs");
      const path = require("path");
      const html = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf8"
      );
      document.documentElement.innerHTML = html;

      // jsdom does not execute inline <script> tags automatically when
      // innerHTML is set, so we extract the function and attach it to global
      // so that tests can call global.toggleGreeting().
      const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];
      // Wrap in an IIFE that receives global and assigns properties onto it.
      const installer = new Function("g", scriptContent + "\ng.toggleGreeting = toggleGreeting;");
      installer(global);
    });

    test('the "Toggle Greeting" button exists in the document', () => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const toggleBtn = buttons.find((b) => b.textContent.trim() === "Toggle Greeting");
      expect(toggleBtn).not.toBeUndefined();
      expect(toggleBtn).not.toBeNull();
    });

    test("the #greeting element is hidden by default (display: none)", () => {
      const greeting = document.getElementById("greeting");
      expect(greeting).not.toBeNull();
      expect(greeting.style.display).toBe("none");
    });

    test("after calling toggleGreeting() once, #greeting becomes visible (display: block)", () => {
      global.toggleGreeting();
      const greeting = document.getElementById("greeting");
      expect(greeting.style.display).toBe("block");
    });

    test("after calling toggleGreeting() twice, #greeting is hidden again (display: none)", () => {
      global.toggleGreeting();
      global.toggleGreeting();
      const greeting = document.getElementById("greeting");
      expect(greeting.style.display).toBe("none");
    });
  });
});

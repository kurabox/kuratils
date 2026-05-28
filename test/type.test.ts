import { assert, assertFalse, assertEquals } from "@std/assert";
import { PageType } from "../src/types.ts";
import { isPageTypeValue } from "../src/funcs.ts";
import { generateV4UUID, Language, Page } from "../mod.ts";

Deno.test("DataType test", () => {
    const dataType = PageType.Web;
    assert(isPageTypeValue(dataType) === true);

    const randomValue: unknown = "somevalue";
    assertFalse(isPageTypeValue(randomValue));
});

Deno.test("Page type test", (): void => {
    const testPage: Page = new Page(
        generateV4UUID(),
        "https://example.com",
        "Valid title",
        new Date(),
        PageType.Web,
        new URL("https://example.com").hostname,
        new Date(),
        new Date(),
        Language.English,
        "This is Page content",
    );
    assert(testPage.validate());

    testPage.logData();

    // invalid uuid
    const testPage2: Page = new Page(
        "dddf", // v4 uuid không hợp lệ
        "https://example.com",
        "Valid title",
        new Date(),
        PageType.Web,
        new URL("https://example.com").hostname,
        new Date(),
        new Date(),
        Language.English,
        "This is Page content",
    );
    assertFalse(testPage2.validate());

    // invalid url
    const testPage3: Page = new Page(
        generateV4UUID(),
        "httpsexample",
        "Valid title",
        new Date(),
        PageType.Web,
        new URL("https://example.com").hostname,
        new Date(),
        new Date(),
        Language.English,
        "This is Page content",
    );
    assertFalse(testPage3.validate());

    // Invalid title
    const testPage4: Page = new Page(
        generateV4UUID(),
        "https://example.com",
        "",
        new Date(),
        PageType.Web,
        new URL("https://example.com").hostname,
        new Date(),
        new Date(),
        Language.English,
        "This is Page content",
    );
    assertFalse(testPage4.validate());

    // invalid page source
    const testPage5: Page = new Page(
        generateV4UUID(),
        "https://example.com",
        "Valid title",
        new Date(),
        PageType.Web,
        "",
        new Date(),
        new Date(),
        Language.English,
        "This is Page content",
    );
    assertFalse(testPage5.validate());

    // Invalid language
    const testPage6: Page = new Page(
        generateV4UUID(),
        "https://example.com",
        "Valid title",
        new Date(),
        PageType.Web,
        "",
        new Date(),
        new Date(),
        "" as Language, // Ép sai kiểu để test
        "This is Page content",
    );
    assertFalse(testPage6.validate());

    // invalid page content
    const testPage7: Page = new Page(
        generateV4UUID(),
        "https://example.com",
        "Valid title",
        new Date(),
        PageType.Web,
        new URL("https://example.com").hostname,
        new Date(),
        new Date(),
        Language.English,
        "",
    );
    assertFalse(testPage7.validate());
});
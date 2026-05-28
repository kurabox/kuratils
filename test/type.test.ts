import { assert, assertFalse } from "@std/assert";
import { PageType } from "../src/types.ts";
import { isPageTypeValue } from "../src/funcs.ts";
import { generateV4UUID, Image, Language, Page } from "../mod.ts";

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

Deno.test("Image type test", (): void => {
    const testImage1: Image = new Image(generateV4UUID(), "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2024/08/updated-by-umair-malik-on-june-12-2024-with-new-cards-introduced-every-month-the-meta-is-constantly-evolving-and-new-cards-find-their-way-into-multiple-decks-especially-these-ones-we-v-2024-08-22t175017-108.jpg", "image alt text", generateV4UUID());
    assert(testImage1.validate());
    testImage1.logData();

    // Invalid id
    const testImage2: Image = new Image("invalid id", "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2024/08/updated-by-umair-malik-on-june-12-2024-with-new-cards-introduced-every-month-the-meta-is-constantly-evolving-and-new-cards-find-their-way-into-multiple-decks-especially-these-ones-we-v-2024-08-22t175017-108.jpg", "image alt text", generateV4UUID());
    assertFalse(testImage2.validate());

    // invalid image src
    const testImage3: Image = new Image(generateV4UUID(), "klax", "image alt text", generateV4UUID());
    assertFalse(testImage3.validate());

    // invalid altText
    const testImage4: Image = new Image(generateV4UUID(), "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2024/08/updated-by-umair-malik-on-june-12-2024-with-new-cards-introduced-every-month-the-meta-is-constantly-evolving-and-new-cards-find-their-way-into-multiple-decks-especially-these-ones-we-v-2024-08-22t175017-108.jpg", "1", generateV4UUID());
    assertFalse(testImage4.validate());

    // invalid pageId
    const testImage5: Image = new Image(generateV4UUID(), "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2024/08/updated-by-umair-malik-on-june-12-2024-with-new-cards-introduced-every-month-the-meta-is-constantly-evolving-and-new-cards-find-their-way-into-multiple-decks-especially-these-ones-we-v-2024-08-22t175017-108.jpg", "1", "invalid uuid");
    assertFalse(testImage5.validate());
});
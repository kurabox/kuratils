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
        null,
        PageType.Web,
        new URL("https://example.com").hostname,
        Date.now(),
        Date.now(),
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
        Date.now(),
        PageType.Web,
        new URL("https://example.com").hostname,
        Date.now(),
        Date.now(),
        Language.English,
        "This is Page content",
    );
    assertFalse(testPage2.validate());

    // invalid url
    const testPage3: Page = new Page(
        generateV4UUID(),
        "httpsexample",
        "Valid title",
        Date.now(),
        PageType.Web,
        new URL("https://example.com").hostname,
        Date.now(),
        Date.now(),
        Language.English,
        "This is Page content",
    );
    assertFalse(testPage3.validate());

    // Invalid title
    const testPage4: Page = new Page(
        generateV4UUID(),
        "https://example.com",
        "",
        Date.now(),
        PageType.Web,
        new URL("https://example.com").hostname,
        Date.now(),
        Date.now(),
        Language.English,
        "This is Page content",
    );
    assertFalse(testPage4.validate());

    // invalid page source
    const testPage5: Page = new Page(
        generateV4UUID(),
        "https://example.com",
        "Valid title",
        Date.now(),
        PageType.Web,
        "",
        Date.now(),
        Date.now(),
        Language.English,
        "This is Page content",
    );
    assertFalse(testPage5.validate());

    // Invalid language
    const testPage6: Page = new Page(
        generateV4UUID(),
        "https://example.com",
        "Valid title",
        Date.now(),
        PageType.Web,
        "",
        Date.now(),
        Date.now(),
        "" as Language, // Ép sai kiểu để test
        "This is Page content",
    );
    assertFalse(testPage6.validate());

    // invalid page content
    const testPage7: Page = new Page(
        generateV4UUID(),
        "https://example.com",
        "Valid title",
        Date.now(),
        PageType.Web,
        new URL("https://example.com").hostname,
        Date.now(),
        Date.now(),
        Language.English,
        "",
    );
    assertFalse(testPage7.validate());

    // Invalid puslish timestamp
    let testPage8: Page = testPage;
    testPage8.puslishTimestamp = 0;
    assertFalse(testPage8.validate());

    // Invalid created timestamp
    testPage8 = testPage;
    testPage8.createdTimestamp = 0;
    assertFalse(testPage8.validate());

    // Invalid update timestamp
    testPage8 = testPage;
    testPage8.updateTimestamp = 0;
    assertFalse(testPage8.validate());
});

Deno.test("Image type test", (): void => {
    const testImage1: Image = new Image(generateV4UUID(), "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2024/08/updated-by-umair-malik-on-june-12-2024-with-new-cards-introduced-every-month-the-meta-is-constantly-evolving-and-new-cards-find-their-way-into-multiple-decks-especially-these-ones-we-v-2024-08-22t175017-108.jpg", "image alt text", generateV4UUID(), Date.now());
    assert(testImage1.validate());
    testImage1.logData();

    // Invalid id
    const testImage2: Image = new Image("invalid id", "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2024/08/updated-by-umair-malik-on-june-12-2024-with-new-cards-introduced-every-month-the-meta-is-constantly-evolving-and-new-cards-find-their-way-into-multiple-decks-especially-these-ones-we-v-2024-08-22t175017-108.jpg", "image alt text", generateV4UUID(), Date.now());
    assertFalse(testImage2.validate());

    // invalid image src
    const testImage3: Image = new Image(generateV4UUID(), "klax", "image alt text", generateV4UUID(), Date.now());
    assertFalse(testImage3.validate());

    // invalid altText
    const testImage4: Image = new Image(generateV4UUID(), "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2024/08/updated-by-umair-malik-on-june-12-2024-with-new-cards-introduced-every-month-the-meta-is-constantly-evolving-and-new-cards-find-their-way-into-multiple-decks-especially-these-ones-we-v-2024-08-22t175017-108.jpg", "1", generateV4UUID(), Date.now());
    assertFalse(testImage4.validate());

    // invalid pageId
    const testImage5: Image = new Image(generateV4UUID(), "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2024/08/updated-by-umair-malik-on-june-12-2024-with-new-cards-introduced-every-month-the-meta-is-constantly-evolving-and-new-cards-find-their-way-into-multiple-decks-especially-these-ones-we-v-2024-08-22t175017-108.jpg", "1", "invalid uuid", Date.now());
    assertFalse(testImage5.validate());

    // invalid created timestamp
    const testImage9: Image = testImage1;
    testImage9.createdTimestamp = -2.9;
    assertFalse(testImage9.validate());
});
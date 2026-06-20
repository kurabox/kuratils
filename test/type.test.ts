import { assert, assertFalse } from "@std/assert";
import { PageType } from "../src/data-types.ts";
import { isPageTypeValue, logPage, validatePage } from "../src/funcs.ts";
import { generateV4UUID, Image, Language, logImage, Page, validateImage } from "../mod.ts";

Deno.test("DataType test", () => {
    const dataType = PageType.Web;
    assert(isPageTypeValue(dataType) === true);

    const randomValue: unknown = "somevalue";
    assertFalse(isPageTypeValue(randomValue));
});

Deno.test("Page type test", (): void => {
    const validPage: Page = {
        id: generateV4UUID(),
        url: "https://example.com",
        title: "Page title",
        puslishTimestamp: Date.now(),
        type: PageType.Web,
        source: "example.com",
        createdTimestamp: Date.now(),
        updateTimestamp: Date.now(),
        language: Language.Vietnamese,
        content: "This is page content.",
    };
    assert(validatePage(validPage));
    logPage(validPage);

    // Invalid title
    let invalidPage: Page = validPage;
    invalidPage.id = "invalid id";
    assertFalse(validatePage(invalidPage));

    // Invalid url
    invalidPage = validPage;
    invalidPage.url = "invalid url";
    assertFalse(validatePage(invalidPage));

    // Invalid title
    invalidPage = validPage;
    invalidPage.title = "$$";
    assertFalse(validatePage(invalidPage));

    // Invalid puslish timestamp
    invalidPage = validPage;
    invalidPage.puslishTimestamp = 0;
    assertFalse(validatePage(invalidPage));

    // Invalid page type
    invalidPage = validPage;
    invalidPage.type = "invalid page type" as PageType;
    assertFalse(validatePage(invalidPage));

    // invalid source
    invalidPage = validPage;
    invalidPage.source = "";
    assertFalse(validatePage(invalidPage));

    // invalid language
    invalidPage = validPage;
    invalidPage.language = "unsupported" as Language;
    assertFalse(validatePage(invalidPage));

    // Invaid content
    invalidPage = validPage;
    invalidPage.content = "#";
    assertFalse(validatePage(invalidPage));
});

Deno.test("Image type test", (): void => {
    const validImage: Image = {
        id: generateV4UUID(),
        src: "https://example.com/img01.png",
        altText: "this is fish",
        pageId: generateV4UUID(),
        createdTimestamp: Date.now(),
    };
    assert(validateImage(validImage));
    logImage(validImage);

    // invalid id
    let invalidImage: Image = validImage;
    invalidImage.id = "invalid id";
    assertFalse(validateImage(invalidImage));

    // invalid src
    invalidImage = validImage;
    invalidImage.src = "invalid source";
    assertFalse(validateImage(invalidImage));

    // invalid alt text
    invalidImage = validImage;
    invalidImage.altText = "@@@";
    assertFalse(validateImage(invalidImage));

    // invalid page id
    invalidImage = validImage;
    invalidImage.pageId = "invalid page id";
    assertFalse(validateImage(invalidImage));

    // invalid created timestamp
    invalidImage = validImage;
    invalidImage.createdTimestamp = -233;
    assertFalse(validateImage(invalidImage));
});
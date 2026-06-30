import { assert, assertFalse } from "@std/assert";
import { PageType, PageData, ImageData, Language } from "../src/data-types.ts";
import {
    isPageTypeValue,
    logPageData,
    logImageData,
    validatePageData,
    validateImageData,
    generateV4UUID,
} from "../src/funcs.ts";

Deno.test("DataType test", () => {
    const dataType = PageType.Web;
    assert(isPageTypeValue(dataType) === true);

    const randomValue: unknown = "somevalue";
    assertFalse(isPageTypeValue(randomValue));
});

Deno.test("Page type test", (): void => {
    const validPage: PageData = {
        id: generateV4UUID(),
        url: "https://example.com",
        title: "Page title",
        publishTimestamp: Date.now(),
        type: PageType.Web,
        source: "example.com",
        createdTimestamp: Date.now(),
        updateTimestamp: Date.now(),
        language: Language.Vietnamese,
        content: "This is page content.",
    };
    assert(validatePageData(validPage));
    logPageData(validPage);

    // Invalid title
    let invalidPage: PageData = validPage;
    invalidPage.id = "invalid id";
    assertFalse(validatePageData(invalidPage));

    // Invalid url
    invalidPage = validPage;
    invalidPage.url = "invalid url";
    assertFalse(validatePageData(invalidPage));

    // Invalid title
    invalidPage = validPage;
    invalidPage.title = "$$";
    assertFalse(validatePageData(invalidPage));

    // Invalid puslish timestamp
    invalidPage = validPage;
    invalidPage.publishTimestamp = 0;
    assertFalse(validatePageData(invalidPage));

    // Invalid page type
    invalidPage = validPage;
    invalidPage.type = "invalid page type" as PageType;
    assertFalse(validatePageData(invalidPage));

    // invalid source
    invalidPage = validPage;
    invalidPage.source = "";
    assertFalse(validatePageData(invalidPage));

    // invalid language
    invalidPage = validPage;
    invalidPage.language = "unsupported" as Language;
    assertFalse(validatePageData(invalidPage));

    // Invaid content
    invalidPage = validPage;
    invalidPage.content = "#";
    assertFalse(validatePageData(invalidPage));
});

Deno.test("Image type test", (): void => {
    const validImage: ImageData = {
        id: generateV4UUID(),
        src: "https://example.com/img01.png",
        altText: "this is fish",
        pageId: generateV4UUID(),
        createdTimestamp: Date.now(),
    };
    assert(validateImageData(validImage));
    logImageData(validImage);

    // invalid id
    let invalidImage: ImageData = validImage;
    invalidImage.id = "invalid id";
    assertFalse(validateImageData(invalidImage));

    // invalid src
    invalidImage = validImage;
    invalidImage.src = "invalid source";
    assertFalse(validateImageData(invalidImage));

    // invalid alt text
    invalidImage = validImage;
    invalidImage.altText = "@@@";
    assertFalse(validateImageData(invalidImage));

    // invalid page id
    invalidImage = validImage;
    invalidImage.pageId = "invalid page id";
    assertFalse(validateImageData(invalidImage));

    // invalid created timestamp
    invalidImage = validImage;
    invalidImage.createdTimestamp = -233;
    assertFalse(validateImageData(invalidImage));
});
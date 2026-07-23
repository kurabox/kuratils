import { assert, assertFalse } from "@std/assert";
import { PageType, PageData, Language } from "../src/data-types.ts";
import {
    isPageTypeValue,
    logPageData,
    validatePageData,
    generateV4UUID,
    generateSHA256Hash,
} from "../src/funcs.ts";
import { HtmlContent, HtmlHash, Image, Page, PageMeta, PageStatus } from "../src/maria-entities.ts";

Deno.test("DataType test", () => {
    const dataType = PageType.Web;
    assert(isPageTypeValue(dataType) === true);

    const randomValue: unknown = "somevalue";
    assertFalse(isPageTypeValue(randomValue));
});

Deno.test("Page type test", async (): Promise<void> => {
    const validPage: Page = new Page(generateV4UUID(), "https://a.com");
    const validStatus: PageStatus = new PageStatus(generateV4UUID(), generateV4UUID(), 123n, 456n);
    const validMeta: PageMeta = new PageMeta(
        generateV4UUID(),
        generateV4UUID(),
        "Valid Title",
        123n,
        PageType.Web,
        "a.com",
        Language.English
    );
    const validHtml: HtmlContent = new HtmlContent(generateV4UUID(), generateV4UUID(), "<p>Hello</p>");
    const validHtmlHash: HtmlHash = new HtmlHash(generateV4UUID(), generateV4UUID(), await generateSHA256Hash("<p>Hello</p>"));
    const validImage: Image = new Image(
        generateV4UUID(),
        generateV4UUID(),
        "https://a.com/image.png",
        "Alt text",
        "a.com"
    );

    const pageData: PageData = {
        page: validPage,
        status: validStatus,
        meta: validMeta,
        htmlContent: validHtml,
        htmlHash: validHtmlHash,
        images: [validImage, validImage]
    };
    assert(validatePageData(pageData));
    logPageData(pageData);

    const invalidImage: Image = new Image(
        "bad-id",
        "bad-id",
        "invalid-url",
        "x",
        "invalid-source"
    );
    pageData.images!.push(invalidImage);
    assertFalse(validatePageData(pageData));
});
import { assert, assertEquals, assertFalse } from "@std/assert";
import { generateV4UUID } from "../src/funcs.ts";
import { PageType } from "../src/data-types.ts";
import {
    Page,
    PageStatus,
    PageMeta,
    HtmlContent,
    Image,
    HtmlHash,
} from "../src/maria-entities.ts";
import { pageSchema } from "../src/maria-schema.ts";
import { buildInsertValuesString, generateSHA256Hash, Language } from "../mod.ts";

Deno.test("Page entity validation", () => {
    const validPage = new Page(generateV4UUID(), "https://a.com");
    assertEquals(validPage.validate(), true);

    const invalidPage = new Page("not-uuid", "invalid-url");
    assertEquals(invalidPage.validate(), false);
});

Deno.test("PageStatus entity validation", () => {
    const validStatus = new PageStatus(generateV4UUID(), generateV4UUID(), 123n, 456n);
    assertEquals(validStatus.validate(), true);

    const invalidStatus = new PageStatus("bad-id", "bad-id", -1n, 0n);
    assertEquals(invalidStatus.validate(), false);
});

Deno.test("PageMeta entity validation", () => {
    const validMeta = new PageMeta(
        generateV4UUID(),
        generateV4UUID(),
        "Valid Title",
        123n,
        PageType.Web,
        "a.com",
        Language.English
    );
    assertEquals(validMeta.validate(), true);
    validMeta.publicationTimestamp = null;
    assertEquals(validMeta.validate(), true);

    const invalidMeta = new PageMeta(
        "bad-id",
        "bad-id",
        "x",
        -1n,
        "wrong-type" as PageType,
        "invalid-source",
        Language.English
    );
    assertEquals(invalidMeta.validate(), false);
});

Deno.test("HtmlContent entity validation", () => {
    const validHtml = new HtmlContent(generateV4UUID(), generateV4UUID(), "<p>Hello</p>");
    assertEquals(validHtml.validate(), true);

    const invalidHtml = new HtmlContent("bad-id", "bad-id", "not-html");
    assertEquals(invalidHtml.validate(), false);
});

Deno.test("Image entity validation", () => {
    const validImage = new Image(
        generateV4UUID(),
        generateV4UUID(),
        "https://a.com/image.png",
        "Alt text",
        "a.com"
    );
    // ⚠️ nhớ sửa bug trong Image.validate() để return true khi hợp lệ
    assertEquals(validImage.validate(), true);

    const invalidImage = new Image(
        "bad-id",
        "bad-id",
        "invalid-url",
        "x",
        "invalid-source"
    );
    assertEquals(invalidImage.validate(), false);
});

Deno.test("build query values string from entities class test", (): void => {
    function generatePageEntities(quantity: number): Page[] {
        const pages: Page[] = [];
        if (quantity <= 0) return pages;
        for (let i: number = 0; i <= quantity; i++) {
            pages.push(new Page(
                generateV4UUID(),
                "https://www.example.com",
            ));
        }
        return pages;
    }

    const pages: Page[] = generatePageEntities(10);
    const pageValuesStr: string | null = buildInsertValuesString(pages, pageSchema);
    assert(pageValuesStr !== null);
    console.log(pageValuesStr);
});

Deno.test("HtmlHash entity test", async (): Promise<void> => {
    const htmlHash: HtmlHash = new HtmlHash(generateV4UUID(), generateV4UUID(), await generateSHA256Hash("<h1>Hello Hash content</h1>"));
    assert(htmlHash.validate());

    // invalid id
    const invalidHtmlHash1 = new HtmlHash(generateV4UUID(), generateV4UUID(), await generateSHA256Hash("<h1>Hello Hash content</h1>"));
    invalidHtmlHash1.id = "randomid";
    assertFalse(invalidHtmlHash1.validate());

    // invalid pageid
    const invalidHtmlHash2 = new HtmlHash(generateV4UUID(), generateV4UUID(), await generateSHA256Hash("<h1>Hello Hash content</h1>"));
    invalidHtmlHash2.pageId = "randomid";
    assertFalse(invalidHtmlHash1.validate());

    // invalid hash content
    const invalidHtmlHash3 = new HtmlHash(generateV4UUID(), generateV4UUID(), await generateSHA256Hash("<h1>Hello Hash content</h1>"));
    invalidHtmlHash3.hash = "randomhash";
    assertFalse(invalidHtmlHash3.validate());
});
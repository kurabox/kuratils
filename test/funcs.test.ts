import { assertEquals, assertFalse } from "@std/assert";
import { isCrawlStatusValue, isValidStringWithMinLen, validateHTMLString } from "../src/funcs.ts";
import { Language } from "../src/types.ts";
import { CrawlStatus } from "../src/types.ts";
import { assert } from "node:console";

Deno.test("isValidStringWithMinLen() test", (): void => {
    // Latin
    assertEquals(isValidStringWithMinLen("Naruto trở lại", 5), true);
    assertEquals(isValidStringWithMinLen("AI", 5), false);
    assertEquals(isValidStringWithMinLen("AI", 2), true);

    // Chỉ khoảng trắng
    assertEquals(isValidStringWithMinLen("     ", 2), false);

    // Chỉ ký tự đặc biệt
    assertEquals(isValidStringWithMinLen("!!!???", 2), false);

    // Kết hợp chữ và ký tự đặc biệt
    assertEquals(isValidStringWithMinLen("Anime!!!", 5), true);

    // Chuỗi rỗng
    assertEquals(isValidStringWithMinLen("", 2), false);

    // Nhật
    assertEquals(isValidStringWithMinLen("ナルト", 2), true);

    // Trung
    assertEquals(isValidStringWithMinLen("火影忍者", 2), true);

    // Hàn
    assertEquals(isValidStringWithMinLen("나루토", 2), true);

    // Ả Rập
    assertEquals(isValidStringWithMinLen("مرحبا", 2), true);

    // Thái
    assertEquals(isValidStringWithMinLen("สวัสดี", 2), true);

    // Emoji (không phải chữ/số)
    assertEquals(isValidStringWithMinLen("😊😊", 2), false);
});

Deno.test("enum test", (): void => {
    const language: Language = Language.Unsupported;
    assertEquals(typeof language, typeof language);
});

Deno.test("validateHTMLString function test", () => {
    // Html hợp lệ
    const validHtmlStr: string = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>Sample Video Page</title>
        </head>
        <body>
            <h1>Anime News Video</h1>
            <p>Đây là một đoạn mô tả ngắn về video.</p>
            <video src="sample.mp4" controls width="640" height="360">
            Trình duyệt của bạn không hỗ trợ video.
            </video>
        </body>
        </html>
    `;
    assertEquals(validateHTMLString(validHtmlStr), true);

    // không có nội dung nào trong thẻ body
    const htmlStringWithNoBodyContent: string = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>Empty Body Example</title>
        </head>
        <body>
        </body>
        </html>
    `;
    assertEquals(validateHTMLString(htmlStringWithNoBodyContent), false);

    // Không có thẻ body
    const htmlStrWithNoBodyTag: string = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>Empty Body Example</title>
        </head>
        </html>
    `;
    assertFalse(validateHTMLString(htmlStrWithNoBodyTag));
});

Deno.test("isCrawlStatusValue function test", (): void => {
    const validCrawlStatus: CrawlStatus = CrawlStatus.Crawled;
    assert(isCrawlStatusValue(validCrawlStatus) === true);

    const numValue = 23;
    assertFalse(isCrawlStatusValue(numValue));

    const strValue = "some string";
    assertFalse(isCrawlStatusValue(strValue));
});
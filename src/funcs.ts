import * as cheerio from "cheerio";
import { eld } from "eld/large";
import { Language, PageType, CrawlStatus, PageData, ImageData } from "./data-types.ts";
import { v4 } from "@std/uuid";

// Hàm log 
export function msgLog(msg: string): string {
    const log: string = `[${new Date().toString().split(" (")[0]}] ${msg}`;
    console.log(log);
    return log; // Trả ra log string sao khi đã xuất ra console
}

// Kiểm tra tính hợp lệ của url
export function validateUrl(urlStr: string): boolean {
    try {
        new URL(urlStr);
        return true;
    } catch {
        return false;   // Trường hợp url không hợp lệ
    }
}

// Hàm khởi tạo v4 uuid
export function generateV4UUID(): string {
    return crypto.randomUUID();
}

// Kiểm tra xem liệu một string chỉ chứa toàn ký tự đặc biệt hay không
export function isValidStringWithMinLen(str: string, minLen: number): boolean {
    const normalized: string = str.replace(/\s/g, "");
    return (normalized.length >= minLen && !/^[^\p{L}\p{N}]+$/u.test(normalized));
}

// Kiểm tra một html có hợp lệ không
export function validateHtmlString(html: string): boolean {
    const $: cheerio.CheerioAPI = cheerio.load(html);
    const hasBodyTag: boolean = $("body").length > 0;   // Kiểm tra thẻ <body>
    const hasContent: boolean = $("body").text().trim().length > 0; // Kiểm tra thẻ nội dung
    return hasBodyTag && hasContent;
}

// Hàm nhận diện ngôn ngữ từ string có sẵn
export function detectLanguage(str: string): Language {
    const lang: string = eld.detect(str).language;  // lang string đã được eld nhận diện
    return (Object.values(Language).includes(lang as Language)) ? lang as Language : Language.Unsupported;
}

// Hàm kiểm tra xem biến bất kỳ có thuộc kiểu Language hay không
export function isLanguageValue(value: unknown): boolean {
    return Object.values(Language).includes(value as Language);
}

// Hàm kiểm tra xem biến bất kỳ có thuộc kiểu DataType hay không
export function isPageTypeValue(value: unknown): boolean {
    return Object.values(PageType).includes(value as PageType);
}

// Hàm kiểm tra xem biến bất kỳ có thuộc kiểu CrawlStatus hay không
export function isCrawlStatusValue(value: unknown): boolean {
    return Object.values(CrawlStatus).includes(value as CrawlStatus);
}

// Hàm kiểm tra tính hợp lệ của Page
export function validatePageData(page: PageData): boolean {
    if (!v4.validate(page.id)) return false;    // kiểm tra uuid
    if (!validateUrl(page.url)) return false;    // Kiểm tra url của page
    if (!isValidStringWithMinLen(page.title, 2)) return false;  // Kiểm tra title (cần tối thiểu 2 ký tự)
    if (page.publishTimestamp !== null && page.publishTimestamp <= 0) return false; // Kiểm tra thời gian xuất bản của page
    if (!isPageTypeValue(page.type)) return false;  // Kiểm tra kiểu của page
    if (page.source.length === 0) return false;   // source không được rỗng
    if (page.createdTimestamp <= 0) return false;   // Kiểm tra timestamp khởi tạo
    if (page.updateTimestamp <= 0) return false;    // Kiểm tra timestamp cập nhật (trong trường hợp page vừa được khởi tạo thì createdTimestamp = updateTimestamp)
    if (!isLanguageValue(page.language)) return false;  // Kiểm tra kiểu Language
    if (!isValidStringWithMinLen(page.content, 2)) return false;    // page content không được rỗng
    return true;    // xác nhận validate hợp lệ
}

// Hàm kiểm tra tính hợp lệ của Image
export function validateImageData(image: ImageData): boolean {
    if (!v4.validate(image.id)) return false;    // id không hợp lệ
    if (!validateUrl(image.src)) return false;    // src không hợp lệ
    if (!isValidStringWithMinLen(image.altText, 2)) return false;    // alt text của ảnh không hợp lệ
    if (!v4.validate(image.pageId)) return false;    // pageId không hợp lệ
    if (image.createdTimestamp <= 0) return false;   // Kiểm tra timestamp khởi tạo
    return true;    // Xác nhận ảnh hợp lệ
}

// Hàm log data cho Page
export function logPageData(page: PageData): void {
    console.log(`
    Page Data:
        id: ${page.id}
        url: ${page.url}
        title: ${page.title}
        publication timestamp: ${(page.publishTimestamp !== null) ? new Date(page.publishTimestamp).toDateString() : "No info"}
        type: ${page.type.toString()}
        source: ${page.source}
        created timestamp: ${new Date(page.createdTimestamp).toDateString()}
        update date: ${new Date(page.updateTimestamp).toDateString()}
        language: ${page.language}
        content:
            ${page.content}
    `);
}

export function logImageData(image: ImageData): void {
    console.log(`
    Image:
        id: ${image.id}
        src: ${image.src}
        alt text: ${image.altText}
        page id: ${image.pageId}
        created timestamp: ${new Date(image.createdTimestamp).toDateString()}
    `);
}
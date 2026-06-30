import * as cheerio from "cheerio";
import { eld } from "eld/large";
import { Language, PageType, CrawlStatus, PageData, ImageData } from "./data-types.ts";
import { v4 } from "@std/uuid";

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
    if (
        !v4.validate(page.id) ||    // kiểm tra uuid
        !validateUrl(page.url) ||   // Kiểm tra url của page
        !isValidStringWithMinLen(page.title, 2) ||  // Kiểm tra title (cần tối thiểu 2 ký tự)
        page.publishTimestamp !== null && page.publishTimestamp <= 0 || // Kiểm tra thời gian xuất bản của page
        !isPageTypeValue(page.type) ||  // Kiểm tra kiểu của page
        page.source.length === 0 || // source không được rỗng
        page.createdTimestamp <= 0 ||   // Kiểm tra timestamp khởi tạo
        page.updateTimestamp <= 0 ||    // // Kiểm tra timestamp cập nhật (trong trường hợp page vừa được khởi tạo thì createdTimestamp = updateTimestamp)
        !isLanguageValue(page.language) ||  // // Kiểm tra kiểu Language
        !isValidStringWithMinLen(page.content, 2)   // // page content không được rỗng
    ) {
        return false;
    } else {
        return true;    // xác nhận validate hợp lệ
    }
}

// Hàm kiểm tra tính hợp lệ của Image
export function validateImageData(image: ImageData): boolean {
    if (
        !v4.validate(image.id) ||   // id không hợp lệ
        !validateUrl(image.src) ||  // src không hợp lệ
        !isValidStringWithMinLen(image.altText, 2) ||   // alt text của ảnh không hợp lệ
        !v4.validate(image.pageId) ||   // pageId không hợp lệ
        image.createdTimestamp <= 0 // Kiểm tra timestamp khởi tạo
    ) {
        return false;
    } else {
        return true;    // Xác nhận ảnh hợp lệ
    }
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
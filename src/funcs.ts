import * as cheerio from "cheerio";
import { eld } from "eld/large";
import { Language, PageType, CrawlStatus } from "./types.ts";

export function msgLog(msg: string): void {
    console.log(`[${new Date().toString()}] ${msg}`);
}

// Kiểm tra tính hợp lệ của url
export function isValidUrl(urlStr: string): boolean {
    try {
        new URL(urlStr);
        return true;
    } catch (error) {
        const msg = `${error}`;
        msgLog(msg);
        return false;
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
export function validateHTMLString(html: string): boolean {
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
import * as cheerio from "cheerio";
import { eld } from "eld/large";
import { Language, PageType, CrawlStatus, PageData } from "./data-types.ts";
import { Image } from "./maria-entities.ts";
import { crypto } from "@std/crypto";

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
export function validatePageData(pageData: PageData): boolean {
    return (
        pageData.page.validate() &&
        pageData.status.validate() &&
        pageData.meta.validate() &&
        pageData.htmlContent.validate() &&
        pageData.htmlHash.validate() &&
        (pageData.images ?? []).filter((image: Image): boolean => !image.validate()).length === 0
    );
}

// Hàm log data cho Page
export function logPageData(pageData: PageData): void {
    console.log(`
    Page Data:
        id: ${pageData.page.id}
        url: ${pageData.page.url}
        title: ${pageData.meta.title}
        publication timestamp: ${(pageData.meta.publicationTimestamp !== null) ? new Date(Number(pageData.meta.publicationTimestamp)).toDateString() : "No info"}
        type: ${pageData.meta.pageType.toString()}
        source: ${pageData.meta.source}
        created timestamp: ${new Date(Number(pageData.status.createdTimestamp)).toDateString()}
        update date: ${new Date(Number(pageData.status.updateTimestamp)).toDateString()}
        language: ${pageData.meta.language}
        content hash: ${pageData.htmlHash.hash}
    `);
}

// Hàm khởi tạo hash định dạng SHA-256 từ một đoạn string bất kỳ
export async function generateSHA256Hash(content: string): Promise<string> {
    const encodedHash: Uint8Array<ArrayBuffer> = new TextEncoder().encode(content); // mã hoá string content đầu vào bằng TextEncoder từ crypto
    const hashData: ArrayBuffer = await crypto.subtle.digest("SHA-256", encodedHash);
    const hashDataArray: number[] = Array.from(new Uint8Array(hashData));
    return hashDataArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Hàm kiểm tra định dạng SHA-256 được chỉ định
export function validateSHA256Hash(hash: string): boolean {
    const sha256Regex: RegExp = /^[a-f0-9]{64}$/i;
    return sha256Regex.test(hash);
}
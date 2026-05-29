import { v4 } from "@std/uuid";
import { isValidStringWithMinLen, isValidUrl, isPageTypeValue, isLanguageValue } from "./funcs.ts";

// ngôn ngữ hỗ trợ
export enum Language {
    Japanese = "ja",
    Vietnamese = "vi",
    English = "en",
    Unsupported = "unsupported",
}

// Kiểu data của page
export enum PageType {
    Web = "web",
    News = "news",
    Image = "image",
    Video = "video",
    Product = "product",
}

// Trạng thái Crawl của một page
export enum CrawlStatus {
    Crawled,    // Đã crawl
    Processed,  // Đã xử lý (indexed)
    NeedToUpdate,   // Cần được cập nhật
}

// Interface dữ liệu thao tác database
export interface IData {
    id: string;
    validate(): boolean;
    logData(): void;
}

// Kiểu lưu trữ Page
export class Page implements IData {
    id: string; // Page id (string v4 uuid của Deno)
    url: string;    // url của page
    title: string;  // Tiêu đề page
    puslishTimestamp: number | null;  // Ngày đăng tải của page (nếu không có thì không phải là kiểu news)
    type: PageType; // Loại page (vd: web, product, video, v.v)
    source: string; // Nguồn của page (vd: www.google.com)
    createdTimestamp: number;    // Ngày được thêm vào
    updateTimestamp: number;   // Ngày được cập nhật
    language: Language;
    content: string;    // nội dung html của page

    constructor(id: string, url: string, title: string, puslishTimestamp: number | null, type: PageType, source: string, createdTimestamp: number, updateTimestamp: number, language: Language, content: string) {
        this.id = id;
        this.url = url;
        this.title = title;
        this.puslishTimestamp = puslishTimestamp;
        this.type = type;
        this.source = source;
        this.createdTimestamp = createdTimestamp;
        this.updateTimestamp = updateTimestamp;
        this.language = language;
        this.content = content;
    }

    // Kiểm tra tính hợp lệ
    validate(): boolean {
        if (!v4.validate(this.id)) return false;    // kiểm tra uuid
        if (!isValidUrl(this.url)) return false;    // Kiểm tra url của page
        if (!isValidStringWithMinLen(this.title, 2)) return false;  // Kiểm tra title (cần tối thiểu 2 ký tự)
        if (this.puslishTimestamp !== null && this.puslishTimestamp <= 0) return false; // Kiểm tra thời gian xuất bản của page
        if (!isPageTypeValue(this.type)) return false;  // Kiểm tra kiểu của page
        if (this.source.length === 0) return false;   // source không được rỗng
        if (this.createdTimestamp <= 0) return false;   // Kiểm tra timestamp khởi tạo
        if (this.updateTimestamp <= 0) return false;    // Kiểm tra timestamp cập nhật (trong trường hợp page vừa được khởi tạo thì createdTimestamp = updateTimestamp)
        if (!isLanguageValue(this.language)) return false;  // Kiểm tra kiểu Language
        if (this.content.length === 0) return false;    // page content không được rỗng
        return true;    // xác nhận validate hợp lệ
    }

    // Hiển thị kết quả
    logData(): void {
        console.log(`
        Page Data:
            id: ${this.id}
            url: ${this.url}
            title: ${this.title}
            publication timesstamp: ${(this.puslishTimestamp !== null) ? new Date(this.puslishTimestamp).toDateString() : "No info"}
            type: ${this.type.toString()}
            source: ${this.source}
            created timestamp: ${new Date(this.createdTimestamp).toDateString()}
            update date: ${new Date(this.updateTimestamp).toDateString()}
            language: ${this.language}
            content: ${this.content.slice(0, 100)}
        `);
    }
}

// Kiểu dữ liệu Image
export class Image implements IData {
    id: string;
    src: string;
    altText: string;
    pageId: string; // id của page chứa hình ảnh này
    createdTimestamp: number;   // Thời gian Image này được thêm (miliseconds)
    
    constructor(id: string, src: string, altText: string, pageId: string, createdTimestamp: number) {
        this.id = id;
        this.src = src;
        this.altText = altText;
        this.pageId = pageId;
        this.createdTimestamp = createdTimestamp;
    }

    validate(): boolean {
        if (!v4.validate(this.id)) return false;    // id không hợp lệ
        if (!isValidUrl(this.src)) return false;    // src không hợp lệ
        if (!isValidStringWithMinLen(this.altText, 2)) return false;    // alt text của ảnh không hợp lệ
        if (!v4.validate(this.pageId)) return false;    // pageId không hợp lệ
        if (this.createdTimestamp <= 0) return false;   // Kiểm tra timestamp khởi tạo
        return true;    // Xác nhận ảnh hợp lệ
    }

    logData(): void {
        console.log(`
        Image:
            id: ${this.id}
            src: ${this.src}
            alt text: ${this.altText}
            page id: ${this.pageId}
            created timestamp: ${new Date(this.createdTimestamp).toDateString()}
        `);
    }
}
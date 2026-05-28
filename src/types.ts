import { v4 } from "@std/uuid";
import { isValidStringWithMinLen, isValidUrl, isPageTypeValue } from "./funcs.ts";

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
    pubDate: Date | null;  // Ngày đăng tải
    type: PageType; // Loại page (vd: web, product, video, v.v)
    source: string; // Nguồn của page (vd: www.google.com)
    addedDate: Date;    // Ngày được thêm vào
    updateDate: Date;   // Ngày được cập nhật
    content: string;    // nội dung html của page

    constructor(id: string, url: string, title: string, pubDate: Date, type: PageType, source: string, addedDate: Date, updateDate: Date, content: string) {
        this.id = id;
        this.url = url;
        this.title = title;
        this.pubDate = pubDate;
        this.type = type;
        this.source = source;
        this.addedDate = addedDate;
        this.updateDate = updateDate;
        this.content = content;
    }

    // Kiểm tra tính hợp lệ
    validate(): boolean {
        if (!v4.validate(this.id)) return false;    // kiểm tra uuid
        if (!isValidUrl(this.url)) return false;    // Kiểm tra url của page
        if (!isValidStringWithMinLen(this.title, 2)) return false;  // Kiểm tra title (cần tối thiểu 2 ký tự)
        if (!isPageTypeValue(this.type)) return false;  // Kiểm tra kiểu của page
        if (this.source.length === 0) return false;   // source không được rỗng
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
            publication date: ${this.pubDate?.toDateString()}
            type: ${this.type.toString()}
            source: ${this.source}
            added date: ${this.addedDate.toDateString()}
            update date: ${this.updateDate.toDateString()}
            content: ${this.content.slice(0, 100)}
        `);
    }
}
import { HtmlContent, Page, PageMeta, PageStatus, Image } from "./maria-entities.ts";

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

// Kiểu lưu trữ Page
export type PageData =  {
    page: Page; // Thông tin về page
    status: PageStatus; // Thông tin trạng thái cập nhật
    meta: PageMeta; // Thông tin meta data của page
    htmlContent: HtmlContent;   // Nội dung của html của page
    images?: Image[];  // Hình ảnh của page nếu có
};
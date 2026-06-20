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
    id: string; // Page id (string v4 uuid của Deno)
    url: string;    // url của page
    title: string;  // Tiêu đề page
    publishTimestamp: number | null;  // Ngày đăng tải của page (nếu không có thì không phải là kiểu news)
    type: PageType; // Loại page (vd: web, product, video, v.v)
    source: string; // Nguồn của page (vd: www.google.com)
    createdTimestamp: number;    // Ngày được thêm vào
    updateTimestamp: number;   // Ngày được cập nhật
    language: Language;
    content: string;    // nội dung html của page
};

// Kiểu dữ liệu Image
export type ImageData = {
    id: string;
    src: string;
    altText: string;
    pageId: string; // id của page chứa hình ảnh này
    createdTimestamp: number;   // Thời gian Image này được thêm (miliseconds)
};
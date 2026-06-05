import { CollectionCreateSchema } from "typesense";

/**
 * Cấu trúc Collection Schema dùng cho Typesense
*/

// Page Collection Schema
export const PageScheme: CollectionCreateSchema = {
    "name": "pages",
    "fields": [
        { "name": "id", "type": "string" }, // id: string
        { "name": "url", "type": "string" },    // url: string
        { "name": "title", "type": "string" },  // title: string
        { "name": "puslishTimestamp", "type": "int64", "optional": true },   // pubDate: Date (int64 ở Typesense)
        { "name": "type", "type": "string", "facet": true },   // type: string
        { "name": "source", "type": "string", "facet": true }, // source: string | facet = true cho phép lấy thống kê ở trường này
        { "name": "createdTimestamp", "type": "int64" },   // addedDate: Date (int64 ở Typesense)
        { "name": "updateTimestamp", "type": "int64" },  // updateDate: Date (int64 ở Typesense)
        { "name": "language", "type": "string", "facet": true },   // language: Language (string ở Typesense)
        { "name": "content",  "type": "string" },   // content: string
    ],
    "default_sorting_field": "addedDate"    // Trường sắp xếp mặc định
};

// Image collection Scheme
export const ImageScheme: CollectionCreateSchema = {
    "name": "images",
    "fields": [
        { "name": "id", "type": "string" }, // image id
        { "name": "src", "type": "string" }, // image src
        { "name": "altText", "type": "string" }, // image alt-text
        { "name": "pageId", "type": "string" }, // page id cả page chứa hình ảnh này.
        { "name": "createdTimestamp", "type": "int64" } // Ngày tạo của hình ảnh
    ],
};
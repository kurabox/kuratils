/**
 * Cấu trúc Collection Scheme dùng cho Typesense
*/

// Page Collection Scheme
export const PageScheme = {
    "name": "pages",
    "fields": [
        { "name": "id", "type": "string" }, // id: string
        { "name": "url", "type": "string" },    // url: string
        { "name": "title", "type": "string" },  // title: string
        { "name": "pubDate", "type": "int64", "optional": true },   // pubDate: Date (int64 ở Typesense)
        { "name": "type", "type": "string", "facet": true },   // type: string
        { "name": "source", "type": "string", "facet": true }, // source: string | facet = true cho phép lấy thống kê ở trường này
        { "name": "addedDate", "type": "int64" },   // addedDate: Date (int64 ở Typesense)
        { "name": "updateDate", "type": "int64" },  // updateDate: Date (int64 ở Typesense)
        { "name": "language", "type": "string", "facet": true },   // language: Language (string ở Typesense)
        { "name": "content",  "type": "string" },   // content: string
    ],
    "default_sorting_field": "addedDate"    // Trường sắp xếp mặc định
};
/**
 * Các schema được định nghĩa sẵn cho việc build query insert string 
*/

import { InsertableSchema } from "./maria-services.ts";
import { Log } from "./sys.ts";
import { Page, PageStatus, PageMeta, HtmlContent, HtmlHash } from "./maria-entities.ts";

// Schema cho hệ thống Log
export const logSchema: InsertableSchema<Log> = {
    fields: ["id", "timestamp", "content", "type"],
};

// Schema cho kiểu Page
export const pageSchema: InsertableSchema<Page> = {
    fields: ["id", "url"],
};

// Schema cho kiểu PageStatus
export const pageStatusSchema: InsertableSchema<PageStatus> = {
    fields: ["id", "pageId", "createdTimestamp", "updateTimestamp"],
};

// Schema cho kiểu PageMeta
export const pageMetaSchema: InsertableSchema<PageMeta> = {
    fields: ["id", "pageId", "title", "publicationTimestamp", "pageType", "source", "language"],
};

// Schema cho kiểu HtmlContent
export const htmlContentSchema: InsertableSchema<HtmlContent> = {
    fields: ["id", "pageId", "htmlData"],
};

// Schema cho kiểu HtmlHash
export const htmlHashSchema: InsertableSchema<HtmlHash> = {
    fields: ["id", "pageId", "hash"],
};
/**
 * Các schema được định nghĩa sẵn cho việc build query insert string 
*/

import { InsertableSchema } from "./maria-services.ts";
import { Log } from "./sys.ts";
import { Page, PageStatus } from "./maria-entities.ts";

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
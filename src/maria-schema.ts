/**
 * Các schema được định nghĩa sẵn cho việc build query insert string 
*/

import { InsertableSchema } from "./maria-services.ts";
import { Log } from "./sys.ts";

export const logSchema: InsertableSchema<Log> = {
    fields: ["id", "timestamp", "content", "type"],
};
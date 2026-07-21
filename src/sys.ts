/**
 * Chức năng ghi log thống nhất cho tất cả các chương trình trong kurabox
*/

import { generateV4UUID } from "./funcs.ts";
import { Pool } from "mariadb";
import { buildInsertValuesString, executeSqlQuery, QueryResult, QueryType } from "./maria-services.ts";
import { logSchema } from "./maria-schema.ts";

// Các kiểu log có thể được sử dụng trong kurabox
export enum LogType {
    CrawlerLog = "crawler_log", // log của crawler
    OperatorCrudLog = "operator_crud_log", // log thao tác data của back-end
    OperatorSearchLog = "operator_search_log",   // log tìm kiếm của backend
    SysLog = "sys_log"  // kiểu log chung trong hệ thống
}

export type Log = {
    id: string; // v4 uuid
    timestamp: bigint;  // bigint timestamp
    content: string;
    type: LogType; 
};

// Hàm log 
export function msgLog(msg: string, logType: LogType): Log {
    const timestamp: number = Date.now();    // Lấy ra thời gian khởi tạo log
    const logStr: string = `[${new Date(timestamp).toString().split(" (")[0]}] ${msg}`;
    console.log(logStr);   // Hiển thị log ra console
    return {
        id: generateV4UUID(),
        timestamp: BigInt(timestamp),
        content: logStr,
        type: logType,
    };
}

// Hàm lưu danh sách log được chỉ định vào database (Lưu theo từng danh sách hoặc từng log đơn lẻ)
export async function saveLogsIntoDatabase(pool: Pool, logs: Log[]): Promise<void> {
    const logValuesStr: string | null = buildInsertValuesString<Log>(logs, logSchema);
    if (logValuesStr !== null) {
        // Khởi tạo tham số để thực hiện hàm executeSqlQuery
        const queryResult: QueryResult = await executeSqlQuery({
            pool: pool,
            type: QueryType.Insert,
            sqlStr: `insert into crawler_log values ${logValuesStr};`,
        });
        msgLog(`${queryResult.upsert!.affectedRows} log(s) saved`, LogType.SysLog);
    } else {
        msgLog("Cannot save logs into database because of invalid format", LogType.SysLog);
    }
}
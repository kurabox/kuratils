/**
 * Chức năng ghi log thống nhất cho tất cả các chương trình trong kurabox
*/

import { generateV4UUID } from "./funcs.ts";
import { Pool, Connection } from "mariadb";

export enum LogType {
    CrawlerLog = "crawler_log", // log của crawler
    OperatorCrudLog = "operator_crud_log", // log thao tác data của back-end
    OperatorSearchLog = "operator_search_log"   // log tìm kiếm của backend
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

// Hàm tải logs chỉ định vào database
// export async function transferLogsToDatabase(pool: Pool, logType: LogType, logs: Log[]): Promise<void> {
//     // Khởi tạo string chứa log values từ Log[] để dùng trong query
    
//     let conn: Connection;
//     // Khởi tạo kết nối
//     try {
//         conn = await pool.getConnection();
//         const res = await conn.query(`
//             insert into ${logType.toString()} (id, timestamp, log_content)
//             values
//             ()
//         `);
//     }
// }
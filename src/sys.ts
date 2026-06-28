/**
 * Chức năng ghi log thống nhất cho tất cả các chương trình trong kurabox
*/

import { v4 } from "@std/uuid";
import { generateV4UUID } from "./funcs.ts";

export enum LogType {
    CrawlerLog = "crawler_log", // log của crawler
    OperatorLog = "operator_log", // log của back-end
}

export type Log = {
    id: string; // v4 uuid
    timestamp: bigint;  // bigint timestamp
    content: string;
    type: LogType; 
};

// RegExp dùng để kiểm tra định dạng log
const logFormatRegExp: RegExp = /^\[[A-Z][a-z]{2} [A-Z][a-z]{2} \d{1,2} \d{4} \d{2}:\d{2}:\d{2}(?: GMT[+-]?\d{4}| UTC)?\].+$/;

export function validateLog(log: Log): boolean {
    if (
        !v4.validate(log.id) ||
        log.timestamp <= 0 ||
        !logFormatRegExp.test(log.content) ||
        !Object.values(LogType).includes(log.type as LogType)
    ) {
        return false;
    } else {
        return true;
    }
}

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
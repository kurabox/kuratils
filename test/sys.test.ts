import { msgLog, validateLog, Log } from "../src/sys.ts";
import { LogType } from "../src/sys.ts";
import { assert, assertEquals } from "@std/assert";
import { generateV4UUID } from "../src/funcs.ts";

Deno.test("msgLog test", (): void => {
    const log: Log = msgLog("Test message!", LogType.OperatorLog);
    assert(validateLog(log) === true);
    console.log(log);

    // Kiểm tra hàm trả về object Log
    assertEquals(typeof log, "object");

    // Kiểm tra có property content chứa message
    assertEquals(log.content.includes("Test message"), true);

    // Kiểm tra có property type đúng với tham số truyền vào
    assertEquals(log.type, LogType.OperatorLog);
});

Deno.test("Log type test", (): void => {
    // Helper: tạo log hợp lệ
    function createValidLog(): Log {
        return {
            id: generateV4UUID(),
            timestamp: BigInt(Date.now()),
            content: `[Sat Jun 27 2026 22:41:00 GMT+0700] Hello world`,
            type: LogType.CrawlerLog,
        };
    }

    // UUID không hợp lệ
    let log = createValidLog();
    log.id = "not-a-uuid";
    assertEquals(validateLog(log), false, "UUID không hợp lệ phải fail");

    // Timestamp âm
    log = createValidLog();
    log.timestamp = BigInt(-12345);
    assertEquals(validateLog(log), false, "Timestamp âm phải fail");

    // Timestamp bằng 0
    log = createValidLog();
    log.timestamp = BigInt(0);
    assertEquals(validateLog(log), false, "Timestamp bằng 0 phải fail");

    // Content sai format
    log = createValidLog();
    log.content = "Hello world without date prefix";
    assertEquals(validateLog(log), false, "Content sai format phải fail");

    // Type sai ngoài enum
    log = createValidLog();
    log.type = 999 as LogType;
    assertEquals(validateLog(log), false, "Type ngoài enum phải fail");

    // Trường hợp hợp lệ
    log = createValidLog();
    assertEquals(validateLog(log), true, "Log hợp lệ phải pass");
});
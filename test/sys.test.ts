import { msgLog, Log, LogType, saveLogsIntoDatabase } from "../src/sys.ts";
import { assert, assertEquals } from "@std/assert";
import { buildInsertValuesString, createDbConnectionPool, Database } from "../src/maria-services.ts";
import { logSchema } from "../src/maria-schema.ts";
import { Pool } from "mariadb";

Deno.test("msgLog test", (): void => {
    const log: Log = msgLog("Test message!", LogType.OperatorCrudLog);
    console.log(log);

    // Kiểm tra hàm trả về object Log
    assertEquals(typeof log, "object");

    // Kiểm tra có property content chứa message
    assertEquals(log.content.includes("Test message"), true);

    // Kiểm tra có property type đúng với tham số truyền vào
    assertEquals(log.type, LogType.OperatorCrudLog);
});

Deno.test("buildLogValuesStr test", (): void => {
    function generateLog(quantity: number, logType: LogType): Log[] {
        const logs: Log[] = [];
        if (quantity <= 0) return logs;
        for (let i: number = 0; i < quantity; i++) {
            logs.push(msgLog(`Log ${(i + 1).toString()}`, logType));
        }
        return logs;
    }

    const logs: Log[] = generateLog(10, LogType.CrawlerLog);
    const valuesInsertableStr: string | null = buildInsertValuesString(logs, logSchema);
    assert(valuesInsertableStr !== null);
    console.log(valuesInsertableStr);

    const emptyLog: Log[] = generateLog(0, LogType.OperatorCrudLog);
    assert(buildInsertValuesString(emptyLog, logSchema) === null);
});

Deno.test("saveLogIntoDatabase test", async (): Promise<void> => {
    const pool: Pool | null = createDbConnectionPool(Database.LogDatabase);
    assert(pool !== null);
    const logs: Log[] = [];
    for (let i: number = 1; i < 10; i++) {
        logs.push(msgLog(`This is log ${i}`, LogType.SysLog));
    }
    await saveLogsIntoDatabase(pool, logs);
});
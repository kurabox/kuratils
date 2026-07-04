import { Pool } from "mariadb";
import { createDbConnectionPool, Database, executeSqlQuery, QueryParams, QueryResult, QueryType } from "../src/maria-services.ts";
import { assert } from "@std/assert";
import { Log, LogType } from "../src/sys.ts";
import { generateV4UUID } from "../src/funcs.ts";
import { buildInsertValuesString } from "../src/maria-services.ts";
import { logSchema } from "../src/maria-schema.ts";

Deno.test("create connection pool test", (): void => {
    const searchPool: Pool | null = createDbConnectionPool(Database.SearchDatabase);
    assert(searchPool !== null);
    const logPool: Pool | null = createDbConnectionPool(Database.LogDatabase);
    assert(logPool !== null);
});

Deno.test("mariadb select query test", async (): Promise<void> => {
    const pool: Pool | null = createDbConnectionPool(Database.LogDatabase);
    assert(pool !== null);
    const params: QueryParams = {
        pool: pool,
        type: QueryType.Select,
        sqlStr: "select * from crawler_log",
    };
    const queryRes: QueryResult = await executeSqlQuery(params);
    assert(queryRes.type === QueryType.Select);
    assert(queryRes.rows !== undefined);
    for (const item of queryRes.rows!) {
        console.log(`${item.id} - ${item.timestamp} - ${item.log_content}`);
    }
});

Deno.test("mariadb insert query test", async (): Promise<void> => {
    function generateLog(quantity: number): Log[] {
        const result: Log[] = [];
        if (quantity <= 0) return result;
        for (let i: number = 0; i < quantity; i++) {
            result.push({
                id: generateV4UUID(),
                timestamp: BigInt(Date.now()),
                content: "Log sample",
                type: LogType.CrawlerLog,
            });
        }
        return result;
    }

    const logValuesStr: string | null = buildInsertValuesString<Log>(generateLog(10), logSchema);
    // Khởi tạo kết nối và thực hiện query
    const pool: Pool | null = createDbConnectionPool(Database.LogDatabase);
    assert(pool !== null);
    const params: QueryParams = {
        pool: pool,
        type: QueryType.Insert,
        sqlStr: `insert into crawler_log values ${logValuesStr!};`,
    };
    const result: QueryResult = await executeSqlQuery(params);
    assert(result.type === QueryType.Insert);
    assert(result.upsert !== undefined);
    console.log(result.upsert!);
});
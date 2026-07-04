import { Pool } from "mariadb";
import { createDbConnectionPool, Database, executeSqlQuery, QueryParams, QueryResult, QueryType } from "../src/maria-services.ts";
import { assert } from "@std/assert";

// Deno.test("create connection pool test", (): void => {
//     const searchPool: Pool | null = createDbConnectionPool(Database.SearchDatabase);
//     assert(searchPool !== null);
//     const logPool: Pool | null = createDbConnectionPool(Database.LogDatabase);
//     assert(logPool !== null);
// });

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

});
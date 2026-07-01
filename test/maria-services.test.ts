import { Pool } from "mariadb";
import { createDbConnectionPool, Database } from "../src/maria-services.ts";
import { assert } from "@std/assert";

Deno.test("create connection pool test", (): void => {
    const searchPool: Pool | null = createDbConnectionPool(Database.SearchDatabase);
    assert(searchPool !== null);
    const logPool: Pool | null = createDbConnectionPool(Database.LogDatabase);
    assert(logPool !== null);
});
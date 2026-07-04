import mariadb from "mariadb";
import { Pool, Connection, PoolConfig, UpsertResult, RowsWithMeta } from "mariadb";
import { LogType, msgLog } from "./sys.ts";

// Kiểu chung để chuyển dữ liệu từ một type entities bất kỳ sàng query insert string
export type InsertableSchema<T> = {
    fields: (keyof T)[];    // fields chứa toàn bộ các thuộc tính có thể có trong một entities type
};

// Database type: các database đang được chương trình sử dụng
export enum Database {
    SearchDatabase = "search-db-name",  // Database dùng cho search engine
    LogDatabase = "log-db-name",   // Database dùng cho logs
}

// Kiểu truyền vào cho hàm thưc thi SQL Query
export type QueryParams = {
    pool: Pool; // db connection pool
    type: QueryType;    // Kiểu truy vấn của query này
    sqlStr: string;    // query string dùng để thực thi thao tác với database
};

// Các kiểu Query có thể được sử dụng
export enum QueryType {
    Insert = "Insert",  // Thao tác thêm dữ liệu mới insert
    Select = "Select",  // Thao tác trích xuất dữ liệu select
}

// Kiểu trả về chung cho tất cả các loại query
export type QueryResult = {
    type: QueryType;
    upsert?: UpsertResult;  // Nếu không có giá trị thì sẽ là undefined
    rows?: RowsWithMeta;    // Nếu không có giá trị thì sẽ là undefined
};

// Hàm kiểm tra DbConnectionInfo
function validatePoolConfig(config: PoolConfig): boolean {
    if (
        config.host === undefined ||
        (config.port === undefined || isNaN(config.port)) ||
        config.user === undefined ||
        config.password === undefined ||
        config.database === undefined ||
        (config.connectionLimit === undefined || isNaN(config.connectionLimit))
    ) {
        return false;   // config không hợp lệ
    } else {
        return true;    // config hợp lệ
    }
}

// Hàm trích xuất thông tin kết nối database từ file .env
export function createDbConnectionPool(database: Database): Pool | null {
    // Trích xuất thông tin kết nối từ file env
    const poolConfig: PoolConfig = {
        host: Deno.env.get("db-host"),
        port: Number(Deno.env.get("db-port")),
        user: Deno.env.get("db-user"),
        password: Deno.env.get("db-password"),
        database: Deno.env.get(database),    // Lấy ra tên tham số db-name tương ứng trong file .env
        connectionLimit: Number(Deno.env.get("db-connection-limit")),
    };

    // Kiểm tra thông tin kết nối
    if (!validatePoolConfig(poolConfig)) {
        console.log("Invalid pool config");
        return null;
    } else {
        // Khởi tạo pool kết nối đến db
        return mariadb.createPool(poolConfig);
    }
}

// Hàm build insert query values string dựa vào type và type schema đầu vào
export function buildInsertValuesString<T>(items: T[], schema: InsertableSchema<T>): string | null {
    if (items.length <= 0) return null;
    return items.map((item: T) => {
        // Với mỗi item, lấy ra các field
        const values = schema.fields.map((field: keyof T) => {
            const value = item[field];
            // Nếu value là string thì thêm dấu nháy đơn và escape dấu nháy đơn
            return typeof value === "string" ? `'${String(value).replace(/'/g, "''")}'` : value;
        });
        return `(${values.join(", ")})`;    // Ghép các value thành một tuple SQL: (value1, value2, value3)
    }).join(",\n");
}

// Hàm thực thi SQL chỉ định
export async function executeSqlQuery(params: QueryParams): Promise<QueryResult> {
    const result: QueryResult = {
        type: params.type,
        upsert: undefined,
        rows: undefined,
    };
    // Khởi tạo kết nối
    let conn: Connection | null = null;
    try {
        conn = await params.pool.getConnection();   // Khởi tao connection
        const queryRes: unknown = await conn.query(params.sqlStr);
        // Trích xuất kết quả query dựa vào loại query có trong param
        switch (result.type) {
            case QueryType.Insert: {
                // Trường hợp query type là Insert
                result.upsert = queryRes as UpsertResult;
                break;
            } 
            case QueryType.Select: {
                // Trường hợp query type là Select
                result.rows = queryRes as RowsWithMeta;
                break;
            }
        }
    } catch (err: unknown) {
        msgLog(err as string, LogType.SysLog);
    } finally {
        if (conn !== null && conn.isValid()) conn.end();
    }
    // Trả ra kết quả
    return result;
}
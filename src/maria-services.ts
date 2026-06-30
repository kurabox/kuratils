import mariadb from "mariadb";
import { Pool, PoolConfig } from "mariadb";

// Kiểu chung để chuyển dữ liệu từ một type entities bất kỳ sàng query insert string
export type InsertableSchema<T> = {
    fields: (keyof T)[];    // fields chứa toàn bộ các thuộc tính có thể có trong một entities type
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
export function createDbConnectionPool(): Pool | null {
    // Trích xuất thông tin kết nối từ file env
    const poolConfig: PoolConfig = {
        host: Deno.env.get("db-host"),
        port: Number(Deno.env.get("db-port")),
        user: Deno.env.get("db-user"),
        password: Deno.env.get("db-password"),
        database: Deno.env.get("db-name"),
        connectionLimit: Number(Deno.env.get("db-connection-limit")),
    };

    // Kiểm tra thông tin kết nối
    if (!validatePoolConfig(poolConfig)) {
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
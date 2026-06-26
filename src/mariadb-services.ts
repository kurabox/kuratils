import mariadb from "mariadb";
import { Pool, PoolConfig } from "mariadb";

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
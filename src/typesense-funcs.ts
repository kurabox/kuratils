import Typesense from "typesense";

// Hàm khởi tạo Typesense client từ file .env ở back-end
export function initTypesenseClient(): Typesense.Client | null {
    const host: string | undefined = Deno.env.get("TYPESENSE_HOST");
    const port: number = Number(Deno.env.get("TYPESENSE_PORT"));
    const protocol: string | undefined = Deno.env.get("TYPESENSE_PROTOCOL");
    const apiKey: string | undefined = Deno.env.get("TYPESENSE_APIKEY");
    const connectionTimeout: number = Number(Deno.env.get("TYPESENSE_CONNECTION_TIMEOUT"));

    if (
        host === undefined ||
        isNaN(port) ||
        protocol === undefined ||
        apiKey === undefined ||
        isNaN(connectionTimeout)
    ) {
        console.log("Invalid Typesense configuration");
        return null;
    } // Trả ra null nếu có bất kỳ thông tin nào về client không thể được tìm thấy

    return new Typesense.Client({
        "nodes": [{
            "host": host,
            "port": port,
            "protocol": protocol,
        }],
    "apiKey": apiKey,
    "connectionTimeoutSeconds": connectionTimeout,
    });
}
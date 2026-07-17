import { crypto } from "@std/crypto/crypto";

Deno.test("creating hash test", async (): Promise<void> => {
    const message: string = "Hello, Deno";
    const encoder: TextEncoder = new TextEncoder();
    const data: Uint8Array<ArrayBuffer> = encoder.encode(message);
    const result: ArrayBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(result));
    console.log(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
});
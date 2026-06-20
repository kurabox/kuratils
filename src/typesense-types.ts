/**
 * Các kiểu dữ liệu dùng để thao tác trên typesense
 */

// Các kiểu được typesense hỗ trợ native
export enum FieldType {
    string = "string",
    string_array = "string[]",
    int32 = "int32",
    int32_array = "int32[]",
    int64 = "int64",
    int64_array = "int64[]",
    float = "float",
    float_array = "float[]",
    bool = "bool",
    bool_array = "bool[]",
    geopoint = "geopoint",
    geopoint_array = "geopoint[]",
    geopolygon = "geopolygon",
    object = "object",  // nested object
    object_array = "object[]",  // nested object array
    string_asterisk = "string*",
    image = "image",
    auto = "auto",
}
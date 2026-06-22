/**
 * Các cấu trúc entities làm việc trực tiếp với database
*/

import { v4 } from "@std/uuid";
import { PageType } from "./data-types.ts";
import {
    validateUrl,
    isValidStringWithMinLen,
    isPageTypeValue,
    validateHtmlString,
} from "./funcs.ts";

interface Entities {
    id: string;
    validate(): boolean;
}

// Regex dùng để kiểm tra độ hợp lệ của source (từ web domain)
const sourceCheckingRegExp: RegExp = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

// Page entities
export class Page implements Entities {
    id: string;
    url: string;

    constructor(id: string, url: string) {
        this.id = id;
        this.url = url;
    }

    validate(): boolean {
        if (!v4.validate(this.id)) return false;
        if (!validateUrl(this.url)) return false;
        return true;
    }
}

// PageStatus entities
export class PageStatus implements Entities {
    id: string;
    pageId: string;
    createdTimestamp: bigint;
    updateTimestamp: bigint;

    constructor(id: string, pageId: string, createdTimestamp: bigint, updateTimestamp: bigint) {
        this.id = id;
        this.pageId = pageId;
        this.createdTimestamp = createdTimestamp;
        this.updateTimestamp = updateTimestamp;
    }

    validate(): boolean {
        if (!v4.validate(this.id)) return false;
        if (!v4.validate(this.pageId)) return false;   
        if (this.createdTimestamp <= 0) return false;   // timestamp cần lớn hơn 0
        if (this.updateTimestamp <= 0) return false;    // timestamp cần lớn hơn 0
        return true;
    }
}

// MetaData entities
export class PageMeta implements Entities {
    id: string;
    pageId: string;
    title: string;
    publicationTimestamp: bigint | null;
    pageType: PageType;
    source: string;

    constructor(id: string, pageId: string, title: string, publicationTimestamp: bigint, pageType: PageType, source: string) {
        this.id = id;
        this.pageId = pageId;
        this.title = title;
        this.publicationTimestamp = publicationTimestamp;
        this.pageType = pageType;
        this.source = source;
    }

    validate(): boolean {
        if (!v4.validate(this.id)) return false;
        if (!v4.validate(this.pageId)) return false;
        if (!isValidStringWithMinLen(this.title, 2)) return false;
        if (this.publicationTimestamp !== null && this.publicationTimestamp <= 0) return false;
        if (!isPageTypeValue(this.pageType)) return false;
        if (!sourceCheckingRegExp.test(this.source)) return false;
        return true;
    }
}

// HtmlContent entities
export class HtmlContent implements Entities {
    id: string;
    pageId: string;
    htmlData: string;

    constructor(id: string, pageId: string, htmlData: string) {
        this.id = id;
        this.pageId = pageId;
        this.htmlData = htmlData;
    }

    validate(): boolean {
        if (!v4.validate(this.id)) return false;
        if (!v4.validate(this.pageId)) return false;
        if (!validateHtmlString(this.htmlData)) return false;
        return true;       
    }
}

// PageLink entities
export class PageLink implements Entities {
    id: string;
    fromPageId: string;
    toPageId: string;

    constructor(id: string, fromPageId: string, toPageId: string) {
        this.id = id;
        this.fromPageId = fromPageId;
        this.toPageId = toPageId;
    }

    validate(): boolean {
        if (!v4.validate(this.id)) return false;
        if (!v4.validate(this.fromPageId)) return false;
        if (!v4.validate(this.toPageId)) return false;
        return true;
    }
}

// Image entities
export class Image implements Entities {
    id: string;
    pageId: string;
    imageUrl: string;
    altText: string;
    source: string;
    
    constructor(id: string, pageId: string, imageUrl: string, altText: string, source: string) {
        this.id = id;
        this.pageId = pageId;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.source = source;
    }

    validate(): boolean {
        if (!v4.validate(this.id)) return false;
        if (!v4.validate(this.pageId)) return false;
        if (!validateUrl(this.imageUrl)) return false;
        if (!isValidStringWithMinLen(this.altText, 2)) return false;
        if (!sourceCheckingRegExp.test(this.source)) return false;
        return true;
    }
}
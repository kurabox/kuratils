import { assertEquals, assertFalse } from "@std/assert";
import { eld } from "eld/large";
import { Language, detectLanguage, isLanguageValue } from "../src/data-types.ts";

Deno.test("Language detector test", (): void => {
    const jpStr: string = "アニメ";
    assertEquals(eld.detect(jpStr).language, "ja");
    assertEquals(detectLanguage(jpStr), Language.Japanese);

    const enStr: string = "If you wish.";
    assertEquals(eld.detect(enStr).language, "en");
    assertEquals(detectLanguage(enStr), Language.English);

    const viStr: string = "Xin chào.";
    assertEquals(eld.detect(viStr).language, "vi");
    assertEquals(detectLanguage(viStr), Language.Vietnamese);

    assertEquals(detectLanguage("Era un martes de julio cuando Ana vio a Tomás por primera vez."), Language.Unsupported);
});

Deno.test("language type check", (): void => {
    const randomLan: Language = Language.Japanese;
    assertEquals(isLanguageValue(randomLan), true);

    const randomValue: unknown = undefined;
    assertFalse(isLanguageValue(randomValue));
});
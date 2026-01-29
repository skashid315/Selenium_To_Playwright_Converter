# SOP: Java Selenium to Playwright TypeScript Conversion

**Model**: `gemma3:4b`
**Temperature**: `0.1` (Strict Determinism)
**Context Window**: 8192 (Approx)

## Goal
Convert Java Selenium code (TestNG/JUnit + POM) to equivalent Playwright TypeScript code.

## 1. Input Processing
The input Java code usually comes in two flavors:
1. **Page Objects**: Classes with `@FindBy` or `By` locators and methods.
2. **Tests**: Classes with `@Test`, `@BeforeClass`, etc.

## 2. Prompt Strategy (Layer 3)
We will use a **Chain-of-Thought** approach for Gemma.

### System Prompt
```text
You are an expert SDET specalizing in migrating Selenium Java to Playwright TypeScript.
You follow these rules strictly:
1. Translate Page Object Models (POM) to TypeScript classes.
2. Translate `By.id`, `By.css`, `By.xpath` to `page.locator()`.
3. Translate `driver.findElement` interactions to `await page.locator(...).action()`.
4. Translate `Assert.assertEquals` to `await expect(...).toBe(...)`.
5. Keep variable names consistent where possible, but use camelCase for TS.
6. Do not include explanations, just output the code block.
```

### User Prompt Template
```text
Convert the following Java Selenium code to Playwright TypeScript:

```java
{{SOURCE_CODE}}
```

Requirements:
- Use `@playwright/test` for test files.
- Use standard class export for Page Objects.
- Preserve comments.
```

## 3. Heuristics & Fallbacks
- **Implicit Waits**: Remove them. Playwright auto-waits.
- **Explicit Waits**: Convert `WebDriverWait` to `await expect(locator).toBeVisible()`.
- **Thread.sleep**: Convert to `await page.waitForTimeout(...)` (warn user).

## 4. Output Validation
- Check for `import { test, expect }` in test files.
- Check for `export class` in Page Objects.

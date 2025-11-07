# Type Checking Guide

## ✅ 如何驗證 Type Inference 是否正常工作

### 方法 1: IDE Autocomplete 測試

1. **打開任意 demo 文件** (例如 `src/demos/TypographyDemo.tsx`)

2. **測試 color tokens**:
   ```tsx
   <Text color="  // 輸入雙引號後按 Ctrl+Space (或 Cmd+Space)
   ```
   應該看到:
   - `white`
   - `black`
   - `brand.50`, `brand.100`, ..., `brand.900`
   - `gray.50`, `gray.100`, ..., `gray.900`
   - `red.50`, `red.100`, ..., `red.900`
   - `green.50`, `green.100`, ..., `green.900`

3. **測試 spacing tokens**:
   ```tsx
   <Box p={  // 輸入後按 Ctrl+Space
   ```
   應該看到:
   - `0`, `1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`, `20`, `24`, `32`

4. **測試 fontSize tokens**:
   ```tsx
   <Text fontSize="  // 輸入後按 Ctrl+Space
   ```
   應該看到:
   - `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`

5. **測試 fontWeight tokens**:
   ```tsx
   <Text fontWeight="  // 輸入後按 Ctrl+Space
   ```
   應該看到:
   - `normal`, `medium`, `semibold`, `bold`, `extrabold`

### 方法 2: Type Hover 測試

1. **打開 `src/TypeCheck.tsx`**

2. **Hover 在不同的 props 上**:
   ```tsx
   <Box
     bg="brand.500"  // Hover 在 bg 上
     color="gray.900"  // Hover 在 color 上
     p={4}  // Hover 在 p 上
   >
   ```

3. **應該看到的類型**:

   **bg 屬性:**
   ```typescript
   (property) bg?: "white" | "black"
     | "brand.50" | "brand.100" | ... | "brand.900"
     | "gray.50" | "gray.100" | ... | "gray.900"
     | "red.50" | "red.100" | ... | "red.900"
     | "green.50" | "green.100" | ... | "green.900"
     | (string & {}) | undefined
   ```

   **color 屬性:**
   ```typescript
   (property) color?: "white" | "black"
     | "brand.50" | "brand.100" | ... | "brand.900"
     | "gray.50" | ... | "gray.900"
     | (string & {}) | undefined
   ```

   **p 屬性:**
   ```typescript
   (property) p?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8"
     | "10" | "12" | "16" | "20" | "24" | "32"
     | number | (string & {}) | undefined
   ```

### 方法 3: TypeScript 錯誤測試

1. **打開 `src/TypeCheck.tsx`**

2. **取消註釋錯誤示例**:
   ```tsx
   // 取消這行的註釋
   <Text color="invalid.500">Should fail</Text>
   ```

3. **應該看到 TypeScript 錯誤**:
   ```
   Type '"invalid.500"' is not assignable to type
   '"white" | "black" | "brand.50" | ... | (string & {})'
   ```

4. **測試其他錯誤**:
   ```tsx
   <Text fontSize="huge">Should fail</Text>
   <Box p="999">Should fail</Box>
   <Text fontWeight="ultralight">Should fail</Text>
   ```
   所有這些都應該產生 TypeScript 錯誤。

## 🔍 理解 `(string & {})` 類型

你可能會看到類型中包含 `(string & {})`:

```typescript
bg?: "brand.500" | "gray.900" | ... | (string & {})
```

**這是什麼?**
- `string & {}` 是 TypeScript 的一個技巧
- 它允許你傳入自定義值（例如 `"#ff0000"`）
- 但 IDE 會優先顯示具體的 literal types（`"brand.500"`, `"gray.900"` 等）

**為什麼需要它?**
- 提供類型安全的同時保持靈活性
- 允許使用 design tokens 之外的自定義值
- 例如: `<Box bg="#ff0000">` 仍然有效

## ⚠️ 常見問題

### Q1: 我看到 `bg: string` 而不是完整的 union type

**可能原因:**
1. TypeScript 版本過舊（需要 5.0+）
2. IDE 沒有正確識別類型
3. 需要重啟 TypeScript server

**解決方法:**
1. 重啟 TypeScript server (VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")
2. 確保 `zen.config.ts` 中使用了 `as const`:
   ```typescript
   export const config = defineConfig({
     colors: { ... }
   } as const)  // ← 必須有這個
   ```
3. 檢查 TypeScript 版本: `tsc --version` (應該是 5.0+)

### Q2: Autocomplete 不工作

**解決方法:**
1. 確保包已經構建: `bun run build`
2. 重啟 TypeScript server
3. 檢查 IDE 設置是否啟用了 TypeScript IntelliSense

### Q3: Biome lint 報錯 "React is undeclared"

**這是正常的！**
- React 17+ 使用新的 JSX transform，不需要導入 React
- 已經在 `biome.json` 中禁用了這個規則
- 如果仍然報錯，重啟 IDE 或清除 lint cache

## 📊 Type Inference 評分標準

**完美 ✅:**
- Autocomplete 顯示所有 design tokens
- Hover 顯示完整的 union types
- 無效的 tokens 產生 TypeScript 錯誤

**部分工作 ⚠️:**
- Autocomplete 顯示部分 tokens
- Hover 顯示 `string` 但 autocomplete 仍然工作
- 需要重啟 TypeScript server

**不工作 ❌:**
- Autocomplete 完全不顯示 tokens
- Hover 顯示 `any` 或 `unknown`
- 無效的 tokens 不產生錯誤
- 需要檢查配置或重新構建

## 🛠️ Debug 步驟

如果 type inference 不工作：

1. **檢查 TypeScript 版本**:
   ```bash
   tsc --version  # 應該是 5.0 或更高
   ```

2. **重新構建所有包**:
   ```bash
   cd packages/core && bun run build
   cd ../react && bun run build
   ```

3. **重啟 TypeScript server**:
   - VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"
   - 或重啟 IDE

4. **檢查配置**:
   ```bash
   # 確保 zen.config.ts 使用了 as const
   grep "as const" src/zen.config.ts
   ```

5. **清除緩存**:
   ```bash
   rm -rf node_modules/.cache
   rm -rf dist
   bun install
   bun run build
   ```

## 📝 總結

如果你能看到：
- ✅ Autocomplete 列出所有 color/spacing/fontSize tokens
- ✅ Hover 顯示完整的 union types（即使簡化為 "... 30 more ..."）
- ✅ 無效的 tokens 產生 TypeScript 錯誤

**那麼 type inference 就正常工作了！** 🎉

`(string & {})` 的存在是為了靈活性，不影響 IDE 的 autocomplete 行為。

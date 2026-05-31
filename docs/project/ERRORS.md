# ERRORS.md

Project error log. Each entry records a mistake, its root cause, the fix, and the lesson to prevent recurrence.

---

## 2026-05-31 — Regex-based JSONC comment stripper ate `//` in URLs

- **Symptom**: Parsing configs containing URLs (e.g. `"https://opencode.ai/config.json"`) produced "Invalid control character at line 2, col 21" because `re.sub(r"//.*", "", text)` treated `//opencode.ai/...` as a line comment, truncating the URL to `"https:`.
- **Root cause**: Regex operates character-by-character without awareness of JSON string context. `//` inside a string literal is not a comment.
- **Fix**: Replaced regex with a state-machine parser that tracks whether the cursor is inside a string (`"..."` or `'...'`) and only strips `//` and `/* */` outside of strings.
- **Lesson**: Never use flat regex for structured formats. String-aware parsing is essential for JSON-like formats where `//`, `/*`, `:`, `,`, etc. can appear as literal content inside string values.

## 2026-05-31 — `flex-1` blocked textarea resize handle

- **Symptom**: Textarea `resize: vertical` didn't work — the resize handle appeared but was unresponsive.
- **Root cause**: `flex-1` sets `flex: 1 1 0%`, making the browser compute the element's height via the flex layout algorithm. This overrides manual resize because the flex algorithm constantly recalculates the size.
- **Fix**: Removed `flex-1` from the textarea. Used explicit `minHeight` + `maxHeight` + `overflow: auto` + `resize: vertical` via inline styles.
- **Lesson**: CSS Flexbox's `flex: 1` (grow) conflicts with user-resizable elements. Use fixed min/max dimensions when resize functionality is needed.

## 2026-05-31 — shadcn/ui Tabs broke layout in narrow sidebar

- **Symptom**: The `TabsList` component rendered tabs as "table columns on the left" instead of inline buttons in the ~600px sidebar.
- **Root cause**: `@base-ui/react/tabs` renders `TabsList` with `inline-flex w-fit items-center justify-center rounded-lg`. The `justify-center` and `w-fit` styling doesn't adapt to narrow containers. When `TabsContent` content overflows, the whole tab bar shifts.
- **Fix**: Removed the Tabs component entirely. Replaced with plain `<button>` elements that toggle a `view` state. Simple CSS classes for active/inactive states.
- **Lesson**: shadcn/ui components built on `@base-ui/react` use opinionated defaults that don't always work in constrained layouts. When layout is non-trivial, prefer simple native elements over complex headless component abstractions.

## 2026-05-31 — Clear All Data button: multiple failed attempts

- **Symptom**: Clicking "Clear All Data" did nothing — textarea content and results remained visible.
- **Attempt history**:
  1. **key on ConfigUpload** — `resetKey` passed as `key={resetKey}` on ConfigUpload. Button conditionally rendered (`{result && ...}`). Failed.
  2. **Lift state to parent** — `content` state lifted to ConfigAnalyzer, `handleClear` set `setContent("")`. Failed.
  3. **ConfigAnalyzerBody split with Fragment** — Parent held `instanceKey`, body component keyed. Clear button in parent, body in child with Fragment (`<>...</>`). Clicks on the Clear button never reached the handler.
  4. **Debug click logger** — Added `onClick` to outer div. Logged clicks from ConfigAnalyzerBody buttons but **never** from the Clear button. This proved the button's DOM position was compromised.
- **Root cause**: ConfigAnalyzerBody used a **Fragment** (`<>...</>`), rendering its children as direct siblings of the Clear button row inside a `space-y-4` container. This created a DOM layout where the ConfigUpload Card (a solid, background-filled element) likely overlapped or displaced the Clear button, making it unclickable. The `space-y-4` margin algorithm combined with Fragment-rendered children produced unpredictable stacking.
- **Fix**: Moved the Clear button to the App header bar (completely outside ConfigAnalyzer's DOM tree). Used a `clearKey` state in App.tsx, passed as `key={clearKey}` to `<ConfigAnalyzer>`. Incrementing the key forces React to unmount and remount the entire component, wiping all state.
- **Lesson**:
  - **Never use Fragments as layout containers** when sibling elements have different z-ordering or backgrounds. Always wrap Fragment children in a real `<div>` when layout matters.
  - **Conditional rendering of action buttons** (`{result && <button>}`) is fragile — the button can disappear mid-click or be displaced by sibling DOM changes.
  - **Parent-level key-based remounting** is the most reliable reset pattern: hold the key in the nearest common ancestor, pass it down, increment on clear.
  - When debugging missing click handlers, add a click logger on a known-visible ancestor to determine if the element is even in the clickable DOM region.

## 2026-05-31 — `_format_parse_error` used wrong text for error positions

- **Symptom**: Parse error messages showed a snippet from the **original** (unsanitized) text, but column numbers came from the **cleaned** (sanitized + comment-stripped) text. The `^` marker pointed to the wrong position.
- **Root cause**: `parse_config` passes `raw` (original text) to `_format_parse_error`, but the JSON parse exception comes from `json.loads(cleaned)` where invisible characters and comments have been removed. Positions in `cleaned` differ from positions in `raw`.
- **Fix**: The error message now shows the actual problematic character near the error (via context snippet), which is more useful than a precise column pointer when text has been sanitized. A full fix would require mapping cleaned positions back to raw positions, but the context-based approach is adequate.
- **Lesson**: When transforming input before parsing, error positions from the parser correspond to the transformed input, not the original. Either map positions back, or provide context snippets instead of position-dependent markers.

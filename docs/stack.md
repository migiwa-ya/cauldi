# stack

## 📁 `content/` Directory Structure

```txt
content/
├── herbs/               # One file per herb, named by slug (scientific name)
│   └── matricaria-chamomilla.md
├── reports/             # User-submitted reports
│   └── {id}.md
├── herbStates.yaml      # List of herb forms (e.g. dry, fresh)
├── processes.yaml       # List of extraction methods (e.g. infusion, tincture)
├── usageMethods.yaml    # List of usage styles (e.g. hot, iced)
```

---

## 📄 `herbs/{slug}.md` (e.g. `matricaria-chamomilla.md`)

```yaml
---
slug: matricaria-chamomilla
nameJa: カモミール
nameCommonJa: ジャーマンカモミール
nameScientific: Matricaria chamomilla
nameEn: Chamomile
compoundId: 1
updatedAt: 2025-04-01T10:00:00+09:00
tags:
  - name: relax
    type: mood
  - name: night
    type: time
---

A soothing herb often used before bed...
```

---

## 📄 `reports/{id}.md`

```yaml
---
id: 1
summary: Tried chamomile tincture with soda at night
processId: 2           # e.g. tincture
usageMethodId: 3       # e.g. sodaMix
updatedAt: 2025-04-01T23:30:00+09:00
herbs:
  - herbId: 1
    herbStateId: 1     # e.g. dry
    herbPartId: 2      # e.g. flower
flavor:
  bitterness: 2
  sweetness: 6
  aromaType: floral
images:
  - imageUrl: /images/reports/1_img1.jpg
    caption: Freshly made
---

I felt more relaxed and warm after drinking this...
```

---

## 📄 `herbStates.yaml`

```yaml
- id: 1
  state: dry
- id: 2
  state: fresh
```

---

## 📄 `processes.yaml`

```yaml
- id: 1
  nameEn: infusion
  nameJa: ハーブティー
  description: Extract with hot water (e.g. tea).
- id: 2
  nameEn: tincture
  nameJa: チンキ
  description: Extract with alcohol.
```

---

## 📄 `usageMethods.yaml`

```yaml
- id: 1
  nameEn: hot
  nameJa: ホット
  description: Drink warm.
- id: 2
  nameEn: iced
  nameJa: アイス
  description: Drink cold.
- id: 3
  nameEn: sodaMix
  nameJa: 炭酸割り
  description: Mix with soda water.
```

---

## 🔍 Notes

- `herbs/*.md` files are named using a **slugified version of `nameScientific`**
- Tags are embedded in each herb file, not stored separately
- `usageMethodId` is excluded from group ID logic (used for filtering only)

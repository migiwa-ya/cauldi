# 🚀 Astro.js + Cloudflare Workers + D1 + Cache でSEO対応ハーブ紹介サイトを構築する

## **🌿 目的**
- **コストを抑えつつD1からデータを取得**
- **SEO対応のため、SSR（サーバーサイドレンダリング）を実施**
- **Cloudflare Workers + Cache API を活用し、高速なレスポンスを実現**

---

## **🛠️ 技術スタック**
- **Astro.js**（フロントエンド、SSR対応）
- **Cloudflare Workers**（APIサーバー）
- **Cloudflare D1**（データベース）
- **Cloudflare Cache API**（キャッシュによる高速化）

---

## **🔄 仕組み**
1. **フロントエンド（Astro.js）から Cloudflare Workers の API を `fetch()`**
2. **Workers が Cache API を確認**
   - **キャッシュあり →** キャッシュを返す
   - **キャッシュなし →** D1 にクエリを実行し、取得データをキャッシュしつつレスポンスを返す
3. **キャッシュを一定時間（例: 1時間）維持し、D1 のクエリ数を削減**
4. **Astro.js は SSR でデータを取得し、SEO 対応**

---

## **📌 1. Cloudflare Workers の設定**
### **`wrangler.toml`**
```toml
name = "herbs-api"
type = "javascript"

[[ d1_databases ]]
binding = "DB"
database_name = "herb-db"
database_id = "<D1_DATABASE_ID>"
```

---

## **📌 2. Cloudflare Workers の実装**
### **`src/api.js`**
```js
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/herbs") {
            return getHerbs(env);
        } else if (url.pathname.startsWith("/api/herbs/")) {
            const id = url.pathname.split("/").pop();
            return getHerbById(env, id);
        }

        return new Response("Not Found", { status: 404 });
    }
};

// キャッシュ取得・更新関数
async function fetchWithCache(env, cacheKey, query, bindParams = []) {
    const cache = caches.default;

    // キャッシュを確認
    let response = await cache.match(cacheKey);
    if (response) {
        return response;
    }

    // D1 からデータを取得
    const { results } = await env.DB.prepare(query).bind(...bindParams).all();
    if (results.length === 0) {
        return new Response("Not Found", { status: 404 });
    }

    // JSON レスポンスを作成
    const json = JSON.stringify(results);
    response = new Response(json, {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600" // 1時間キャッシュ
        }
    });

    // キャッシュに保存
    await cache.put(cacheKey, response.clone());

    return response;
}

// ハーブ一覧取得（キャッシュ対応）
async function getHerbs(env) {
    const cacheKey = new Request("https://cache.herbs.api/herbs");
    return fetchWithCache(env, cacheKey, "SELECT id, name, description FROM herbs");
}

// 個別ハーブ取得（キャッシュ対応）
async function getHerbById(env, id) {
    const cacheKey = new Request(`https://cache.herbs.api/herbs/${id}`);
    return fetchWithCache(env, cacheKey, "SELECT * FROM herbs WHERE id = ?", [id]);
}
```

---

## **📌 3. Astro.js フロントエンド**
### **`src/pages/herbs.astro`（ハーブ一覧ページ）**
```astro
---
const response = await fetch("https://your-cloudflare-worker-url/api/herbs");
const herbs = await response.json();
---
<html>
<head>
    <title>ハーブ一覧</title>
</head>
<body>
    <h1>ハーブ一覧</h1>
    <ul>
        {herbs.map(herb => (
            <li><a href={`/herb/${herb.id}`}>{herb.name}</a></li>
        ))}
    </ul>
</body>
</html>
```

### **`src/pages/herb/[id].astro`（個別ハーブページ）**
```astro
---
const { id } = Astro.params;
const response = await fetch(`https://your-cloudflare-worker-url/api/herbs/${id}`);
const herb = await response.json();
---
<html>
<head>
    <title>{herb.name} - ハーブ紹介</title>
</head>
<body>
    <h1>{herb.name}</h1>
    <p>{herb.description}</p>
    <a href="/herbs">← 戻る</a>
</body>
</html>
```

---

## **📌 4. 仕組みのポイント**
### ✅ **Cloudflare Workers の Cache API を活用**
- 初回アクセス時に D1 からデータを取得し、Cloudflare Cache API に保存
- 次回以降はキャッシュを返し、D1 のクエリを減らしてコスト削減

### ✅ **SEO に最適な形で D1 のデータを提供**
- Astro.js は SSR（サーバーサイドレンダリング）対応
- 検索エンジンに直接 HTML を渡せるので SEO に有利

### ✅ **コスト削減**
- **Cloudflare Workers 無料枠**: **月10万リクエスト無料**
- **D1 無料枠**: **1日10万クエリ無料**
- **キャッシュを活用し、D1 へのリクエストを最小限に抑える**

---

## **💡 まとめ**
✅ **Cloudflare Workers 経由で D1 にアクセスし、キャッシュを作成**  
✅ **キャッシュがない場合は D1 からデータを取得してキャッシュを作成**  
✅ **Astro.js の SSR により SEO にも対応**  
✅ **Cloudflare の無料枠を活用し、運用コストを抑える**

この方法なら、**コストを抑えつつ、SEO に強く、高速なハーブ紹介サイト** を構築できます！ 🚀
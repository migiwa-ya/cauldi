# Cauldi

[Cauldi](https://cauldi.com/) は Astro フレームワークと [StaticQL](https://github.com/migiwa-ya/staticql) を用いて構築されたサンプルサイトです。  
このサンプルでは、SSG (`src/pages/index.astro` など)、CSR (`src/components/ListNewsInfinite.tsx` など)で同じ StaticQL のクエリインターフェースを利用してコンテンツを取得・表示しています。  

**検索のためにサーバーは不要**です。速度を求めないならコストを極限まで抑えられます。
Cauldi は外部に CMS を持たず、コンテンツの管理・検索は GitHub Pages で公開されている静的ファイルだけで行われています。  

コンテンツは `public/content` で管理しており、「ハーブデータ `public/content/herbs/*.md`」、「ハーブのレポートデータ `public/content/reports/**/*.md`」のようなデータ同士のリレーションを `public/staticql.config.json` で管理しており、コンテンツの配置や検索情報を「インデックスデータ `public/index`」で管理しています。  
これを処理することで StaticQL は異なるランタイムで同じインターフェースによる検索を可能にしています。  

-- ハーブテーブル
CREATE TABLE herbs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_jp TEXT NOT NULL,
    name_common_jp TEXT,
    name_scientific TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    compound_id INTEGER,
    <!-- flavor_profile TEXT, -->
    research_papers TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (compound_id) REFERENCES compounds(id) ON DELETE SET NULL
);

-- ハーブ画像テーブル
CREATE TABLE herb_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    herb_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    name TEXT,
    caption TEXT,
    FOREIGN KEY (herb_id) REFERENCES herbs(id) ON DELETE CASCADE
);

-- 成分テーブル
CREATE TABLE compounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    effect TEXT NOT NULL,
    research_papers TEXT
);

-- レポートテーブル
CREATE TABLE reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    summary TEXT,
    usage_method_id INTEGER,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usage_method_id) REFERENCES usage_methods(id) ON DELETE SET NULL
);

-- レポート画像テーブル
CREATE TABLE report_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    name TEXT,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

-- レポートとハーブの関連テーブル（多対多）
CREATE TABLE report_herbs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    herb_id INTEGER NOT NULL,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (herb_id) REFERENCES herbs(id) ON DELETE CASCADE
);

-- レポートの風味評価テーブル
CREATE TABLE herb_report_flavors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    bitterness INTEGER CHECK (bitterness BETWEEN 0 AND 10),
    sweetness INTEGER CHECK (sweetness BETWEEN 0 AND 10),
    sourness INTEGER CHECK (sourness BETWEEN 0 AND 10),
    spiciness INTEGER CHECK (spiciness BETWEEN 0 AND 10),
    astringency INTEGER CHECK (astringency BETWEEN 0 AND 10),
    umami INTEGER CHECK (umami BETWEEN 0 AND 10),
    aroma_type TEXT,
    aroma_intensity INTEGER CHECK (aroma_intensity BETWEEN 0 AND 10),
    aftertaste TEXT,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

-- 利用方法テーブル
CREATE TABLE usage_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

-- タグマスターテーブル
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT CHECK (type IN ('flavor', 'mood', 'time', 'health')),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ハーブとタグの関連付けテーブル（多対多）
CREATE TABLE herb_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    herb_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (herb_id) REFERENCES herbs(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE (herb_id, tag_id)
);

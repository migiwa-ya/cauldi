-- ハーブテーブル
CREATE TABLE herbs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_jp VARCHAR(255) NOT NULL,
    name_common_jp VARCHAR(255),
    name_scientific VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description TEXT,
    compound_id INT,
    flavor_profile TEXT,
    research_papers TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (compound_id) REFERENCES compounds(id)
);

-- ハーブ画像テーブル
CREATE TABLE herb_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    herb_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    name VARCHAR(255),
    caption TEXT,
    FOREIGN KEY (herb_id) REFERENCES herbs(id) ON DELETE CASCADE
);

-- 成分テーブル
CREATE TABLE compounds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    effect TEXT NOT NULL,
    research_papers TEXT
);

-- レポートテーブル
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    summary TEXT,
    usage_method_id INT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usage_method_id) REFERENCES usage_methods(id)
);

-- レポート画像テーブル
CREATE TABLE report_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    name VARCHAR(255),
    caption TEXT,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

-- レポートとハーブの関連テーブル
CREATE TABLE report_herbs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    herb_id INT NOT NULL,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (herb_id) REFERENCES herbs(id) ON DELETE CASCADE
);

-- レポートの風味評価テーブル
CREATE TABLE herb_report_flavors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    bitterness INT CHECK (bitterness BETWEEN 0 AND 10),
    sweetness INT CHECK (sweetness BETWEEN 0 AND 10),
    sourness INT CHECK (sourness BETWEEN 0 AND 10),
    spiciness INT CHECK (spiciness BETWEEN 0 AND 10),
    astringency INT CHECK (astringency BETWEEN 0 AND 10),
    umami INT CHECK (umami BETWEEN 0 AND 10),
    aroma_type VARCHAR(255),
    aroma_intensity INT CHECK (aroma_intensity BETWEEN 0 AND 10),
    aftertaste VARCHAR(255),
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

-- 利用方法テーブル
CREATE TABLE usage_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);
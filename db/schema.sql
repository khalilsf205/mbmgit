-- Articles table
CREATE TABLE IF NOT EXISTS article (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(20),
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Fournisseurs table
CREATE TABLE IF NOT EXISTS fournisseur (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clients table (if not already exists)
CREATE TABLE IF NOT EXISTS client (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bon de Livraison table
CREATE TABLE IF NOT EXISTS bon_livraison (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  client_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES client(id)
);

-- Bon de Livraison Items table
CREATE TABLE IF NOT EXISTS bon_livraison_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bon_livraison_id INT NOT NULL,
  article_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (bon_livraison_id) REFERENCES bon_livraison(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES article(id)
);

-- Bon de Reception table
CREATE TABLE IF NOT EXISTS bon_reception (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  fournisseur_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (fournisseur_id) REFERENCES fournisseur(id)
);

-- Bon de Reception Items table
CREATE TABLE IF NOT EXISTS bon_reception_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bon_reception_id INT NOT NULL,
  article_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (bon_reception_id) REFERENCES bon_reception(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES article(id)
);


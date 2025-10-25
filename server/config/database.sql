CREATE SCHEMA IF NOT EXISTS crobs;

CREATE TABLE IF NOT EXISTS crobs.crobs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    planting_time VARCHAR(100),
    harvest_time VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO crobs.crobs (name, description, category, planting_time, harvest_time) VALUES
('Winterweizen', 'Winterweizen ist eine Getreideart, die im Herbst gesaet wird und im Sommer geerntet wird.', 'Getreide', 'Aussaat Oktober', 'Ernte Juli'),
('Roggen', 'Roggen ist ein robustes Getreide, das oft fuer Brot und Tierfutter verwendet wird.', 'Getreide', 'Winterhart und anspruchslos', ''),
('Gerste', 'Gerste wird haeufig fuer die Bierherstellung und als Tierfutter angebaut.', 'Getreide', 'Aussaat Maerz-April', 'Ernte Juli-August'),
('Mais', 'Mais ist eine vielseitige Kulturpflanze, die sowohl fuer Lebensmittel als auch fuer Biokraftstoffe genutzt wird.', 'Getreide', 'Aussaat April-Mai', 'Ernte September-Oktober'),
('Kartoffeln', 'Kartoffeln sind eine wichtige Knollenfrucht, die weltweit als Grundnahrungsmittel dient.', 'Hackfrucht', 'Aussaat Maerz-Mai', 'Ernte August-Oktober'),
('Zuckerrueben', 'Zuckerrueben werden zur Herstellung von Zucker und Ethanol angebaut.', 'Hackfrucht', 'Aussaat Maerz-April', 'Ernte September-November'),
('Sonnenblumen', 'Sonnenblumen werden fuer ihre Samen und die Oelproduktion geschaetzt.', 'Oelpflanze', 'Aussaat April-Mai', 'Ernte September-Oktober'),
('Raps', 'Raps wird hauptsaechlich fuer die Herstellung von Speiseoel und Biodiesel angebaut.', 'Oelpflanze', 'Aussaat August-September', 'Ernte Juli-August'),
('Hafer', 'Hafer ist ein Getreide, das haeufig fuer Fruehstuecksflocken und Tierfutter verwendet wird.', 'Getreide', 'Aussaat Februar-April', 'Ernte Juli-September'),
('Dinkel', 'Dinkel ist eine alte Getreideart, die fuer ihre Naehrstoffe und ihren milden Geschmack geschaetzt wird.', 'Getreide', 'Aussaat September-Oktober', 'Ernte Juli-August'),
('Sojabohnen', 'Sojabohnen sind eine wichtige Proteinquelle und werden fuer Lebensmittel und Tierfutter verwendet.', 'Huelsenfrucht', 'Aussaat April-Mai', 'Ernte September-Oktober'),
('Erbsen', 'Erbsen sind eine Huelsenfrucht, die sowohl frisch als auch getrocknet verwendet wird.', 'Huelsenfrucht', 'Aussaat Maerz-April', 'Ernte Juni-August'),
('Linsen', 'Linsen sind eine proteinreiche Huelsenfrucht, die in vielen Gerichten verwendet wird.', 'Huelsenfrucht', 'Aussaat April-Mai', 'Ernte August-September'),
('Klee', 'Klee wird oft als Futterpflanze und zur Bodenverbesserung angebaut.', 'Futterpflanze', 'Aussaat April', 'Ernte September'),
('Luzerne', 'Luzerne ist eine mehrjaehrige Futterpflanze, die reich an Naehrstoffen ist.', 'Futterpflanze', 'Aussaat Maerz-September', 'Mehrjaehrig');

CREATE TABLE IF NOT EXISTS crobs.benutzer (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    location text
);

CREATE TABLE IF NOT EXISTS crobs.selected (
    user_id INTEGER NOT NULL,
    crop_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, crop_id),
    FOREIGN KEY (user_id) REFERENCES crobs.benutzer(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crobs.crobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crobs.tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tasks TEXT,
    completed BOOLEAN DEFAULT false,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority TEXT,
    FOREIGN KEY (user_id) REFERENCES crobs.benutzer(id) ON DELETE CASCADE
);
-- =============================================================================
-- Seed: veiculo_marca + veiculo_modelo
-- Marcas e modelos comercializados no Brasil (mercado atual e recente).
--
-- Estratégia:
--   1. INSERT das marcas com ON CONFLICT DO NOTHING (idempotente).
--   2. INSERT dos modelos resolvendo o marca_id via subquery pelo nome da marca,
--      também idempotente via ON CONFLICT DO NOTHING.
--
-- Execute no SQL Editor do Supabase ou via migration.
-- Pode ser re-executado sem duplicar registros.
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. MARCAS
-- =============================================================================

INSERT INTO dealership.veiculo_marca (nome) VALUES
    ('Agrale'),
    ('Alfa Romeo'),
    ('BYD'),
    ('BMW'),
    ('Caoa Chery'),
    ('Chevrolet'),
    ('Chrysler'),
    ('Citroën'),
    ('Dodge'),
    ('Ferrari'),
    ('Fiat'),
    ('Ford'),
    ('GWM'),
    ('Honda'),
    ('Hyundai'),
    ('JAC'),
    ('Jeep'),
    ('Kia'),
    ('Lamborghini'),
    ('Land Rover'),
    ('Lexus'),
    ('Lifan'),
    ('Maserati'),
    ('Mercedes-Benz'),
    ('Mitsubishi'),
    ('Nissan'),
    ('Peugeot'),
    ('Porsche'),
    ('RAM'),
    ('Renault'),
    ('Rolls-Royce'),
    ('Smart'),
    ('Subaru'),
    ('Suzuki'),
    ('Toyota'),
    ('Troller'),
    ('Volkswagen'),
    ('Volvo'),
    ('Yamaha')
ON CONFLICT (nome) DO NOTHING;


-- =============================================================================
-- 2. MODELOS
--    Cada bloco usa uma subquery para resolver o marca_id pelo nome da marca.
--    ON CONFLICT (marca_id, nome) DO NOTHING garante idempotência.
-- =============================================================================

-- ─── Agrale ──────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Marruá AM 200'),
    ('Marruá AM 300')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Agrale'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Alfa Romeo ──────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Giulia'),
    ('Giulietta'),
    ('Stelvio'),
    ('Tonale')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Alfa Romeo'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── BYD ─────────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Atto 3'),
    ('Dolphin'),
    ('Dolphin Mini'),
    ('Han'),
    ('King'),
    ('Sea'),
    ('Seal'),
    ('Song Plus'),
    ('Tan'),
    ('Yuan Plus')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'BYD'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── BMW ─────────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('116i'),
    ('118i'),
    ('120i'),
    ('218i'),
    ('220i'),
    ('320i'),
    ('330i'),
    ('420i'),
    ('430i'),
    ('520i'),
    ('530i'),
    ('540i'),
    ('630i GT'),
    ('730i'),
    ('740i'),
    ('750i'),
    ('M2'),
    ('M3'),
    ('M4'),
    ('M5'),
    ('M8'),
    ('X1'),
    ('X2'),
    ('X3'),
    ('X4'),
    ('X5'),
    ('X6'),
    ('X7'),
    ('Z4'),
    ('iX'),
    ('iX1'),
    ('iX3'),
    ('i3'),
    ('i4'),
    ('i5'),
    ('i7')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'BMW'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Caoa Chery ──────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Arrizo 3'),
    ('Arrizo 6'),
    ('Omoda 5'),
    ('Tiggo 2 Pro'),
    ('Tiggo 3X'),
    ('Tiggo 5X'),
    ('Tiggo 7 Pro'),
    ('Tiggo 8 Pro'),
    ('Tiggo 8 Pro Max')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Caoa Chery'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Chevrolet ───────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Agile'),
    ('Blazer'),
    ('Camaro'),
    ('Captiva'),
    ('Cobalt'),
    ('Cruze'),
    ('Equinox'),
    ('Montana'),
    ('Onix'),
    ('Onix Plus'),
    ('S10'),
    ('Spin'),
    ('Tracker'),
    ('Trailblazer'),
    ('Traverse'),
    ('Trax')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Chevrolet'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Chrysler ────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('300C'),
    ('Pacifica')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Chrysler'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Citroën ─────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Berlingo'),
    ('C3'),
    ('C3 Aircross'),
    ('C4 Cactus'),
    ('C5 Aircross'),
    ('Jumpy'),
    ('SpaceTourer')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Citroën'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Dodge ───────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Challenger'),
    ('Charger'),
    ('Durango'),
    ('Journey'),
    ('RAM 1500'),
    ('RAM 2500')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Dodge'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Ferrari ─────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('296 GTB'),
    ('296 GTS'),
    ('812 Competizione'),
    ('812 GTS'),
    ('812 Superfast'),
    ('F8 Spider'),
    ('F8 Tributo'),
    ('Portofino M'),
    ('Purosangue'),
    ('Roma'),
    ('SF90 Spider'),
    ('SF90 Stradale')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Ferrari'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Fiat ────────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Argo'),
    ('Bravo'),
    ('Cronos'),
    ('Doblò'),
    ('Ducato'),
    ('Fastback'),
    ('Fiorino'),
    ('Idea'),
    ('Linea'),
    ('Mobi'),
    ('Palio'),
    ('Pulse'),
    ('Punto'),
    ('Scudo'),
    ('Siena'),
    ('Strada'),
    ('Toro'),
    ('Uno')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Fiat'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Ford ────────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Bronco'),
    ('Bronco Sport'),
    ('EcoSport'),
    ('Edge'),
    ('Explorer'),
    ('F-150'),
    ('F-150 Lightning'),
    ('Fusion'),
    ('Ka'),
    ('Maverick'),
    ('Mustang'),
    ('Mustang Mach-E'),
    ('Ranger'),
    ('Territory'),
    ('Transit')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Ford'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── GWM ─────────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Haval H6'),
    ('Haval H6 GT'),
    ('Haval Jolion'),
    ('ORA 03'),
    ('Poer'),
    ('Tank 300'),
    ('Tank 500')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'GWM'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Honda ───────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Accord'),
    ('City'),
    ('City Hatch'),
    ('Civic'),
    ('CR-V'),
    ('Fit'),
    ('HR-V'),
    ('Odyssey'),
    ('Pilot'),
    ('WR-V'),
    ('ZR-V')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Honda'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Hyundai ─────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Azera'),
    ('Creta'),
    ('Elantra'),
    ('HB20'),
    ('HB20S'),
    ('HB20X'),
    ('Ioniq 5'),
    ('Ioniq 6'),
    ('i30'),
    ('ix35'),
    ('Nexo'),
    ('Santa Fe'),
    ('Sonata'),
    ('Staria'),
    ('Tucson'),
    ('Veloster')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Hyundai'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── JAC ─────────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('e-JS1'),
    ('JS4'),
    ('T8 Pro'),
    ('T9')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'JAC'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Jeep ────────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Avenger'),
    ('Commander'),
    ('Compass'),
    ('Gladiator'),
    ('Grand Cherokee'),
    ('Renegade'),
    ('Wrangler')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Jeep'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Kia ─────────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Carnival'),
    ('EV6'),
    ('EV9'),
    ('K3'),
    ('K5'),
    ('Niro'),
    ('Sorento'),
    ('Soul'),
    ('Sportage'),
    ('Stinger'),
    ('Telluride')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Kia'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Lamborghini ─────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Huracán'),
    ('Revuelto'),
    ('Urus')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Lamborghini'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Land Rover ──────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Defender'),
    ('Discovery'),
    ('Discovery Sport'),
    ('Freelander 2'),
    ('Range Rover'),
    ('Range Rover Evoque'),
    ('Range Rover Sport'),
    ('Range Rover Velar')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Land Rover'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Lexus ───────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('ES 300h'),
    ('IS 300'),
    ('IS 350'),
    ('LX 600'),
    ('NX 200t'),
    ('NX 250'),
    ('NX 350h'),
    ('NX 450h+'),
    ('RX 350'),
    ('RX 450h'),
    ('RX 500h'),
    ('UX 250h')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Lexus'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Lifan ───────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('X60'),
    ('X70'),
    ('X80'),
    ('320'),
    ('530'),
    ('720')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Lifan'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Maserati ────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Ghibli'),
    ('GranCabrio'),
    ('GranTurismo'),
    ('Grecale'),
    ('Levante'),
    ('MC20'),
    ('Quattroporte')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Maserati'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Mercedes-Benz ───────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('A 200'),
    ('A 250'),
    ('AMG A 45 S'),
    ('AMG C 43'),
    ('AMG C 63'),
    ('AMG E 53'),
    ('AMG GLC 43'),
    ('AMG GLE 53'),
    ('AMG GT'),
    ('AMG GT 4 Portas'),
    ('B 200'),
    ('C 180'),
    ('C 200'),
    ('C 300'),
    ('CLA 200'),
    ('CLA 250'),
    ('CLE 200'),
    ('CLE 300'),
    ('E 200'),
    ('E 300'),
    ('EQA'),
    ('EQA 250+'),
    ('EQB'),
    ('EQC'),
    ('EQE'),
    ('EQS'),
    ('G 500'),
    ('GLA 200'),
    ('GLA 250'),
    ('GLB 200'),
    ('GLC 200'),
    ('GLC 300'),
    ('GLE 450'),
    ('GLS 450'),
    ('S 450'),
    ('S 500'),
    ('Sprinter'),
    ('Vito')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Mercedes-Benz'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Mitsubishi ──────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('ASX'),
    ('Eclipse Cross'),
    ('L200 Triton'),
    ('L200 Triton Sport'),
    ('Lancer'),
    ('Outlander'),
    ('Pajero Dakar'),
    ('Pajero Full'),
    ('Pajero Sport')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Mitsubishi'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Nissan ──────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Frontier'),
    ('GT-R'),
    ('Kicks'),
    ('Leaf'),
    ('March'),
    ('Sentra'),
    ('Versa'),
    ('X-Trail')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Nissan'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Peugeot ─────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('208'),
    ('2008'),
    ('3008'),
    ('408'),
    ('5008'),
    ('Expert'),
    ('Landtrek'),
    ('Partner')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Peugeot'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Porsche ─────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('718 Boxster'),
    ('718 Cayman'),
    ('911'),
    ('Cayenne'),
    ('Cayenne Coupé'),
    ('Macan'),
    ('Panamera'),
    ('Taycan'),
    ('Taycan Cross Turismo')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Porsche'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── RAM ─────────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('1500'),
    ('2500'),
    ('Rampage'),
    ('ProMaster')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'RAM'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Renault ─────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Captur'),
    ('Clio'),
    ('Duster'),
    ('Fluence'),
    ('Kangoo'),
    ('Kardian'),
    ('Kwid'),
    ('Logan'),
    ('Master'),
    ('Megane'),
    ('Oroch'),
    ('Sandero'),
    ('Symbol'),
    ('Zoe')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Renault'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Rolls-Royce ─────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Cullinan'),
    ('Ghost'),
    ('Phantom'),
    ('Spectre'),
    ('Wraith')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Rolls-Royce'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Smart ───────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('#1'),
    ('#3'),
    ('Fortwo')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Smart'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Subaru ──────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('BRZ'),
    ('Forester'),
    ('Impreza'),
    ('Legacy'),
    ('Outback'),
    ('WRX'),
    ('XV')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Subaru'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Suzuki ──────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Baleno'),
    ('Fronx'),
    ('Grandvitara'),
    ('Jimny'),
    ('S-Cross'),
    ('Swift'),
    ('Vitara')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Suzuki'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Toyota ──────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('bZ4X'),
    ('Camry'),
    ('Corolla'),
    ('Corolla Cross'),
    ('Etios'),
    ('Fielder'),
    ('GR86'),
    ('GR Corolla'),
    ('GR Supra'),
    ('Hilux'),
    ('Hilux SW4'),
    ('Land Cruiser'),
    ('Prius'),
    ('RAV4'),
    ('Sequoia'),
    ('Tundra'),
    ('Yaris'),
    ('Yaris Cross')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Toyota'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Troller ─────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('T4')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Troller'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Volkswagen ──────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Amarok'),
    ('Arteon'),
    ('Fox'),
    ('Gol'),
    ('Golf'),
    ('Golf GTI'),
    ('Golf GTE'),
    ('ID.4'),
    ('ID.5'),
    ('ID.6'),
    ('Jetta'),
    ('Nivus'),
    ('Polo'),
    ('Polo Track'),
    ('Saveiro'),
    ('T-Cross'),
    ('Taos'),
    ('Tiguan'),
    ('Touareg'),
    ('Transporter'),
    ('Virtus'),
    ('Voyage')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Volkswagen'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Volvo ───────────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('C40 Recharge'),
    ('EX30'),
    ('EX40'),
    ('EX90'),
    ('S60'),
    ('S90'),
    ('V60'),
    ('V90 Cross Country'),
    ('XC40'),
    ('XC40 Recharge'),
    ('XC60'),
    ('XC90')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Volvo'
ON CONFLICT (marca_id, nome) DO NOTHING;

-- ─── Yamaha (quadriciclos/UTVs vendidos como veículos) ───────────────────────
INSERT INTO dealership.veiculo_modelo (marca_id, nome)
SELECT id, m.nome FROM dealership.veiculo_marca, (VALUES
    ('Grizzly 700'),
    ('Viking 700'),
    ('YXZ1000R')
) AS m(nome)
WHERE dealership.veiculo_marca.nome = 'Yamaha'
ON CONFLICT (marca_id, nome) DO NOTHING;


COMMIT;

-- 1. Conceder uso do schema para o role anon e authenticated
GRANT USAGE ON SCHEMA dealership TO anon, authenticated, service_role;

-- 2. Conceder permissões nas tabelas
GRANT ALL ON ALL TABLES IN SCHEMA dealership TO anon, authenticated, service_role;

-- 3. Conceder permissões em sequências (para UUIDs gerados por gen_random_uuid não precisam, mas por garantia)
GRANT ALL ON ALL SEQUENCES IN SCHEMA dealership TO anon, authenticated, service_role;

-- 4. Garantir permissões para tabelas futuras também
ALTER DEFAULT PRIVILEGES IN SCHEMA dealership
  GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA dealership
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
-- Veiculo
--
CREATE INDEX idx_veiculo_empresa_id 
ON dealership.veiculo (empresa_id);

CREATE INDEX idx_veiculo_marca_id 
ON dealership.veiculo (marca_veiculo_id);

CREATE INDEX idx_veiculo_modelo_id 
ON dealership.veiculo (modelo_veiculo_id);

CREATE INDEX idx_veiculo_combustivel_id 
ON dealership.veiculo (combustivel_veiculo_id);

CREATE INDEX idx_veiculo_cambio_id 
ON dealership.veiculo (cambio_veiculo_id);

CREATE INDEX idx_veiculo_situacao_id 
ON dealership.veiculo (situacao_veiculo_id);


-- Usuario
--
CREATE INDEX idx_usuario_empresa_id 
ON dealership.usuario (empresa_id);

CREATE INDEX idx_usuario_papel_id 
ON dealership.usuario (papel_id);


-- Veiculo foto
--
CREATE INDEX idx_veiculo_foto_veiculo_id 
ON dealership.veiculo_foto (veiculo_id);


-- QR Code
--
CREATE INDEX idx_qr_code_veiculo_id 
ON dealership.qr_code (veiculo_id);
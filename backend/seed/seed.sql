USE confeitaria_db;

INSERT INTO categorias (nome) VALUES ('Doces'), ('Bolos'), ('Salgados');

INSERT INTO insumos (nome, unidade_medida, quantidade_atual, quantidade_minima, custo_unitario) VALUES
('Leite condensado', 'ml', 2000, 500, 0.02),
('Massa de cone', 'unidade', 50, 10, 0.80),
('Chocolate granulado', 'g', 3000, 500, 0.01),
('Morango', 'g', 1000, 200, 0.03);

INSERT INTO produtos (nome, descricao, preco, categoria_id, imagem_url) VALUES
('Cone doce tradicional', 'Cone recheado com leite condensado e granulado', 8.50, 1, 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=800&q=80'),
('Cone doce com morango', 'Cone recheado com leite condensado e morango', 10.00, 1, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80');

INSERT INTO produto_insumo (produto_id, insumo_id, quantidade_necessaria) VALUES
(1, 2, 1), (1, 1, 40), (1, 3, 15),
(2, 2, 1), (2, 1, 40), (2, 4, 30);

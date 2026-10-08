insert into niveis (numero, nome, pontos_min) values
  (1, 'Benevolente', 0), (2, 'Caridoso', 100), (3, 'Magnânimo', 300), (4, 'Filantropo', 600), (5, '?', 1000);

-- exemplos do protótipo; troque pelas instituições reais do piloto
insert into instituicoes (nome, cidade) values ('Biblioteca parceira (exemplo)', null), ('ONG parceira (exemplo)', null);
insert into pontos_coleta (instituicao_id, nome)
  select id, nome from instituicoes;

insert into trilhas (titulo, ordem) values ('Trilha 1 - O Economista', 1);

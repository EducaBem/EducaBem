# Capas dos livros

As 12 capas já estão nesta pasta (`.jpg`). Este guia serve para trocar ou adicionar capas depois.

## Jeito rápido: baixar tudo de uma vez

Na raiz do projeto, com internet e Node 18+:

```
node scripts/baixar-capas.mjs
```

O script busca a capa de cada livro (Google Books em português; Open Library como reserva),
salva aqui com o nome certo e **imprime qual título encontrou para cada um**.
Confira a lista: se alguma capa vier do livro errado, apague o arquivo e coloque a certa à mão.
Depois é só fazer o commit desta pasta. Use `--forcar` para baixar de novo as que já existem.

As capas que não forem encontradas continuam aparecendo com título e autor, então nada quebra.

## Jeito manual

Coloque as imagens nesta pasta com **exatamente** estes nomes
(aceita `.jpg`, `.jpeg`, `.png`, `.webp` ou `.avif`):

| Arquivo | Livro |
|---|---|
| pai-rico-pai-pobre | Pai Rico, Pai Pobre |
| o-homem-mais-rico-da-babilonia | O Homem Mais Rico da Babilônia |
| do-mil-ao-milhao | Do Mil ao Milhão |
| a-psicologia-financeira | A Psicologia Financeira |
| me-poupe | Me Poupe! |
| os-segredos-da-mente-milionaria | Os Segredos da Mente Milionária |
| quem-pensa-enriquece | Quem Pensa Enriquece |
| o-investidor-inteligente | O Investidor Inteligente |
| casais-inteligentes-enriquecem-juntos | Casais Inteligentes Enriquecem Juntos |
| dinheiro-os-segredos-de-quem-tem | Dinheiro: Os Segredos de Quem Tem |
| como-organizar-sua-vida-financeira | Como Organizar Sua Vida Financeira |
| o-milionario-mora-ao-lado | O Milionário Mora ao Lado |

Dicas:
- Proporção ideal: ~11:16 (ex.: 550 x 800 px). Outras proporções são cortadas no centro.
- Mantenha cada arquivo abaixo de ~150 KB para a página carregar rápido.
- Sem a imagem, o site mostra uma capa com título e autor, então nada quebra.

# Tokyo Ghoul EVO - Ficha de RPG (v2)

Este repositório contém a implementação de uma ficha de personagem interativa e dinâmica para o RPG de mesa **Tokyo Ghoul EVO**. Desenvolvida como uma Single-Page Application (SPA), a ficha visa otimizar a gestão de personagens, atributos, perícias, Kagunes, inventário e um sistema exclusivo de 'Espólios de Batalha'.

## Visão Geral do Projeto

O projeto é estruturado em um frontend web puro, utilizando HTML, CSS e JavaScript. Ele oferece uma interface intuitiva para jogadores e mestres, permitindo a criação, edição e acompanhamento detalhado de personagens no universo de Tokyo Ghoul EVO. A funcionalidade de exportação e importação de dados garante persistência e portabilidade das fichas.

## Arquitetura e Tecnologias

### Frontend

*   **HTML5**: Estrutura semântica da ficha, organizada em seções para dados do personagem, atributos, perícias, espólios, Kagune e inventário.
*   **CSS3**: Estilização responsiva com tema escuro (`styles.css`), garantindo uma experiência de usuário consistente em diferentes dispositivos. Inclui animações e efeitos visuais para elementos como os 'rank badges' dos espólios.
*   **JavaScript (Vanilla JS)**: Lógica de negócio e interatividade da ficha (`script.js`). Responsável por:
    *   Cálculo dinâmico de atributos e perícias com base em nível, raça, facção e bônus de Kagune.
    *   Gestão do sistema de 'Espólios de Batalha', incluindo desbloqueio, ativação e aplicação de bônus.
    *   Funcionalidades de exportação e importação de dados da ficha em formato JSON.
    *   Manipulação do DOM para atualização em tempo real dos valores e estados da ficha.

### Sistema de Espólios de Batalha

Um componente central do projeto é o sistema de 'Espólios de Batalha', definido em `espolios.js`. Este arquivo atua como um banco de dados em JavaScript, contendo definições de espólios com:

*   **ID e Título**: Identificadores únicos e nomes descritivos.
*   **Rank e Nível Máximo**: Classificação e progressão do espólio.
*   **Thresholds**: Requisitos para desbloqueio e avanço de nível.
*   **Bônus**: Atributos, perícias, itens únicos ou habilidades concedidas ao personagem.
*   **Restrições**: Raça e facção específicas para a aplicação do espólio.

### Ferramenta de Edição de Espólios

O projeto inclui uma ferramenta dedicada (`Editor_Espolios.html` e `stylesEditorEspolios.css`) para a criação e gestão dos 'Espólios de Batalha'. Este editor permite:

*   Visualização e edição de todos os espólios definidos.
*   Definição de bônus por nível, requisitos e restrições.
*   Exportação dos dados de espólios em formatos JSON ou JavaScript (para integração direta com `espolios.js`).

## Estrutura de Arquivos

```
. 
├── index.html                  # Interface principal da ficha de personagem
├── styles.css                  # Estilos CSS para a ficha principal
├── script.js                   # Lógica JavaScript principal da ficha
├── espolios.js                 # Definições dos 'Espólios de Batalha'
├── Editor_Espolios.html        # Interface do editor de espólios
└── stylesEditorEspolios.css    # Estilos CSS para o editor de espólios
```

## Como Usar

1.  **Abrir a Ficha**: Basta abrir o arquivo `index.html` em qualquer navegador web moderno.
2.  **Preencher Dados**: Insira as informações do seu personagem nos campos designados.
3.  **Exportar/Importar**: Utilize os botões na barra lateral para salvar (`.json`) ou carregar (`.json`) o progresso da sua ficha.
4.  **Editar Espólios (para Mestres/Desenvolvedores)**: Abra `Editor_Espolios.html` para gerenciar e criar novos espólios. Exporte o arquivo `.js` gerado e substitua `espolios.js` no diretório principal para atualizar as definições na ficha.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues para sugestões, bugs ou melhorias. Pull requests são encorajados para novas funcionalidades ou otimizações.


// espolios.js (modo global, funciona sem servidor)
window.ESPOLIOS_DEFINITIONS = window.ESPOLIOS_DEFINITIONS || {
  "monarca_de_nanites": {
    "id": "monarca_de_nanites",
    "title": "Monarca de Nanite",
    "rank": 3,
    "maxLevel": 3,
    "thresholds": [
      5,
      20,
      1
    ],
    "bonuses": {
      "1": {
        "des": 4,
        "per": 2,
        "rc": 1,
        "ability": "Corrupção de Nanite — Beta",
        "max_minions": 4,
        "minion_template": "Infectado EVO (Comum)",
        "description": "Nanites sintonizam-se ao RC do hospedeiro. Ao perfurar e implantar sua kagune, o corpo é convertido em um agente obediente para executar tarefas utilitárias (patrulha, atacar, monitorar). Lacaios transmitem feed sensorial básico e executam ordens simples."
      },
      "2": {
        "des": 8,
        "per": 4,
        "rc": 3,
        "ability": "Corrupção de Nanite — Alpha",
        "max_minions": 8,
        "minion_template": "Infectado EVO (Tático)",
        "description": "Nanites exploram o RC do hospedeiro para reforçar kagune e córtex motor. Lacaios Alpha executam táticas coordenadas simples e oferecem funções de suporte (bloquear, abrir brecha, prender alvos)."
      },
      "3": {
        "per": 6,
        "rc": 6,
        "des": 12,
        "ability": "Suserania Nanítica — Sigma",
        "max_minions": 12,
        "minion_template": "Infectado EVO (Avançado)",
        "description": "Controle profundo: lacaios Sigma operam com comportamento de enxame, podem executar manobras complexas e usar kagune/armas improvisadas. Hospedeiros com RC e atributos maiores produzem lacaios mais robustos e versáteis."
      }
    },
    "requirements": "Somente Ghouls. Ser exposto repetidamente a nanites e sobreviver a um evento quase-morte com HP entre 1–30.",
    "visibility": "title-only",
    "raceRestriction": [
      "Ghoul Puro",
      "Híbrido"
    ],
    "factionRestriction": [
      "Independente"
    ],
    "description": "O usuário manipula nanites que convertem corpos vivos em agentes funcionais. Lacaios usam o RC e os atributos do hospedeiro como base de sua força. "
  },
  "ryusui_gasai-ken": {
    "id": "ryusui_gasai-ken",
    "title": "Ryusui gasai-ken",
    "rank": 2,
    "maxLevel": 3,
    "thresholds": [
      6,
      12,
      24
    ],
    "bonuses": {
      "1": {
        "for": 5,
        "des": 3,
        "comb-corp": 3,
        "per": 3
      },
      "2": {
        "for": 10,
        "des": 6,
        "per": 6,
        "comb-corp": 6,
        "ability": "Counter: devolva 1/4 do dano de um ataque direto"
      },
      "3": {
        "for": 20,
        "des": 12,
        "comb-corp": 12,
        "comb-dist": 6,
        "esquiva": 5,
        "ability": "Counter: devolve 2/4 do dano de um ataque direto",
        "per": 12,
        "passive": "A cada 1/4 de vida perdida +2 em per e esquiva até o final do combate"
      }
    },
    "requirements": "Ter sessões de treinamento com kamigari Garou\n\n6/12/24",
    "visibility": "full",
    "raceRestriction": [
      "Ghoul Puro"
    ],
    "factionRestriction": [],
    "description": "Usuário da arte marcial Ryusui gasai-ken uma variação de shun shin geki satsu para qualquer tipo de kagune"
  },
  "shun_shin_geki_satsu": {
    "id": "shun_shin_geki_satsu",
    "title": "Shun shin geki satsu",
    "rank": 4,
    "maxLevel": 6,
    "thresholds": [
      6,
      14,
      24,
      36,
      60,
      100
    ],
    "bonuses": {
      "1": {
        "for": 5,
        "des": 3,
        "comb-corp": 3,
        "per": 3
      },
      "2": {
        "for": 10,
        "des": 6,
        "comb-corp": 6,
        "per": 6,
        "ability": "Counter I — devolve 25% do dano recebido de ataques diretos como dano ao atacante (aplica-se apenas a ataques corpo a corpo)"
      },
      "3": {
        "for": 15,
        "des": 9,
        "comb-corp": 9,
        "comb-dist": 3,
        "per": 9,
        "esquiva": 3,
        "ability": "Counter II — devolve 35% do dano; o contra-ataque provoca incapacitação ao alvo (se aplicável)"
      },
      "4": {
        "for": 20,
        "des": 12,
        "comb-corp": 12,
        "comb-dist": 6,
        "per": 12,
        "esquiva": 5,
        "ability": "Counter III agora devolve 45% do dano.",
        "passive": "Defesa Adaptável: pode executar uma ação extra de ataque ou mobilidade em combate."
      },
      "5": {
        "for": 30,
        "des": 18,
        "comb-corp": 15,
        "comb-dist": 9,
        "per": 18,
        "esquiva": 8,
        "ability": "Counter IV — devolve 50% do dano; contra ataques pesados há 33% de chance de causar Sangramento (3d4 por turno, dura 3 turnos).",
        "passive": "A cada 1/4 de vida perdida, ganha +3 de Percepção e +3 em Esquiva até o final do combate (stacka por quartidade)."
      },
      "6": {
        "for": 40,
        "des": 24,
        "comb-corp": 20,
        "comb-dist": 12,
        "per": 24,
        "esquiva": 12,
        "ability": "Shun Shin Geki Satsu — Mastery: desbloqueia a técnica autoral. Uma vez por combate, permite um avanço instantâneo seguido de uma sequência de golpes letais (alto dano único; custo RC alto e usa o turno completo para canalizar se cancelado, perde o RC). Counter V devolve 65% de dano e aplica atordoamento por 1 turno (CD 3 turnos).",
        "passive": "Limit breaker: após o usuario levar uma quantidade suficiente de dano ele começa a se transformar. \"UM MONSTRO!?!\" "
      }
    },
  },
  "dont_you_know_im_still_stand": {
    "id": "dont_you_know_im_still_stand",
    "title": "Dont you know - Im still stand!",
    "rank": 4,
    "maxLevel": 3,
    "thresholds": [
      3,
      8,
      1
    ],
    "bonuses": {
      "1": {
        "for": 2,
        "res": 2,
        "rc": 1,
        "passive": "Sedenta I - O portador adquire habilidade de cura para se manter em combate, cura 2d8 de HP após receber qualquer fonte de cura. (Excesso não sobrepõe HP maximo e perde turno ao se curar).",
        "description": "-Better than i ever did-"
      },
      "2": {
        "for": 4,
        "res": 4,
        "rc": 2,
        "regen": 1,
        "passive": "Sedenta I - Agora também é direcionada ao RC do usuario, pode curar 4d8 de HP/RC após receber qualquer fonte de cura. (Excesso de cura não sobrepõe HP ou RC máximo e perde turno ao se curar).",
        "description": "- Looking like a true survivor -"
      },
      "3": {
        "for": 8,
        "res": 8,
        "rc": 4,
        "ability": "I'm Still Standing - o portador possui 3 salva guardas, a cada vez que ele 'morrer' ele volta a vida com 1 de HP e RC, recuperando 1d8 de HP/RC por turno até o final do combate. (Excesso de cura não sobrepõe HP ou RC máximo).",
        "passive": "Sedenta de Sangue III - Ao atingir o limite de cura uma vez em batalha os ataques do portador se adiquirem 'Sedenta de sangue' onde qualquer fonte de ataque irá roubar a vida dos inimigos, curando o portador em 20% do dano causado. (Excesso de cura não sobrepõe HP ou RC máximo).",
        "description": "- I'm feeling like a little kid -"
      }
    },
    "requirements": "Enfrentar oponentes muito mais fortes (3 / 8 / 1 vezes conforme o nível) e sobreviver mantendo o HP entre 10% e 15% no momento da vitória ou fuga.",
    "visibility": "title-only",
    "raceRestriction": ["Ghoul Puro", "Híbrido"],
    "factionRestriction": ["Sankench"],
    "description": "Um selo que nasce na carne após sorrir para a morte. Golpes mais pesados, sangue que reage e cura que brota no calor da batalha."
  },
}
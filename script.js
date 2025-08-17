// ===================================================================
// FICHA TOKYO GHOUL EVO - SCRIPT ORGANIZADO
// ===================================================================

// ===================================================================
// 1. CONFIGURAÇÕES E CONSTANTES GLOBAIS
// ===================================================================

// Função auxiliar para buscar elementos
function $(id) { return document.getElementById(id) }

// Definições de espólios (carregadas do HTML ou arquivo externo)
window.ESPOLIOS_DEFINITIONS = window.ESPOLIOS_DEFINITIONS || (function(){
  try {
    const el = document.getElementById('espolios-data');
    if (el && el.textContent.trim()) return JSON.parse(el.textContent);
  } catch (err) {
    console.warn('Falha ao parsear #espolios-data:', err);
  }
  return {};
})();

// Atributos do personagem
const ATTRS = [
  { key: 'for', label: 'Força (FOR)' },
  { key: 'des', label: 'Destreza (DES)' },
  { key: 'res', label: 'Resistência (RES)' },
  { key: 'per', label: 'Percepção (PER)' },
  { key: 'int', label: 'Inteligência (INT)' },
  { key: 'car', label: 'Carisma (CAR)' },
  { key: 'rcpot', label: 'Potencial de RC (RC)' }
]

// Lista de perícias do jogo
const SKILLS = [
  'Combate Corpo a Corpo', 'Combate com Quinque', 'Combate com Faca / Melee Light', 'Combate à Distância',
  'Esquiva / Agilidade', 'Stealth / Furtividade', 'Sobrevivência Urbana', 'Investigação e Rastreamento',
  'Conhecimento sobre Ghouls', 'Medicina de Campo', 'Manipulação Social', 'Empatia / Leitura Emocional',
  'Negociação (Mercado Negro)', 'Provocar / Intimidação', 'Ciência (Biologia / Química)', 'Habilidades Manuais (Artesão)',
  'Tecnologia / Hackear', 'Culinária Especial (Antídotos)', 'Nível de Influência (Facção)'
]

// Bônus por facção
const FACCAO_BONUSES = {
  '-- Selecionar --': {},
  'CCG': {
    'Investigação e Rastreamento': 3,
    'Conhecimento sobre Ghouls': 1,
    'Combate com Quinque': 2,
    'Combate Corpo a Corpo': 1,
    'Medicina de Campo': 1,
    'Esquiva / Agilidade': 1
  },
  'Aogiri Tree': {
    'Combate Corpo a Corpo': 2,
    'Provocar / Intimidação': 1,
    'Sobrevivência Urbana': 1,
    'Conhecimento sobre Ghouls': 3,
    'Stealth / Furtividade': 1,
    'Ciência (Biologia / Química)': 1
  },
  'Palhaços (Pierrots)': {
    'Provocar / Intimidação': 2,
    'Negociação (Mercado Negro)': 1,
    'Manipulação Social': 1,
    'Sobrevivência Urbana': 3,
    'Stealth / Furtividade': 1,
    'Combate com Faca / Melee Light': 1
  },
  'Jardim (Sunlit Garden)': {
    'Culinária Especial (Antídotos)': 2,
    'Empatia / Leitura Emocional': 1,
    'Investigação e Rastreamento': 1,
    'Medicina de Campo': 1,
    'Ciência (Biologia / Química)': 1,
    'Combate com Quinque': 3
  },
  'Família Washuu': {
    'Nível de Influência (Facção)': 3,
    'Investigação e Rastreamento': 1,
    'Negociação (Mercado Negro)': 1,
    'Tecnologia / Hackear': 1,
    'Conhecimento sobre Ghouls': 1,
    'Manipulação Social': 2
  },
  'Organização V': {
    'Tecnologia / Hackear': 2,
    'Nível de Influência (Facção)': 1,
    'Investigação e Rastreamento': 1,
    'Combate Corpo a Corpo': 3,
    'Provocar / Intimidação': 1,
    'Stealth / Furtividade': 1
  },
  'Black Goat': {
    'Manipulação Social': 3,
    'Negociação (Mercado Negro)': 2,
    'Empatia / Leitura Emocional': 1,
    'Nível de Influência (Facção)': 1,
    'Investigação e Rastreamento': 1,
    'Conhecimento sobre Ghouls': 1
  },
  'Familia Tsukiyama': {
    'Nível de Influência (Facção)': 3,
    'Culinária Especial (Antídotos)': 2,
    'Negociação (Mercado Negro)': 1,
    'Medicina de Campo': 1,
    'Conhecimento sobre Ghouls': 1,
    'Manipulação Social': 1
  },
  'Irmandade Kirishima': {
    'Combate Corpo a Corpo': 3,
    'Ciência (Biologia / Química)': 2,
    'Conhecimento sobre Ghouls': 1,
    'Esquiva / Agilidade': 1,
    'Sobrevivência Urbana': 1,
    'Provocar / Intimidação': 1
  },
  'Companhia Kuro': {
    'Ciência (Biologia / Química)': 3,
    'Tecnologia / Hackear': 2,
    'Habilidades Manuais (Artesão)': 1,
    'Medicina de Campo': 1,
    'Investigação e Rastreamento': 1,
    'Conhecimento sobre Ghouls': 1
  },
  'Grupo Kamishiro': {
    'Combate Corpo a Corpo': 3,
    'Provocar / Intimidação': 2,
    'Stealth / Furtividade': 1,
    'Sobrevivência Urbana': 1,
    'Conhecimento sobre Ghouls': 1,
    'Esquiva / Agilidade': 1
  },
  'Clã Amon': {
    'Combate Corpo a Corpo': 3,
    'Esquiva / Agilidade': 2,
    'Sobrevivência Urbana': 1,
    'Medicina de Campo': 1,
    'Investigação e Rastreamento': 1,
    'Provocar / Intimidação': 1
  },
  'White Suits': {
    'Combate com Faca / Melee Light': 3,
    'Negociação (Mercado Negro)': 2,
    'Stealth / Furtividade': 1,
    'Manipulação Social': 1,
    'Provocar / Intimidação': 1,
    'Conhecimento sobre Ghouls': 1
  },
  'Falco': {
    'Stealth / Furtividade': 3,
    'Combate à Distância': 2,
    'Negociação (Mercado Negro)': 1,
    'Sobrevivência Urbana': 1,
    'Esquiva / Agilidade': 1,
    'Provocar / Intimidação': 1
  },
  'Sankench': {
    'Provocar / Intimidação': 2,
    'Combate Corpo a Corpo': 3,
    'Conhecimento sobre Ghouls': 1,
    'Sobrevivência Urbana': 1,
    'Esquiva / Agilidade': 2
  },
  'Independente': {},
  'Outro': {}
};

// Bônus por tipo de kagune
const KAGUNE_SKILL_BONUSES = {
  '-- Selecionar --': {},
  'Ukaku': {
    'Combate à Distância': 3,
    'Esquiva / Agilidade': 3,
    'Stealth / Furtividade': 2
  },
  'Koukaku': {
    'Combate com Quinque': 3,
    'Habilidades Manuais (Artesão)': 2,
    'Combate Corpo a Corpo': 1
  },
  'Rinkaku': {
    'Conhecimento sobre Ghouls': 3,
    'Manipulação Social': 2,
    'Empatia / Leitura Emocional': 1,
    'Medicina de Campo': 1
  },
  'Bikaku': {
    'Sobrevivência Urbana': 3,
    'Esquiva / Agilidade': 2,
    'Combate com Faca / Melee Light': 1,
    'Investigação e Rastreamento': 1
  }
};

// Atributos base por tipo de kagune
const KAGUNE_ATTR_BASE = {
  '-- Selecionar --': { for: 0, des: 0, res: 0, per: 0, int: 0, car: 0, rcpot: 0 },
  'Ukaku': { for: 1, des: 3, res: 1, per: 1, int: 1, car: 1, rcpot: 1 },
  'Koukaku': { for: 1, des: 1, res: 3, per: 1, int: 1, car: 1, rcpot: 1 },
  'Rinkaku': { for: 1, des: 1, res: 1, per: 1, int: 1, car: 1, rcpot: 3 },
  'Bikaku': { for: 2, des: 2, res: 2, per: 2, int: 2, car: 2, rcpot: 2 }
};

// Mapeamento de chaves de espólios para nomes de perícias
const ESPOLIO_SKILL_KEY_MAP = {
  'medicina': 'Medicina de Campo',
  'empatia': 'Empatia / Leitura Emocional',
  'investigacao': 'Investigação e Rastreamento',
  'comb_dist': 'Combate à Distância',
  'comb_quinq': 'Combate com Quinque',
  'comb_corpo': 'Combate Corpo a Corpo',
  'comb_faca': 'Combate com Faca / Melee Light',
  'esquiva': 'Esquiva / Agilidade',
  'stealth': 'Stealth / Furtividade',
  'conhecimento_ghouls': 'Conhecimento sobre Ghouls',
  'artesao': 'Habilidades Manuais (Artesão)',
  'hack': 'Tecnologia / Hackear',
  'negociacao': 'Negociação (Mercado Negro)',
  'provocar': 'Provocar / Intimidação',
  'culinaria_antidotos': 'Culinária Especial (Antídotos)',
  'influencia': 'Nível de Influência (Facção)',
  'manipulation': 'Manipulação Social',
  'manipulacao': 'Manipulação Social'
}

// ===================================================================
// 2. ESTADO DO JOGADOR E ESPÓLIOS
// ===================================================================

// Configurações de paginação dos espólios
const ESPOLIOS_PER_PAGE = 4
let espoliosPage = 1

// Estado dos espólios do jogador
let playerEspolios = {
  activePrimary: null,     // id do espólio primário ativo
  activeSecondary: null,   // id do espólio secundário ativo
  unlockedEspolios: {},    // { id: { level: N, progress: X, unlocked: true }, ... }
  progress: {}
}

// ===================================================================
// 3. FUNÇÕES AUXILIARES
// ===================================================================

// Leitura segura de valores do DOM
function readVal(id, asNumber = false) {
  const el = $(id)
  if (!el) return asNumber ? 0 : ''
  const raw = (typeof el.value !== 'undefined') ? el.value : el.textContent
  if (asNumber) return Number(raw) || 0
  return String(raw || '')
}

// Escape HTML para segurança
function escapeHtml(str) { 
  if (!str) return ''; 
  return String(str).replace(/[&<>\"']/g, function (c) { 
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] 
  }) 
}

// Calcula vida estimada (usado por Koukaku)
function estimateVidaFromRes(resTotal, nivel) {
  return Math.floor((resTotal * 14) + (Math.pow(Math.max(1, nivel), 1.1) * 12));
}

// ===================================================================
// 4. FUNÇÕES DE CÁLCULO DE ATRIBUTOS E BÔNUS
// ===================================================================

// Bônus por nível (aplicado apenas a FOR e RES)
function aplicarNivelBonus() { 
  return Math.max(0, (readVal('input-nivel', true) || 1) - 1) 
}

// Bônus de vantagens/desvantagens (placeholder)
function getVantagensDesvantagensBonus(attrKey) { 
  return 0 
}

// Calcula bônus de kagune por nível
function getKaguneBonusesByLevel() {
  const tipo = readVal('input-kagune-tipo') || '-- Selecionar --'
  const nivel = readVal('input-kagune-nivel', true) || 0
  const baseMap = KAGUNE_ATTR_BASE[tipo] || {}
  const extra = Math.floor((Math.max(1, nivel) - 1) / 3)
  const out = {}
  Object.keys(baseMap).forEach(k => { 
    const b = baseMap[k] || 0; 
    out[k] = b > 0 ? b + extra : b 
  })
  return out
}

// ===================================================================
// 5. FUNÇÕES DE ESPÓLIOS
// ===================================================================

// Retorna o espólio primário ativo
function getActivePrimary() {
  return playerEspolios.activePrimary;
}

// Verifica se um espólio pode ser secundário (rank <= 3)
function isSecondaryEligible(espolio) {
  return espolio && espolio.rank <= 3;
}

// Calcula threshold para bônus secundário
function secondaryBonusThreshold(espolio) {
  return Math.min(3, espolio?.maxLevel || 3);
}

// Retorna bônus de atributo dos espólios ativos
function getEspolioBonus(attrKey) {
  let total = 0;

  // Espólio primário
  const primaryId = getActivePrimary();
  if (primaryId) {
    const esp = ESPOLIOS_DEFINITIONS[primaryId];
    const playerData = playerEspolios.unlockedEspolios[primaryId];
    const lvl = playerData ? (playerData.level || 1) : 0;
    const b = esp && esp.bonuses && esp.bonuses[lvl.toString()] ? esp.bonuses[lvl.toString()] : {};
    const map = { 'for': 'for', 'des': 'des', 'res': 'res', 'per': 'per', 'int': 'int', 'car': 'car', 'rcpot': 'rc' };
    const key = map[attrKey];
    if (b && key && b[key]) total += Number(b[key]) || 0;
  }

  // Espólio secundário (só se atingiu threshold)
  const secId = playerEspolios.activeSecondary;
  if (secId) {
    const espS = ESPOLIOS_DEFINITIONS[secId];
    const pdS = playerEspolios.unlockedEspolios[secId];
    if (espS && pdS) {
      const lvlS = pdS.level || 1;
      const threshold = secondaryBonusThreshold(espS);
      if (lvlS >= threshold) {
        const bS = espS.bonuses && espS.bonuses[lvlS.toString()] ? espS.bonuses[lvlS.toString()] : {};
        const map = { 'for': 'for', 'des': 'des', 'res': 'res', 'per': 'per', 'int': 'int', 'car': 'car', 'rcpot': 'rc' };
        const key = map[attrKey];
        if (bS && key && bS[key]) total += Number(bS[key]) || 0;
      }
    }
  }

  return total;
}

// Retorna bônus de perícias dos espólios ativos
function getEspolioSkillBonuses() {
  const out = {};

  // Helper para juntar bônus de um espólio
  function joinBonusesFrom(espolioId, useIfLevelMeetsThreshold = false) {
    if (!espolioId) return;
    const esp = ESPOLIOS_DEFINITIONS[espolioId];
    const pdata = playerEspolios.unlockedEspolios[espolioId];
    if (!esp || !pdata) return;
    const lvl = pdata.level || 1;
    
    // Verificar threshold para secundário
    if (useIfLevelMeetsThreshold) {
      const thr = secondaryBonusThreshold(esp);
      if (lvl < thr) return;
    }
    
    const bonuses = esp.bonuses && esp.bonuses[lvl.toString()] ? esp.bonuses[lvl.toString()] : {};
    Object.entries(bonuses).forEach(([k, v]) => {
      // Mapear para nomes de perícias
      if (SKILLS.includes(k)) {
        out[k] = (out[k] || 0) + Number(v);
        return;
      }
      const mapped = ESPOLIO_SKILL_KEY_MAP[k];
      if (mapped && SKILLS.includes(mapped)) {
        out[mapped] = (out[mapped] || 0) + Number(v);
      }
    });
  }

  // Aplicar primário e secundário
  const p = getActivePrimary();
  if (p) joinBonusesFrom(p, false);
  
  const s = playerEspolios.activeSecondary;
  if (s) joinBonusesFrom(s, true);

  return out;
}

// Retorna bônus de perícias para um espólio específico
function getEspolioSkillBonusesFor(espolioId, level = 1) {
  const esp = ESPOLIOS_DEFINITIONS[espolioId]
  if (!esp) return {}
  const bonuses = esp.bonuses && esp.bonuses[level.toString()] ? esp.bonuses[level.toString()] : {}
  const out = {}
  Object.entries(bonuses).forEach(([k, v]) => {
    if (SKILLS.includes(k)) { 
      out[k] = (out[k] || 0) + Number(v); 
      return 
    }
    const mapped = ESPOLIO_SKILL_KEY_MAP[k]
    if (mapped && SKILLS.includes(mapped)) {
      out[mapped] = (out[mapped] || 0) + Number(v)
    }
  })
  return out
}

// ===================================================================
// 6. FUNÇÕES DE CÁLCULO DE KAGUNE
// ===================================================================

// Calcula dano base da kagune
function calcularKaguneDanoBase() {
  const FOR = Number(readVal('for-total', true) || 0);
  const RC = Number(readVal('rcpot-total', true) || 0);
  const nivel = Number(readVal('input-kagune-nivel', true) || 0);
  const tipo = readVal('input-kagune-tipo') || '-- Selecionar --';
  const RES = Number(readVal('res-total', true) || 0);
  const DES = Number(readVal('des-total', true) || 0);
  const PER = Number(readVal('per-total', true) || 0);

  // Base neutra
  const base0 = FOR + Math.floor(RC / 2) + Math.floor(nivel / 2) + 1;
  let baseFinal = base0;

  if (tipo === 'Rinkaku') {
    // Rinkaku: maior dano base, fortemente influenciado por RC
    baseFinal = Math.round(base0 * (1 + (RC * 0.04)) * (1 + nivel * 0.03) * 1.25);
  } else if (tipo === 'Koukaku') {
    // Koukaku: vida e resistência são o centro
    const vidaEst = estimateVidaFromRes(RES, nivel);
    const extraPorVida = Math.floor(vidaEst / 100) * 10;
    baseFinal = Math.round((base0 + extraPorVida) * (1 + (RES * 0.01)) * 1.05);
  } else if (tipo === 'Ukaku') {
    // Ukaku: base menor (foco em especial) mas cresce com Destreza
    baseFinal = Math.round(base0 * (1 + (DES * 0.02)) * (1 + nivel * 0.02) * 0.95);
  } else if (tipo === 'Bikaku') {
    // Bikaku: equilibrado
    const somaChave = FOR + DES + RES + PER;
    baseFinal = Math.round(base0 * 1.15 + Math.floor(somaChave / 10));
  } else {
    baseFinal = Math.round(base0);
  }

  baseFinal = Math.max(1, baseFinal);

  // Expor para debug
  window.lastKaguneInfo = window.lastKaguneInfo || {};
  window.lastKaguneInfo.baseComputed = baseFinal;
  window.lastKaguneInfo.baseRef = base0;

  return baseFinal;
}

// Calcula dano especial da kagune
function calcularKaguneDanoEspecial() {
  const tipo = readVal('input-kagune-tipo') || '-- Selecionar --';
  const nivel = Number(readVal('input-kagune-nivel', true) || 0);
  const FOR = Number(readVal('for-total', true) || 0);
  const DES = Number(readVal('des-total', true) || 0);
  const RES = Number(readVal('res-total', true) || 0);
  const PER = Number(readVal('per-total', true) || 0);
  const INT = Number(readVal('int-total', true) || 0);
  const CAR = Number(readVal('car-total', true) || 0);
  const RC = Number(readVal('rcpot-total', true) || 0);

  const base0 = FOR + Math.floor(RC / 2) + Math.floor(nivel / 2) + 1;
  let special = base0;
  let notes = '';

  if (tipo === 'Ukaku') {
    // Ukaku: maior dano especial, usa principalmente Destreza
    special = Math.round(base0 * (1 + (DES * 0.08) + (nivel * 0.06)) * 1.8);
    notes = 'Ukaku: especial muito forte, escala principalmente com DES.';
  } else if (tipo === 'Koukaku') {
    // Koukaku: especial moderado
    const vidaEst = estimateVidaFromRes(RES, nivel);
    special = Math.round((base0 + Math.floor(vidaEst / 150)) * (1 + (PER * 0.02) + (nivel * 0.03)) * 0.9);
    notes = 'Koukaku: curto em especial, robusto em vida; especial moderado.';
  } else if (tipo === 'Rinkaku') {
    // Rinkaku: especial reduzido em 35%
    special = Math.round(base0 * (1 + (RC * 0.05) + (FOR * 0.02) + (nivel * 0.05)));
    special = Math.max(1, Math.round(special * 0.65));
    notes = 'Rinkaku: dano base altíssimo; especial reduzido em 35%.';
  } else if (tipo === 'Bikaku') {
    // Bikaku: equilibrado
    const mix = FOR + DES + RES + PER;
    special = Math.round(base0 * (1 + (mix / 40) + (nivel * 0.04)) * 1.1);
    notes = 'Bikaku: equilibrado — bom em tudo, sem extremos.';
  } else {
    special = Math.round(base0);
    notes = 'Sem tipo selecionado.';
  }

  special = Math.max(1, Math.round(special));

  // Gravar detalhes para debug
  window.lastKaguneInfo = Object.assign(window.lastKaguneInfo || {}, {
    tipo: tipo,
    nivel: nivel,
    baseRef: base0,
    specialRaw: special,
    notes: notes,
    FOR, DES, RES, PER, RC
  });

  return special;
}

// ===================================================================
// 7. FUNÇÕES DE ATUALIZAÇÃO DE ATRIBUTOS E STATUS
// ===================================================================

// Atualiza um atributo específico
function updateAttribute(attrKey) {
  const base = readVal(`${attrKey}-base`, true) || 0
  const bonusRaca = readVal(`${attrKey}-bonus-raca`, true) || 0
  const bonusFaccao = readVal(`${attrKey}-bonus-faccao`, true) || 0
  const kaguneBonuses = getKaguneBonusesByLevel()
  const bonusKagune = (kaguneBonuses && (kaguneBonuses[attrKey] || 0)) || 0
  const nivelBonus = (attrKey === 'for' || attrKey === 'res') ? aplicarNivelBonus() : 0
  const vd = getVantagensDesvantagensBonus(attrKey) || 0
  const bonusEspolio = getEspolioBonus(attrKey) || 0
  const total = base + bonusRaca + bonusFaccao + bonusKagune + nivelBonus + vd + bonusEspolio
  const totalEl = $(`${attrKey}-total`)
  if (totalEl) totalEl.value = total
  return total
}

// Aplica bônus de perícias
function aplicarBonusesPericias() {
  const fac = readVal('input-faccao') || ''
  const tipoKag = readVal('input-kagune-tipo') || ''
  const espolioSkillBonuses = getEspolioSkillBonuses()

  SKILLS.forEach((s, idx) => {
    const lvlEl = $(`skill-${idx}-lvl`)
    const totalEl = $(`skill-${idx}-total`)
    if (!lvlEl || !totalEl) return
    const base = Number(lvlEl.value) || 0
    const bonusF = (FACCAO_BONUSES[fac] && FACCAO_BONUSES[fac][s]) ? FACCAO_BONUSES[fac][s] : 0
    const bonusK = (KAGUNE_SKILL_BONUSES[tipoKag] && KAGUNE_SKILL_BONUSES[tipoKag][s]) ? KAGUNE_SKILL_BONUSES[tipoKag][s] : 0
    const bonusE = (espolioSkillBonuses && espolioSkillBonuses[s]) ? espolioSkillBonuses[s] : 0
    totalEl.value = base + bonusF + bonusK + bonusE
  })
}

// Atualiza todos os status do personagem
function updateStatus() {
  ATTRS.forEach(a => updateAttribute(a.key))
  const nivel = readVal('input-nivel', true) || 1
  const resTotal = readVal('res-total', true) || 0
  const forTotal = readVal('for-total', true) || 0
  const rcTotal = readVal('rcpot-total', true) || 0

  // Calcular vida
  const vida = Math.floor((resTotal * 14) + (Math.pow(nivel, 1.1) * 12))
  if ($('input-vida')) $('input-vida').value = vida
  if ($('view-vida')) $('view-vida').textContent = vida
  if ($('sum-vida')) $('sum-vida').textContent = vida

  // Atualizar resistência
  if ($('view-resistencia')) $('view-resistencia').textContent = resTotal
  if ($('sum-res')) $('sum-res').textContent = resTotal

  // Calcular dano base (incluindo armas)
  let maiorDanoArma = 0
  for (let i = 1; i <= 4; i++) {
    const tipo = readVal(`item${i}-tipo`)
    const db = readVal(`item${i}-db`, true) || 0
    if (tipo === 'Arma' && db > maiorDanoArma) maiorDanoArma = db
  }
  const danoBase = forTotal
  if ($('view-danobase')) $('view-danobase').textContent = `${danoBase} ${maiorDanoArma > 0 ? '+(' + maiorDanoArma + ')' : ''}`
  if ($('sum-danobase')) $('sum-danobase').textContent = `${danoBase}${maiorDanoArma > 0 ? ' + ' + maiorDanoArma : ''}`

  // Atualizar RC
  if ($('view-rc')) $('view-rc').textContent = rcTotal
  if ($('sum-rc')) $('sum-rc').textContent = rcTotal

  // Calcular kagune
  const kaguneBase = calcularKaguneDanoBase()
  const kaguneEsp = calcularKaguneDanoEspecial()
  const kaguneAttrs = getKaguneBonusesByLevel()

  // Formatar atributos herdados
  function formatKaguneAttrs(obj) {
    if (!obj || typeof obj !== 'object') return ''
    const labels = { for: 'FOR', des: 'DES', res: 'RES', per: 'PER', int: 'INT', car: 'CAR', rcpot: 'RC' }
    return Object.entries(obj)
      .map(([k, v]) => `${labels[k] || k.toUpperCase()}: ${v}`)
      .join('   ')
  }

  if ($('k-atributos-read')) $('k-atributos-read').value = formatKaguneAttrs(kaguneAttrs)
  if ($('k-dano-base-read')) $('k-dano-base-read').value = kaguneBase
  if ($('k-dano-esp-read')) $('k-dano-esp-read').value = kaguneEsp

  // Atualizar displays da kagune
  if ($('view-kagunebase')) $('view-kagunebase').textContent = kaguneBase
  if ($('view-kaguneesp')) $('view-kaguneesp').textContent = kaguneEsp
  if ($('sum-kagune')) $('sum-kagune').textContent = kaguneBase
  if ($('sum-kagune-esp')) $('sum-kagune-esp').textContent = kaguneEsp

  aplicarBonusesPericias()
  buildEspoliosSidebar()
}

// Função para atualizar a view (chamada por eventos)
function updateView() {
  updateStatus()
}

// ===================================================================
// 8. FUNÇÕES DE VALIDAÇÃO
// ===================================================================

// Valida combinação de raça e facção
function validateRaceFaction() {
  const raca = readVal('input-raca')
  const fac = readVal('input-faccao')
  
  if (['Ghoul Puro', 'Meio-Ghoul (Quinx)', 'Híbrido'].includes(raca) && fac === 'CCG') { 
    alert('Ghoul / Meio-Ghoul / Híbrido não podem ser da CCG. Selecione outra facção.'); 
    $('input-faccao') && ($('input-faccao').value = ''); 
    return false 
  }
  if (raca === 'Humano' && (fac === 'Aogiri Tree' || fac === 'Palhaços (Pierrots)')) { 
    alert('Humano não pode ser da Aogiri Tree ou dos Palhaços.'); 
    $('input-faccao') && ($('input-faccao').value = ''); 
    return false 
  }
  if (raca === 'Criança Abençoada' && !(fac === 'CCG' || fac === 'Jardim (Sunlit Garden)')) { 
    alert('Criança Abençoada só pode pertencer à CCG ou Jardim (Sunlit Garden).'); 
    $('input-faccao') && ($('input-faccao').value = ''); 
    return false 
  }
  if (raca === 'Washuu' && !(fac === 'Família Washuu' || fac === 'Organização V')) { 
    alert('Washuu só pode pertencer à Família Washuu ou Organização V.'); 
    $('input-faccao') && ($('input-faccao').value = ''); 
    return false 
  }
  if (raca === 'Membro da V' && fac !== 'Organização V') { 
    alert('Membro da V só pode pertencer à Organização V.'); 
    $('input-faccao') && ($('input-faccao').value = ''); 
    return false 
  }
  return true
}

// Limita número de armas no inventário
function enforceWeaponLimit() {
  let count = 0
  for (let i = 1; i <= 4; i++) if (readVal(`item${i}-tipo`) === 'Arma') count++
  for (let i = 1; i <= 4; i++) {
    const sel = $(`item${i}-tipo`)
    if (!sel) continue
    for (let j = 0; j < sel.options.length; j++) {
      const opt = sel.options[j]
      if (opt.value === 'Arma') {
        if (sel.value === 'Arma') opt.disabled = false
        else opt.disabled = (count >= 2)
      }
    }
  }
}

// ===================================================================
// 9. FUNÇÕES DE CONSTRUÇÃO DE INTERFACE
// ===================================================================

// Constrói a grade de atributos
function buildAttrs() {
  const grid = $('attrs-grid')
  if (!grid) return
  grid.innerHTML = ''
  ATTRS.forEach(a => {
    const div = document.createElement('div')
    div.className = 'attrs-row'
    div.innerHTML = `
      <div style="font-weight:600">${a.label}</div>
      <input class="small-input" id="${a.key}-base" type="number" value="0" onchange="updateAttribute('${a.key}'); updateStatus()">
      <input class="small-input" id="${a.key}-bonus-raca" type="number" value="0" onchange="updateAttribute('${a.key}'); updateStatus()">
      <input class="small-input" id="${a.key}-bonus-faccao" type="number" value="0" onchange="updateAttribute('${a.key}'); updateStatus()">
      <input class="small-input" id="${a.key}-total" readonly>
    `
    grid.appendChild(div)
  })
}

// Constrói a lista de perícias
function buildSkills() {
  const wrap = $('skills-wrap')
  if (!wrap) return
  wrap.innerHTML = ''
  SKILLS.forEach((s, idx) => {
    const r = document.createElement('div')
    r.className = 'skill-row'
    r.innerHTML = `
      <div>${s}</div>
      <input id="skill-${idx}-lvl" type="number" min="0" max="5" value="0" onchange="aplicarBonusesPericias();">
      <input id="skill-${idx}-total" readonly>
    `
    wrap.appendChild(r)
  })
}

// ===================================================================
// 10. FUNÇÕES DE ESPÓLIOS - INTERFACE
// ===================================================================

// Constrói a lista principal de espólios
function buildEspolios() {
  const wrap = $('espolios-wrap')
  if (!wrap) return
  wrap.innerHTML = ''

  const playerRace = readVal('input-raca') === 'Outro' ? readVal('input-raca-outro') : readVal('input-raca')
  const playerFaction = readVal('input-faccao') === 'Outro' ? readVal('input-faccao-outro') : readVal('input-faccao')

  // Filtrar espólios aplicáveis
  const allEspolios = Object.values(ESPOLIOS_DEFINITIONS).filter(espolio => {
    if (espolio.raceRestriction && espolio.raceRestriction.length) {
      if (!playerRace) return false
      if (!espolio.raceRestriction.includes(playerRace)) return false
    }
    if (espolio.factionRestriction && espolio.factionRestriction.length) {
      if (!playerFaction) return false
      if (!espolio.factionRestriction.includes(playerFaction)) return false
    }
    return true
  })

  // Ordenar por rank desc / title asc
  allEspolios.sort((a, b) => (b.rank - a.rank) || a.title.localeCompare(b.title))

  // Paginação
  const total = allEspolios.length
  const pages = Math.max(1, Math.ceil(total / ESPOLIOS_PER_PAGE))
  if (espoliosPage > pages) espoliosPage = pages
  if (espoliosPage < 1) espoliosPage = 1
  const start = (espoliosPage - 1) * ESPOLIOS_PER_PAGE
  const pageItems = allEspolios.slice(start, start + ESPOLIOS_PER_PAGE)

  // Header
  const header = document.createElement('div')
  header.className = 'espolios-header'
  header.innerHTML = `<div style="color:var(--muted);font-size:0.95rem;margin-bottom:10px">Apenas 1 espólio primário e 1 secundário podem estar ativos. Mostrando ${pageItems.length} de ${total} — página ${espoliosPage}/${pages}.</div>`
  wrap.appendChild(header)

  // Lista de itens
  const list = document.createElement('div')
  list.className = 'espolios-list'
  pageItems.forEach(espolio => {
    const isUnlocked = !!playerEspolios.unlockedEspolios[espolio.id]
    const isPrimaryActive = (playerEspolios.activePrimary === espolio.id)
    const isSecondaryActive = (playerEspolios.activeSecondary === espolio.id)
    const currentLevel = isUnlocked ? (playerEspolios.unlockedEspolios[espolio.id].level || 1) : 0
    const maxLevel = espolio.maxLevel

    const card = document.createElement('div')
    card.className = `espolio-card ${!isUnlocked ? 'espolio-locked' : ''} ${(isPrimaryActive || isSecondaryActive) ? 'espolio-active' : ''}`
    card.style.marginBottom = '10px'

    card.innerHTML = `
      <div class="espolio-meta">
        <div class="espolio-title">${espolio.title}</div>
        <div class="espolio-sub">${isUnlocked ? escapeHtml(espolio.description) : 'Espólio misterioso...'} ${isUnlocked ? `<br><small>Nível ${currentLevel}/${maxLevel}</small>` : ''}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="rank-badge rank-${espolio.rank}">R${espolio.rank}</div>
        <div style="min-width:8px"></div>
        <div class="espolio-actions">
          ${isUnlocked ? `
            <button class="espolio-btn" onclick="togglePrimaryEspolio('${espolio.id}')" ${isPrimaryActive ? 'disabled' : ''}>${isPrimaryActive ? 'Primário (Ativo)' : 'Ativar Primário'}</button>
            <button class="espolio-btn" onclick="toggleSecondaryEspolio('${espolio.id}')" ${(isSecondaryActive ? '' : ((espolio.rank > 3) ? 'disabled title="Rank > 3: não elegível como secundário"' : ''))}>${isSecondaryActive ? 'Secundário (Ativo)' : 'Ativar Secundário'}</button>
            <button class="espolio-btn" onclick="showEspolioDetails('${espolio.id}')">Info</button>
          ` : `<span style="color:var(--muted);font-size:0.85rem">Bloqueado</span>`}
        </div>
      </div>
    `
    list.appendChild(card)
  })
  wrap.appendChild(list)

  // Controles de paginação
  const pager = document.createElement('div')
  pager.className = 'espolios-pager'
  pager.style.display = 'flex'
  pager.style.justifyContent = 'space-between'
  pager.style.alignItems = 'center'
  pager.style.marginTop = '12px'

  const left = document.createElement('div')
  left.innerHTML = `<button id="espolios-prev" class="espolio-btn" ${espoliosPage <= 1 ? 'disabled' : ''}>← Anterior</button>`
  const center = document.createElement('div')
  center.style.fontSize = '0.9rem'
  center.style.color = 'var(--muted)'
  center.textContent = `Página ${espoliosPage} de ${pages}`
  const right = document.createElement('div')
  right.innerHTML = `<button id="espolios-next" class="espolio-btn" ${espoliosPage >= pages ? 'disabled' : ''}>Próximo →</button>`

  pager.appendChild(left)
  pager.appendChild(center)
  pager.appendChild(right)
  wrap.appendChild(pager)

  // Event listeners dos botões de paginação
  const prevBtn = document.getElementById('espolios-prev')
  const nextBtn = document.getElementById('espolios-next')
  if (prevBtn) prevBtn.addEventListener('click', () => { 
    if (espoliosPage > 1) { 
      espoliosPage--; 
      buildEspolios() 
    } 
  })
  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (espoliosPage < pages) { 
      espoliosPage++; 
      buildEspolios() 
    }
  })

  buildEspoliosSidebar()
}

// ===================================================================
// 11. FUNÇÕES DE CONTROLE DE ESPÓLIOS
// ===================================================================

// Ativa/desativa espólio primário
function togglePrimaryEspolio(espolioId) {
  if (playerEspolios.activePrimary === espolioId) {
    playerEspolios.activePrimary = null;
  } else {
    playerEspolios.activePrimary = espolioId;
    // Se for o mesmo que secundário, remove da posição secundária
    if (playerEspolios.activeSecondary === espolioId) {
      playerEspolios.activeSecondary = null;
    }
  }
  buildEspolios(); 
  updateStatus();
  updateSidebarEspolios();
}

// Ativa/desativa espólio secundário
function toggleSecondaryEspolio(espolioId) {
  const esp = ESPOLIOS_DEFINITIONS[espolioId];
  if (!esp) return;
  
  // Só pode ser secundário se rank <= 3
  if (!isSecondaryEligible(esp)) {
    alert('Este espólio não pode ser usado como secundário (rank superior a 3).');
    return;
  }
  
  // Deve estar desbloqueado
  const pdata = playerEspolios.unlockedEspolios[espolioId];
  if (!pdata || !pdata.level) {
    alert('Espólio não desbloqueado — desbloqueie antes de selecionar como secundário.');
    return;
  }
  
  // Toggle
  if (playerEspolios.activeSecondary === espolioId) {
    playerEspolios.activeSecondary = null;
  } else {
    // Não pode ser o mesmo que primário
    if (playerEspolios.activePrimary === espolioId) {
      alert('Não é possível escolher o mesmo espólio como primário e secundário.');
      return;
    }
    playerEspolios.activeSecondary = espolioId;
  }
  
  buildEspolios(); 
  updateStatus();
  updateSidebarEspolios();
}

// Mostra detalhes de um espólio
function showEspolioDetails(espolioId) {
  const espolio = ESPOLIOS_DEFINITIONS[espolioId]
  const playerData = playerEspolios.unlockedEspolios[espolioId]
  if (!espolio || !playerData) return
  const level = playerData.level || 1
  const bonuses = espolio.bonuses[level.toString()]
  let bonusText = 'Bônus: \n'
  Object.entries(bonuses).forEach(([attr, value]) => {
    bonusText += `${attr.toUpperCase()}: +${value}\n`
  })
  alert(`${espolio.title}\n\n${espolio.description}\n\nNível: ${level}/${espolio.maxLevel}\n${bonusText}\n\nRequisitos: ${espolio.requirements}`)
}

// Desbloqueia um espólio
function unlockEspolio(espolioId, level = 1) {
  playerEspolios.unlockedEspolios[espolioId] = { level: level }
  
  // Aplicar itens associados (se houver)
  const esp = ESPOLIOS_DEFINITIONS[espolioId]
  if (esp && esp.bonuses && esp.bonuses[level.toString()]) {
    const b = esp.bonuses[level.toString()]
    if (b.item) appendItemToInventory(String(b.item))
    if (b.unique_item) appendItemToInventory(String(b.unique_item))
    if (b.access_item) appendItemToInventory(String(b.access_item))
    if (b.items && Array.isArray(b.items)) {
      b.items.forEach(it => appendItemToInventory(String(it)))
    }
  }
  
  buildEspolios()
  updateStatus()
}

// Adiciona item ao inventário geral (evita duplicatas)
function appendItemToInventory(itemText) {
  if (!itemText) return
  const el = $('inv-geral')
  if (!el) return
  let text = el.value || ''
  
  // Normalizar linhas atuais
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0)
  
  // Se já existe linha idêntica, não adiciona
  if (lines.includes(itemText.trim())) return
  
  // Adicionar em nova linha
  lines.push(itemText.trim())
  el.value = lines.join('\n')
}

// ===================================================================
// 12. SIDEBAR DE ESPÓLIOS
// ===================================================================

// Formatar chave de atributo para exibição
function formatAttrKey(k){
  return {
    for:'For', des:'Des', res:'Res', per:'Per', int:'Int', car:'Car', rcpot:'RC'
  }[k] || k;
}

// Obter cor do rank baseada no CSS
function getRankColor(rank) {
  const colors = {
    1: '#c89a60', // Ferro/Bronze
    2: '#f1f1f1', // Prata  
    3: '#f6e27a', // Ouro
    4: '#84d3a0', // Esmeralda
    5: '#db5a65'  // Ruby
  };
  return colors[rank] || '#e6e6e6'; // Cor padrão se rank não encontrado
}

// Obter resumo de um espólio
function getEspolioSummary(id){
  if(!id) return null;
  const esp = ESPOLIOS_DEFINITIONS[id];
  const pdata = playerEspolios?.unlockedEspolios?.[id] || null;
  if(!esp) return { id, missing:true };
  const lvl = pdata ? (pdata.level || 1) : 1; // Se não tem dados do player, assume nível 1
  return {
    id: esp.id,
    title: esp.title || esp.name || id,
    rank: esp.rank || 1,
    level: lvl,
    maxLevel: esp.maxLevel || 1,
    description: esp.description || '',
    bonuses: (esp.bonuses && esp.bonuses[lvl.toString()]) || {}
  };
}

// Atualiza a sidebar de espólios
function updateSidebarEspolios(){
  // Primeiro, vamos criar o elemento sidebar se não existir
  let container = document.getElementById('sidebar-espolios');
  if (!container) {
    // Procurar na sidebar existente
    const sidebar = document.querySelector('.sidebar .summary');
    if (sidebar) {
      // Criar o container de espólios na sidebar
      container = document.createElement('div');
      container.id = 'sidebar-espolios';
      container.style.marginTop = '20px';
      sidebar.appendChild(container);
    } else {
      console.warn('updateSidebarEspolios: elemento sidebar não encontrado.');
      return;
    }
  }

  // Limpar
  container.innerHTML = '';

  // Coletar ativos - CORRIGIDO: usar as variáveis corretas
  const primaryId = playerEspolios?.activePrimary || null;
  const secondaryId = playerEspolios?.activeSecondary || null;

  console.log('Primary ID:', primaryId, 'Secondary ID:', secondaryId); // Debug

  const primary = getEspolioSummary(primaryId);
  const secondary = getEspolioSummary(secondaryId);

  console.log('Primary Summary:', primary, 'Secondary Summary:', secondary); // Debug

  // Construir HTML
  const wrap = document.createElement('div');
  wrap.style.padding = '10px';
  wrap.style.borderRadius = '8px';
  wrap.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(0,0,0,0.04))';
  wrap.style.border = '1px solid rgba(255,255,255,0.03)';
  wrap.style.color = 'var(--muted)';

  // Header
  const header = document.createElement('div');
  header.style.marginBottom = '8px';
  header.innerHTML = `<strong style="color:var(--text)">Espólios Ativos</strong>`;
  wrap.appendChild(header);

  // Primary block
  const blockPrimary = document.createElement('div');
  blockPrimary.style.marginBottom = '8px';
  if(primary && !primary.missing && primaryId){
    const rankColor = getRankColor(primary.rank);
    blockPrimary.innerHTML = `
      <div style="font-weight:700;color:${rankColor}">${primary.title}</div>
      <div style="font-size:12px;color:var(--muted)">Primário • Rank R${primary.rank} • Lv ${primary.level}/${primary.maxLevel}</div>
      <div style="margin-top:6px;font-size:12px;color:var(--muted)">${(primary.description||'Sem descrição')}</div>
    `;
  } else {
    blockPrimary.innerHTML = `
      <div style="font-weight:700;color:var(--muted)">Nenhum primário ativo</div>
      <div style="font-size:12px;color:var(--muted)">Selecione na aba "Espólios de Batalha"</div>
    `;
  }
  wrap.appendChild(blockPrimary);

  // Secondary block
  const blockSec = document.createElement('div');
  blockSec.style.marginBottom = '8px';
  if(secondary && !secondary.missing && secondaryId){
    const espDef = ESPOLIOS_DEFINITIONS[secondaryId];
    const thr = Math.min(3, espDef?.maxLevel || 3);
    const ok = (secondary.level >= thr);
    const rankColor = getRankColor(secondary.rank);
    blockSec.innerHTML = `
      <div style="font-weight:700;color:${rankColor}">${secondary.title}</div>
      <div style="font-size:12px;color:var(--muted)">Secundário • Rank R${secondary.rank} • Lv ${secondary.level}/${secondary.maxLevel}</div>
      <div style="margin-top:6px;font-size:12px;color:${ok? 'var(--muted)': '#f39c12'}">${ok ? 'Bônus secundário ativo' : 'Secundário NÃO atingiu threshold (lvl ' + thr + ') — bônus não aplicados'}</div>
    `;
  } else {
    blockSec.innerHTML = `
      <div style="font-weight:700;color:var(--muted)">Nenhum secundário</div>
      <div style="font-size:12px;color:var(--muted)">Somente espólios ≤ R3 podem ser secundários</div>
    `;
  }
  wrap.appendChild(blockSec);

  // Bônus resumidos (atributos)
  const attrs = ['for','des','res','per','int','car','rcpot'];
  const attrRows = attrs.map(a => {
    const val = getEspolioBonus(a);
    return `<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--muted)"><div>${formatAttrKey(a)}</div><div style="color:${val>0? 'var(--accent)': 'var(--muted)'}">${val>0? '+'+val : '0'}</div></div>`;
  }).join('');
  const attrsBox = document.createElement('div');
  attrsBox.style.marginTop = '10px';
  attrsBox.innerHTML = `<strong style="color:var(--text);font-size:13px">Bônus Atributos</strong><div style="margin-top:6px">${attrRows}</div>`;
  wrap.appendChild(attrsBox);

  // Bônus em perícias
  const skillBonuses = getEspolioSkillBonuses();
  const skillBox = document.createElement('div');
  skillBox.style.marginTop = '10px';
  skillBox.innerHTML = `<strong style="color:var(--text);font-size:13px">Bônus Perícias</strong>`;
  const list = document.createElement('div');
  list.style.marginTop = '6px';
  if(Object.keys(skillBonuses).length === 0){
    list.innerHTML = `<div style="font-size:13px;color:var(--muted)">Nenhuma perícia com bônus aplicado</div>`;
  } else {
    Object.entries(skillBonuses).forEach(([k,v])=>{
      const row = document.createElement('div');
      row.style.fontSize='13px';
      row.style.color='var(--muted)';
      row.style.display='flex';
      row.style.justifyContent='space-between';
      row.innerHTML = `<div>${k}</div><div style="color:var(--accent)">+${v}</div>`;
      list.appendChild(row);
    });
  }
  skillBox.appendChild(list);
  wrap.appendChild(skillBox);

  // Escrever tudo no container
  container.appendChild(wrap);
}

// Constrói a sidebar de espólios (alias para compatibilidade)
function buildEspoliosSidebar() {
  updateSidebarEspolios();
}

// ===================================================================
// 13. FUNÇÕES DE IMPORT/EXPORT
// ===================================================================

// Coleta todos os dados da ficha
function gather() {
  const atributos = {}
  ATTRS.forEach(a => {
    atributos[a.key] = {
      base: readVal(`${a.key}-base`, true),
      bonus_raca: readVal(`${a.key}-bonus-raca`, true),
      bonus_faccao: readVal(`${a.key}-bonus-faccao`, true),
      total: readVal(`${a.key}-total`, true)
    }
  })

  const skills = SKILLS.map((s, idx) => ({ 
    name: s, 
    level: readVal(`skill-${idx}-lvl`, true), 
    total: readVal(`skill-${idx}-total`, true) 
  }))

  const items = [1, 2, 3, 4].map(i => ({
    tipo: readVal(`item${i}-tipo`),
    nome: readVal(`item${i}-n`),
    descricao: readVal(`item${i}-desc`),
    efeito: readVal(`item${i}-efeito`),
    dano_base: readVal(`item${i}-db`, true),
    dano_esp: readVal(`item${i}-de`, true)
  }))

  return {
    meta: {
      nivel: readVal('input-nivel', true),
      nome: readVal('input-nome') || readVal('display-name'),
      apelido: readVal('input-apelido') || readVal('display-nick'),
      idade: readVal('input-idade', true),
      sexo: readVal('input-sexo'),
      altura: readVal('input-altura', true),
      peso: readVal('input-peso', true),
      cabelo: readVal('input-cabelo'),
      olhos: readVal('input-olhos'),
      raca: (readVal('input-raca') === 'Outro') ? readVal('input-raca-outro') : readVal('input-raca'),
      faccao: (readVal('input-faccao') === 'Outro') ? readVal('input-faccao-outro') : readVal('input-faccao'),
      data_criacao: readVal('input-data'),
      marcas: readVal('input-marcas'),
      tracos_pos: readVal('input-tr-p'),
      tracos_neg: readVal('input-tr-n'),
      maneirismos: readVal('input-maneirismos'),
      fobia: readVal('input-fobia')
    },
    status: {
      vida: readVal('input-vida', true),
      danobase: (() => { const v = readVal('view-danobase'); return v ? v : 0 })(),
      resistencia: readVal('view-resistencia') || 0,
      kagune_base: readVal('k-dano-base-read', true),
      kagune_esp: readVal('k-dano-esp-read', true),
      rc: readVal('view-rc', true)
    },
    atributos,
    skills,
    kagune: {
      tipo: readVal('input-kagune-tipo'),
      nome: readVal('input-kagune-nome'),
      nivel: readVal('input-kagune-nivel', true),
      cor: readVal('input-kagune-cor'),
      visual_0_3: readVal('k-visual-0-3'),
      visual_4_7: readVal('k-visual-4-7'),
      visual_8_10: readVal('k-visual-8-10'),
      atributos_herdados: getKaguneBonusesByLevel()
    },
    itens: items,
    inv_geral: readVal('inv-geral'),
    espolios: {
      activePrimary: playerEspolios.activePrimary,
      activeSecondary: playerEspolios.activeSecondary,
      unlockedEspolios: playerEspolios.unlockedEspolios,
      progress: playerEspolios.progress
    }
  }
}

// Aplica dados importados à ficha
function applyData(obj) {
  if (!obj) return
  
  const m = obj.meta || {}
  if ($('input-nivel')) $('input-nivel').value = m.nivel || 1
  if ($('input-nome')) $('input-nome').value = m.nome || ''
  if ($('input-apelido')) $('input-apelido').value = m.apelido || ''
  if ($('display-name')) $('display-name').textContent = m.nome || ''
  if ($('display-nick')) $('display-nick').textContent = m.apelido || ''
  if ($('input-idade')) $('input-idade').value = m.idade || ''
  if ($('input-sexo')) $('input-sexo').value = m.sexo || ''
  if ($('input-altura')) $('input-altura').value = m.altura || ''
  if ($('input-peso')) $('input-peso').value = m.peso || ''
  if ($('input-cabelo')) $('input-cabelo').value = m.cabelo || ''
  if ($('input-olhos')) $('input-olhos').value = m.olhos || ''
  
  // Raça
  if (m.raca) { 
    const rOpt = Array.from($('input-raca')?.options || []).find(o => o.value === m.raca); 
    if (rOpt && $('input-raca')) {
      $('input-raca').value = m.raca; 
    } else if ($('input-raca')) { 
      $('input-raca').value = 'Outro'; 
      $('raca-outro-wrap') && ($('raca-outro-wrap').style.display = 'block'); 
      $('input-raca-outro') && ($('input-raca-outro').value = m.raca) 
    } 
  }
  
  // Facção
  if (m.faccao) { 
    const fOpt = Array.from($('input-faccao')?.options || []).find(o => o.value === m.faccao); 
    if (fOpt && $('input-faccao')) {
      $('input-faccao').value = m.faccao; 
    } else if ($('input-faccao')) { 
      $('input-faccao').value = 'Outro'; 
      $('faccao-outro-wrap') && ($('faccao-outro-wrap').style.display = 'block'); 
      $('input-faccao-outro') && ($('input-faccao-outro').value = m.faccao) 
    } 
  }
  
  if ($('input-data')) $('input-data').value = m.data_criacao || ''
  if ($('input-marcas')) $('input-marcas').value = m.marcas || ''
  if ($('input-tr-p')) $('input-tr-p').value = m.tracos_pos || ''
  if ($('input-tr-n')) $('input-tr-n').value = m.tracos_neg || ''
  if ($('input-maneirismos')) $('input-maneirismos').value = m.maneirismos || ''
  if ($('input-fobia')) $('input-fobia').value = m.fobia || ''

  // Status
  if (obj.status) { 
    if ($('input-vida')) $('input-vida').value = obj.status.vida || 0 
  }

  // Atributos
  if (obj.atributos) { 
    ATTRS.forEach(a => { 
      const v = obj.atributos[a.key] || {}; 
      if ($(`${a.key}-base`)) $(`${a.key}-base`).value = v.base || 0; 
      if ($(`${a.key}-bonus-raca`)) $(`${a.key}-bonus-raca`).value = v.bonus_raca || 0; 
      if ($(`${a.key}-bonus-faccao`)) $(`${a.key}-bonus-faccao`).value = v.bonus_faccao || 0 
    }) 
  }

  // Perícias
  if (obj.skills) {
    obj.skills.forEach((s, idx) => { 
      if ($(`skill-${idx}-lvl`)) $(`skill-${idx}-lvl`).value = s.level || 0 
    })
  }

  // Kagune
  if (obj.kagune) { 
    if ($('input-kagune-tipo')) $('input-kagune-tipo').value = obj.kagune.tipo || ''; 
    if ($('input-kagune-nome')) $('input-kagune-nome').value = obj.kagune.nome || ''; 
    if ($('input-kagune-nivel')) $('input-kagune-nivel').value = obj.kagune.nivel || 0; 
    if ($('input-kagune-cor')) $('input-kagune-cor').value = obj.kagune.cor || ''; 
    if ($('k-visual-0-3')) $('k-visual-0-3').value = obj.kagune.visual_0_3 || ''; 
    if ($('k-visual-4-7')) $('k-visual-4-7').value = obj.kagune.visual_4_7 || ''; 
    if ($('k-visual-8-10')) $('k-visual-8-10').value = obj.kagune.visual_8_10 || '' 
  }

  // Itens
  if (obj.itens) { 
    obj.itens.forEach((item, idx) => { 
      const i = idx + 1; 
      if ($(`item${i}-tipo`)) $(`item${i}-tipo`).value = item.tipo || ''; 
      if ($(`item${i}-n`)) $(`item${i}-n`).value = item.nome || ''; 
      if ($(`item${i}-desc`)) $(`item${i}-desc`).value = item.descricao || ''; 
      if ($(`item${i}-efeito`)) $(`item${i}-efeito`).value = item.efeito || ''; 
      if ($(`item${i}-db`)) $(`item${i}-db`).value = item.dano_base || 0; 
      if ($(`item${i}-de`)) $(`item${i}-de`).value = item.dano_esp || 0 
    }) 
  }
  
  if ($('inv-geral')) $('inv-geral').value = obj.inv_geral || ''

  // Aplicar dados dos espólios
  if (obj.espolios) {
    playerEspolios.activePrimary = obj.espolios.activePrimary || null
    playerEspolios.activeSecondary = obj.espolios.activeSecondary || null
    playerEspolios.unlockedEspolios = obj.espolios.unlockedEspolios || {}
    playerEspolios.progress = obj.espolios.progress || {}
  }
  
  // Garantir que os itens de espólios desbloqueados sejam aplicados ao inventário
  Object.entries(playerEspolios.unlockedEspolios || {}).forEach(([esId, data]) => {
    const lvl = (data && data.level) ? data.level : 1
    const esp = ESPOLIOS_DEFINITIONS[esId]
    if (!esp || !esp.bonuses) return
    const b = esp.bonuses[lvl.toString()] || {}
    if (b.item) appendItemToInventory(String(b.item))
    if (b.unique_item) appendItemToInventory(String(b.unique_item))
    if (b.access_item) appendItemToInventory(String(b.access_item))
    if (b.items && Array.isArray(b.items)) {
      b.items.forEach(it => appendItemToInventory(String(it)))
    }
  })

  buildEspolios()
  updateView()
}

// Download de arquivo JSON
function downloadJSON(obj, filename) { 
  try { 
    const data = JSON.stringify(obj, null, 2); 
    const blob = new Blob([data], { type: 'application/json' }); 
    const url = URL.createObjectURL(blob); 
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = filename || 'ficha.json'; 
    document.body.appendChild(a); 
    a.click(); 
    a.remove(); 
    URL.revokeObjectURL(url); 
  } catch (e) { 
    console.error('Erro ao fazer download:', e); 
    alert('Erro ao exportar ficha.') 
  } 
}

// ===================================================================
// 14. INICIALIZAÇÃO E EVENT LISTENERS
// ===================================================================

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('Espólios carregados:', Object.keys(ESPOLIOS_DEFINITIONS).length);
  
  // Construir interface
  buildAttrs()
  buildSkills()
  buildEspolios()
  
  // Configurar event listeners
  setupEventListeners()
  
  // Atualização inicial
  setTimeout(() => { 
    aplicarBonusesPericias(); 
    updateStatus(); 
    enforceWeaponLimit();
    updateSidebarEspolios();
  }, 50)
})

// Configurar event listeners
function setupEventListeners() {
  // Export/Import
  const exportBtn = $('exportBtn')
  const importBtn = $('importBtn')
  const fileImport = $('fileImport')
  
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = gather()
      const nome = data.meta.nome || 'personagem'
      downloadJSON(data, `ficha_${nome.replace(/\s+/g, '_')}.json`)
    })
  }
  
  if (importBtn && fileImport) {
    importBtn.addEventListener('click', () => fileImport.click())
    fileImport.addEventListener('change', (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          applyData(data)
          alert('Ficha importada com sucesso!')
        } catch (err) {
          console.error('Erro ao importar:', err)
          alert('Erro ao importar ficha. Verifique se o arquivo é válido.')
        }
      }
      reader.readAsText(file)
    })
  }
  
  // Avatar upload
  const avatarFile = $('avatar-file')
  const avatarPreview = $('avatar-preview')
  
  if (avatarFile && avatarPreview) {
    avatarFile.addEventListener('change', (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        avatarPreview.style.backgroundImage = `url(${e.target.result})`
        avatarPreview.style.backgroundSize = 'cover'
        avatarPreview.style.backgroundPosition = 'center'
        avatarPreview.textContent = ''
      }
      reader.readAsDataURL(file)
    })
  }
  
  // Campos de raça e facção "Outro"
  const racaSelect = $('input-raca')
  const faccaoSelect = $('input-faccao')
  
  if (racaSelect) {
    racaSelect.addEventListener('change', () => {
      const outro = $('raca-outro-wrap')
      if (outro) {
        outro.style.display = racaSelect.value === 'Outro' ? 'block' : 'none'
      }
      validateRaceFaction()
    })
  }
  
  if (faccaoSelect) {
    faccaoSelect.addEventListener('change', () => {
      const outro = $('faccao-outro-wrap')
      if (outro) {
        outro.style.display = faccaoSelect.value === 'Outro' ? 'block' : 'none'
      }
      validateRaceFaction()
    })
  }
  
  // Atualizar nomes editáveis
  const displayName = $('display-name')
  const displayNick = $('display-nick')
  const inputNome = $('input-nome')
  const inputApelido = $('input-apelido')
  
  if (displayName && inputNome) {
    displayName.addEventListener('input', () => {
      inputNome.value = displayName.textContent
    })
    inputNome.addEventListener('input', () => {
      displayName.textContent = inputNome.value
    })
  }
  
  if (displayNick && inputApelido) {
    displayNick.addEventListener('input', () => {
      inputApelido.value = displayNick.textContent
    })
    inputApelido.addEventListener('input', () => {
      displayNick.textContent = inputApelido.value
    })
  }
}

// Inicialização da sidebar de espólios (chamada com delay)
setTimeout(() => {
  try { 
    updateSidebarEspolios(); 
  } catch(e) { 
    console.warn('sidebar init failed', e); 
  }
}, 120);

// ===================================================================
// FIM DO SCRIPT ORGANIZADO
// ===================================================================


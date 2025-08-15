// script.js — lógica avançada para a ficha
// Inclui: espólios na sidebar (resumo à direita), construção dinâmica, export/import, proteção DOM
const ESPOLIOS_DEFINITIONS = window.ESPOLIOS_DEFINITIONS || {};
console.log('Espólios carregados:', ESPOLIOS_DEFINITIONS);
function $(id) { return document.getElementById(id) }


// Helpers seguros para leitura do DOM
function readVal(id, asNumber = false) {
  const el = $(id)
  if (!el) return asNumber ? 0 : ''
  const raw = (typeof el.value !== 'undefined') ? el.value : el.textContent
  if (asNumber) return Number(raw) || 0
  return String(raw || '')
}

const ATTRS = [
  { key: 'for', label: 'Força (FOR)' },
  { key: 'des', label: 'Destreza (DES)' },
  { key: 'res', label: 'Resistência (RES)' },
  { key: 'per', label: 'Percepção (PER)' },
  { key: 'int', label: 'Inteligência (INT)' },
  { key: 'car', label: 'Carisma (CAR)' },
  { key: 'rcpot', label: 'Potencial de RC (RC)' }
]

const SKILLS = [
  'Combate Corpo a Corpo', 'Combate com Quinque', 'Combate com Faca / Melee Light', 'Combate à Distância',
  'Esquiva / Agilidade', 'Stealth / Furtividade', 'Sobrevivência Urbana', 'Investigação e Rastreamento',
  'Conhecimento sobre Ghouls', 'Medicina de Campo', 'Manipulação Social', 'Empatia / Leitura Emocional',
  'Negociação (Mercado Negro)', 'Provocar / Intimidação', 'Ciência (Biologia / Química)', 'Habilidades Manuais (Artesão)',
  'Tecnologia / Hackear', 'Culinária Especial (Antídotos)', 'Nível de Influência (Facção)'
]

let playerEspolios = {
  activeEspolio: null,
  unlockedEspolios: {},
  progress: {}
}

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
  'Independente': {},
  'Outro': {},
  'Sankench': {
    'Provocar / Intimidação': 2,
    'Combate Corpo a Corpo': 3,
    'Conhecimento sobre Ghouls': 1,
    'Sobrevivência Urbana': 1,
    'Esquiva / Agilidade': 2
  }
}

const KAGUNE_SKILL_BONUSES = {
  '-- Selecionar --': {},
  'Ukaku': { 'Stealth / Furtividade': 1, 'Combate à Distância': 3, 'Esquiva / Agilidade': 3 },
  'Koukaku': { 'Combate Corpo a Corpo': 1, 'Combate com Quinque': 3, 'Habilidades Manuais (Artesão)': 3 },
  'Rinkaku': { 'Medicina de Campo': 1, 'Empatia / Leitura Emocional': 3, 'Conhecimento sobre Ghouls': 3, 'Manipulação Social': 3 },
  'Bikaku': { 'Combate com Faca / Melee Light': 1, 'Sobrevivência Urbana': 3, 'Esquiva / Agilidade': 3, 'Investigação e Rastreamento': 3 }
}

// mapa para converter chaves curtas usadas nos espólios em nomes reais das SKILLS
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

const KAGUNE_ATTR_BASE = {
  '-- Selecionar --': { for: 0, des: 0, res: 0, per: 0, int: 0, car: 0, rcpot: 0 },
  'Ukaku': { for: 1, des: 3, res: 1, per: 2, int: 1, car: 2, rcpot: 1 },
  'Koukaku': { for: 2, des: 1, res: 3, per: 1, int: 2, car: 1, rcpot: 1 },
  'Rinkaku': { for: 3, des: 2, res: 1, per: 1, int: 1, car: 1, rcpot: 2 },
  'Bikaku': { for: 2, des: 2, res: 2, per: 2, int: 2, car: 2, rcpot: 2 }
}

// Paginação dos espólios
const ESPOLIOS_PER_PAGE = 4
let espoliosPage = 1

function getVantagensDesvantagensBonus(attrKey) { return 0 }

// Retorna bônus de espólio (se ativo)
function getEspolioBonus(attrKey) {
  if (!playerEspolios.activeEspolio) return 0
  const espolio = ESPOLIOS_DEFINITIONS[playerEspolios.activeEspolio]
  if (!espolio) return 0
  const playerEspolioData = playerEspolios.unlockedEspolios[playerEspolios.activeEspolio]
  if (!playerEspolioData) return 0
  const level = playerEspolioData.level || 1
  const bonuses = espolio.bonuses[level.toString()]
  const attrMap = { 'for': 'for', 'des': 'des', 'res': 'res', 'per': 'per', 'int': 'int', 'car': 'car', 'rcpot': 'rc' }
  const espolioAttr = attrMap[attrKey]
  return bonuses && bonuses[espolioAttr] ? bonuses[espolioAttr] : 0
}

// retorna um objeto { 'Nome da Pericia': valor, ... } dos bônus do espólio ativo (se houver)
function getEspolioSkillBonuses() {
  if (!playerEspolios.activeEspolio) return {}
  const esp = ESPOLIOS_DEFINITIONS[playerEspolios.activeEspolio]
  if (!esp) return {}
  const pdata = playerEspolios.unlockedEspolios[playerEspolios.activeEspolio]
  if (!pdata) return {}
  const lvl = pdata.level || 1
  const bonuses = esp.bonuses && esp.bonuses[lvl.toString()] ? esp.bonuses[lvl.toString()] : {}
  const out = {}
  Object.entries(bonuses).forEach(([k, v]) => {
    // se chave já for o nome de skill completo, usa direto
    if (SKILLS.includes(k)) {
      out[k] = (out[k] || 0) + Number(v)
      return
    }
    // senão tenta mapear via ESPOLIO_SKILL_KEY_MAP
    const mapped = ESPOLIO_SKILL_KEY_MAP[k]
    if (mapped && SKILLS.includes(mapped)) {
      out[mapped] = (out[mapped] || 0) + Number(v)
    }
  })
  return out
}

// retorna bônus de perícia por espólio (mesmo que não esteja ativo) — útil para mostrar
function getEspolioSkillBonusesFor(espolioId, level = 1) {
  const esp = ESPOLIOS_DEFINITIONS[espolioId]
  if (!esp) return {}
  const bonuses = esp.bonuses && esp.bonuses[level.toString()] ? esp.bonuses[level.toString()] : {}
  const out = {}
  Object.entries(bonuses).forEach(([k, v]) => {
    if (SKILLS.includes(k)) { out[k] = (out[k] || 0) + Number(v); return }
    const mapped = ESPOLIO_SKILL_KEY_MAP[k]
    if (mapped && SKILLS.includes(mapped)) out[mapped] = (out[mapped] || 0) + Number(v)
  })
  return out
}

function aplicarNivelBonus() { return Math.max(0, (readVal('input-nivel', true) || 1) - 1) }

function getKaguneBonusesByLevel() {
  const tipo = readVal('input-kagune-tipo') || '-- Selecionar --'
  const nivel = readVal('input-kagune-nivel', true) || 0
  const baseMap = KAGUNE_ATTR_BASE[tipo] || {}
  const extra = Math.floor((Math.max(1, nivel) - 1) / 3)
  const out = {}
  Object.keys(baseMap).forEach(k => { const b = baseMap[k] || 0; out[k] = b > 0 ? b + extra : b })
  return out
}

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

// adiciona item ao final de inv-geral, em nova linha. evita duplicata exata.
function appendItemToInventory(itemText) {
  if (!itemText) return
  const el = $('inv-geral')
  if (!el) return
  let text = el.value || ''
  // normalizar linhas atuais
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0)
  // se já existe linha idêntica, não adiciona
  if (lines.includes(itemText.trim())) return
  // adicionar em nova linha
  lines.push(itemText.trim())
  el.value = lines.join('\n')
}

function updateStatus() {
  ATTRS.forEach(a => updateAttribute(a.key))
  const nivel = readVal('input-nivel', true) || 1
  const resTotal = readVal('res-total', true) || 0
  const forTotal = readVal('for-total', true) || 0
  const rcTotal = readVal('rcpot-total', true) || 0

  const vida = Math.floor((resTotal * 14) + (Math.pow(nivel, 1.1) * 12))
  if ($('input-vida')) $('input-vida').value = vida
  if ($('view-vida')) $('view-vida').textContent = vida
  if ($('sum-vida')) $('sum-vida').textContent = vida

  if ($('view-resistencia')) $('view-resistencia').textContent = resTotal
  if ($('sum-res')) $('sum-res').textContent = resTotal

  let maiorDanoArma = 0
  for (let i = 1; i <= 3; i++) {
    const tipo = readVal(`item${i}-tipo`)
    const db = readVal(`item${i}-db`, true) || 0
    if (tipo === 'Arma' && db > maiorDanoArma) maiorDanoArma = db
  }
  const danoBase = forTotal
  if ($('view-danobase')) $('view-danobase').textContent = `${danoBase} ${maiorDanoArma > 0 ? '+(' + maiorDanoArma + ')' : ''}`
  if ($('sum-danobase')) $('sum-danobase').textContent = `${danoBase}${maiorDanoArma > 0 ? ' + ' + maiorDanoArma : ''}`

  if ($('view-rc')) $('view-rc').textContent = rcTotal
  if ($('sum-rc')) $('sum-rc').textContent = rcTotal

  const kaguneBase = calcularKaguneDanoBase()
  const kaguneEsp = calcularKaguneDanoEspecial()
  const kaguneAttrs = getKaguneBonusesByLevel()

  // formata atributos herdados para exibição (ex.: FOR:+1  DES:+3  RES:0 ...)
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

  // VAMOS exibir os atributos herdados da kagune
  if ($('view-kagunebase')) $('view-kagunebase').textContent = kaguneBase
  if ($('view-kaguneesp')) $('view-kaguneesp').textContent = kaguneEsp
  if ($('sum-kagune')) $('sum-kagune').textContent = kaguneBase
  if ($('sum-kagune-esp')) $('sum-kagune-esp').textContent = kaguneEsp

  aplicarBonusesPericias()
  buildEspoliosSidebar()
}

// ===== Versões compatíveis com o estilo do script.js =====
// Retornam número simples (para updateStatus) e expõem info extra em window.lastKaguneInfo

function calcularKaguneDanoBase() {
  // compatível com seu uso: lê direto do DOM com readVal
  const FOR = Number(readVal('for-total', true) || 0)
  const RC  = Number(readVal('rcpot-total', true) || 0)
  const nivel = Number(readVal('input-kagune-nivel', true) || 0)

  // fórmula base: FOR principal + contribuição de RC + escala por nível
  const base = FOR + Math.floor(RC / 2) + Math.floor(nivel / 2) + 1
  // segurança
  return Math.max(0, base)
}

function calcularKaguneDanoEspecial() {
  // lê atributos da ficha
  const tipo = readVal('input-kagune-tipo') || '-- Selecionar --'
  const nivel = Number(readVal('input-kagune-nivel', true) || 0)
  const FOR = Number(readVal('for-total', true) || 0)
  const DES = Number(readVal('des-total', true) || 0)
  const RES = Number(readVal('res-total', true) || 0)
  const PER = Number(readVal('per-total', true) || 0)
  const RC  = Number(readVal('rcpot-total', true) || 0)

  // base centralizada em FOR/RC — mantém coerência com a base exibida
  const base = calcularKaguneDanoBase()

  let danoCalc = base
  let damageReduction = 0
  let specialFlat = 0
  let notes = ''

  if (tipo === 'Ukaku') {
    // Ukaku: dano especial cresce com DES + PER (foco em precisão e combo).
    // multiplicador leve por DES/PER + escala por nível
    const mult = 1 + (DES * 0.03) + (PER * 0.035) + (nivel * 0.05)
    danoCalc = base * mult
    // bônus plano quando DES+PER formam um "combo" (incentiva builds híbridas)
    specialFlat = Math.floor((DES + PER) / 4)
    notes = 'Ukaku — dano especial escalando com Destreza/Percepção; considere desgaste por múltiplos disparos.'
  }
  else if (tipo === 'Koukaku') {
    // Koukaku: maior defesa (Damage Reduction), dano moderado baseado em RES e FOR
    const mult = 1 + (FOR * 0.02) + (RES * 0.03) + (nivel * 0.04)
    danoCalc = base * mult
    damageReduction = Math.floor(RES / 2) // ex: RES 4 => DR 2
    notes = 'Koukaku — foco em resistência/armadura; aplica redução de dano baseada em RES.'
  }
  else if (tipo === 'Rinkaku') {
    // Rinkaku: maior dano puro; combina FOR + RC; escala mais com nível
    const mult = 1 + (FOR * 0.04) + (RC * 0.03) + (nivel * 0.08)
    danoCalc = base * mult
    notes = 'Rinkaku — maior dano bruto; ideal para builds FOR+RC.'
  }
  else if (tipo === 'Bikaku') {
    // Bikaku: média, equilibrada entre atributos
    const totalAttrs = FOR + DES + RES + PER
    const mult = 1 + (totalAttrs / 200) + (nivel * 0.06)
    danoCalc = base * mult
    notes = 'Bikaku — equilíbrio entre dano e utilidade.'
  } else {
    // fallback: sem tipo selecionado
    danoCalc = base
    notes = 'Tipo não selecionado — usando dano base.'
  }

  const rawTotal = danoCalc + specialFlat
  const danoFinal = Math.max(1, Math.round(rawTotal)) // garante ao menos 1 ponto de dano
  

  // salva info extra para uso futuro (DR, notas) sem quebrar contrato de retorno numérico
  window.lastKaguneInfo = {
    tipo: tipo,
    base: base,
    raw: Math.round(rawTotal * 10) / 10, // valor "cru" com 1 casa (para debug, opcional)
    specialFlat: specialFlat,
    damageReduction: damageReduction,
    damageRounded: danoFinal,
    notes: notes
  }

  // retorno numérico — o que o resto do seu código espera
  return danoFinal
}

// Converte número de dano para uma string estilo "dados" (opção útil para VTT)
function damageToDiceString(damageNum) {
  const d = Math.floor(damageNum);
  // mapa simples — ajuste conforme sua preferência
  if (d <= 2) return '1d4';
  if (d <= 5) return '1d6';
  if (d <= 8) return '1d8 + ' + Math.max(0, d - 6);
  if (d <= 12) return '2d8 + ' + Math.max(0, d - 10);
  if (d <= 18) return '3d8 + ' + Math.max(0, d - 14);
  // valores muito altos -> d10s
  return '4d8 + ' + Math.max(0, d - 18);
}


function aplicarBonusesPericias() {
  const fac = readVal('input-faccao') || ''
  const tipoKag = readVal('input-kagune-tipo') || ''
  // pegar bônus do espólio ativo, mapeado por nome da perícia
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

function validateRaceFaction() {
  const raca = readVal('input-raca')
  const fac = readVal('input-faccao')
  if (['Ghoul Puro', 'Meio-Ghoul (Quinx)', 'Híbrido'].includes(raca) && fac === 'CCG') { alert('Ghoul / Meio-Ghoul / Híbrido não podem ser da CCG. Selecione outra facção.'); $('input-faccao') && ($('input-faccao').value = ''); return false }
  if (raca === 'Humano' && (fac === 'Aogiri Tree' || fac === 'Palhaços (Pierrots)')) { alert('Humano não pode ser da Aogiri Tree ou dos Palhaços.'); $('input-faccao') && ($('input-faccao').value = ''); return false }
  if (raca === 'Criança Abençoada' && !(fac === 'CCG' || fac === 'Jardim (Sunlit Garden)')) { alert('Criança Abençoada só pode pertencer à CCG ou Jardim (Sunlit Garden).'); $('input-faccao') && ($('input-faccao').value = ''); return false }
  if (raca === 'Washuu' && !(fac === 'Família Washuu' || fac === 'Organização V')) { alert('Washuu só pode pertencer à Família Washuu ou Organização V.'); $('input-faccao') && ($('input-faccao').value = ''); return false }
  if (raca === 'Membro da V' && fac !== 'Organização V') { alert('Membro da V só pode pertencer à Organização V.'); $('input-faccao') && ($('input-faccao').value = ''); return false }
  return true
}

function enforceWeaponLimit() {
  let count = 0
  for (let i = 1; i <= 3; i++) if (readVal(`item${i}-tipo`) === 'Arma') count++
  for (let i = 1; i <= 3; i++) {
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

// --- Espólios (main panel already exists) ---
function buildEspolios() {
  const wrap = $('espolios-wrap')
  if (!wrap) return
  wrap.innerHTML = ''

  const playerRace = readVal('input-raca') === 'Outro' ? readVal('input-raca-outro') : readVal('input-raca')
  const playerFaction = readVal('input-faccao') === 'Outro' ? readVal('input-faccao-outro') : readVal('input-faccao')

  // Filtra espólios aplicáveis ao jogador (considera restrições)
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

  // Ordena por rank desc / title asc (opcional, ajustável)
  allEspolios.sort((a, b) => (b.rank - a.rank) || a.title.localeCompare(b.title))

  // Paginação
  const total = allEspolios.length
  const pages = Math.max(1, Math.ceil(total / ESPOLIOS_PER_PAGE))
  if (espoliosPage > pages) espoliosPage = pages
  if (espoliosPage < 1) espoliosPage = 1
  const start = (espoliosPage - 1) * ESPOLIOS_PER_PAGE
  const pageItems = allEspolios.slice(start, start + ESPOLIOS_PER_PAGE)

  // Header / instruções (mantém o título da seção se quiser)
  const header = document.createElement('div')
  header.className = 'espolios-header'
  header.innerHTML = `<div style="color:var(--muted);font-size:0.95rem;margin-bottom:10px">Apenas 1 espólio pode estar ativo por vez. Mostrando ${pageItems.length} de ${total} — página ${espoliosPage}/${pages}.</div>`
  wrap.appendChild(header)

  // Lista de itens da página
  const list = document.createElement('div')
  list.className = 'espolios-list'
  pageItems.forEach(espolio => {
    const isUnlocked = !!playerEspolios.unlockedEspolios[espolio.id]
    const isActive = playerEspolios.activeEspolio === espolio.id
    const currentLevel = isUnlocked ? (playerEspolios.unlockedEspolios[espolio.id].level || 1) : 0
    const maxLevel = espolio.maxLevel

    const card = document.createElement('div')
    card.className = `espolio-card ${!isUnlocked ? 'espolio-locked' : ''} ${isActive ? 'espolio-active' : ''}`
    card.style.marginBottom = '10px'

    card.innerHTML = `
      <div class="espolio-meta">
        <div class="espolio-title">${espolio.title}</div>
        <div class="espolio-sub">${isUnlocked ? escapeHtml(espolio.description) : 'Espólio misterioso...' } ${isUnlocked ? `<br><small>Nível ${currentLevel}/${maxLevel}</small>` : ''}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="rank-badge rank-${espolio.rank}">R${espolio.rank}</div>
        <div style="min-width:8px"></div>
        <div class="espolio-actions">
          ${isUnlocked ? `
            <button class="espolio-btn" onclick="toggleEspolio('${espolio.id}')" ${isActive ? 'disabled' : ''}>${isActive ? 'Ativo' : 'Ativar'}</button>
            <button class="espolio-btn" onclick="showEspolioDetails('${espolio.id}')">Info</button>
          ` : `<span style="color:var(--muted);font-size:0.85rem">Bloqueado</span>` }
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
  if (prevBtn) prevBtn.addEventListener('click', () => { if (espoliosPage > 1) { espoliosPage--; buildEspolios() } })
  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (espoliosPage < pages) { espoliosPage++; buildEspolios() }
  })

  buildEspoliosSidebar()
}

// Toggle espólio (ativa/desativa)
function toggleEspolio(espolioId) {
  if (playerEspolios.activeEspolio === espolioId) playerEspolios.activeEspolio = null
  else playerEspolios.activeEspolio = espolioId
  buildEspolios()
  updateStatus()
}

function showEspolioDetails(espolioId) {
  const espolio = ESPOLIOS_DEFINITIONS[espolioId]
  const playerData = playerEspolios.unlockedEspolios[espolioId]
  if (!espolio || !playerData) return
  const level = playerData.level || 1
  const bonuses = espolio.bonuses[level.toString()]
  let bonusText = 'Bônus: \n'
  Object.entries(bonuses).forEach(([attr, value]) => {
  bonusText += `${attr.toUpperCase()}: +${value}\n` // adicionado \n
})
  alert(`${espolio.title}\n\n${espolio.description}\n\nNível: ${level}/${espolio.maxLevel}\n${bonusText}\n\nRequisitos: ${espolio.requirements}`)
}

function unlockEspolio(espolioId, level = 1) {
  playerEspolios.unlockedEspolios[espolioId] = { level: level }
  // aplicar itens associados (se houver)
  const esp = ESPOLIOS_DEFINITIONS[espolioId]
  if (esp && esp.bonuses && esp.bonuses[level.toString()]) {
    const b = esp.bonuses[level.toString()]
    // suporte a várias formas: item (string), unique_item (string), items (array)
    if (b.item) appendItemToInventory(String(b.item))
    if (b.unique_item) appendItemToInventory(String(b.unique_item))
    if (b.access_item) appendItemToInventory(String(b.access_item))
    if (b.items && Array.isArray(b.items)) b.items.forEach(it => appendItemToInventory(String(it)))
  }
  buildEspolios()
}

// Build a compact espólios box inside the sidebar summary
function buildEspoliosSidebar() {
  const summary = document.querySelector('.sidebar .summary')
  if (!summary) return

  // inject styles once
  if (!document.getElementById('espolios-sidebar-styles')) {
    const style = document.createElement('style')
    style.id = 'espolios-sidebar-styles'
    style.textContent = `
      .sidebar-espolios{margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.03)}
      .sidebar-espolios h4{margin:0 0 6px 0;font-size:0.95rem}
      .sidebar-espolio-card{display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.03)}
      .sidebar-espolio-title{font-weight:700;font-size:0.95rem}
      .sidebar-espolio-sub{font-size:0.8rem;color:var(--muted)}
      .sidebar-espolio-actions{margin-left:auto}
      .sidebar-espolio-count{font-size:0.85rem;color:var(--muted);margin-top:6px}
    `
    document.head.appendChild(style)
  }

  // create container if not exists
  let box = document.getElementById('sidebar-espolios')
  if (!box) {
    box = document.createElement('div')
    box.id = 'sidebar-espolios'
    box.className = 'sidebar-espolios'
    summary.appendChild(box)
  }

  // build content
  const activeId = playerEspolios.activeEspolio
  const unlockedIds = Object.keys(playerEspolios.unlockedEspolios || {})
  const unlockedCount = unlockedIds.length

  box.innerHTML = ''
  const title = document.createElement('h4')
  title.textContent = 'Espólios (Ativo)'
  box.appendChild(title)

  const card = document.createElement('div')
  card.className = 'sidebar-espolio-card'

  if (!activeId) {
    card.innerHTML = `<div class="sidebar-espolio-title">Nenhum espólio ativo</div><div class="sidebar-espolio-sub">Selecione na aba "Espólios de Batalha"</div>`
  } else {
    const espolio = ESPOLIOS_DEFINITIONS[activeId]
    const pdata = playerEspolios.unlockedEspolios[activeId] || { level: 1 }
    const lvl = pdata.level || 1
    card.innerHTML = `<div style="display:flex;flex-direction:column"><div class="sidebar-espolio-title">${espolio.title}</div><div class="sidebar-espolio-sub">Nível ${lvl}/${espolio.maxLevel}</div></div><div class="sidebar-espolio-actions"><button onclick="showEspolioDetails('${activeId}')" class="espolio-btn">Ver</button></div>`
  }
  box.appendChild(card)

  const countEl = document.createElement('div')
  countEl.className = 'sidebar-espolio-count'
  countEl.textContent = `Desbloqueados: ${unlockedCount}`
  box.appendChild(countEl)

  // quick link to main espólios panel
  const goto = document.createElement('button')
  goto.textContent = 'Abrir Espólios'
  goto.style.marginTop = '8px'
  goto.onclick = () => {
    const mainPanel = document.querySelector('#espolios-wrap')
    if (mainPanel) mainPanel.scrollIntoView({ behavior: 'smooth' })
  }
  box.appendChild(goto)
}

// Safe escape for text used in innerHTML where necessary
function escapeHtml(str){ if(!str) return ''; return String(str).replace(/[&<>\"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] }) }

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

  const skills = SKILLS.map((s, idx) => ({ name: s, level: readVal(`skill-${idx}-lvl`, true), total: readVal(`skill-${idx}-total`, true) }))

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
      textura: readVal('input-kagune-textura'),
      visual_0_3: readVal('k-visual-0-3'),
      visual_4_7: readVal('k-visual-4-7'),
      visual_8_10: readVal('k-visual-8-10'),
      atributos_herdados: getKaguneBonusesByLevel()
    },
    itens: items,
    inv_geral: readVal('inv-geral'),
    espolios: {
      activeEspolio: playerEspolios.activeEspolio,
      unlockedEspolios: playerEspolios.unlockedEspolios,
      progress: playerEspolios.progress
    }
  }
}

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
  if (m.raca) { const rOpt = Array.from($('input-raca')?.options || []).find(o => o.value === m.raca); if (rOpt && $('input-raca')) $('input-raca').value = m.raca; else if ($('input-raca')) { $('input-raca').value = 'Outro'; $('raca-outro-wrap') && ($('raca-outro-wrap').style.display = 'block'); $('input-raca-outro') && ($('input-raca-outro').value = m.raca) } }
  if (m.faccao) { const fOpt = Array.from($('input-faccao')?.options || []).find(o => o.value === m.faccao); if (fOpt && $('input-faccao')) $('input-faccao').value = m.faccao; else if ($('input-faccao')) { $('input-faccao').value = 'Outro'; $('faccao-outro-wrap') && ($('faccao-outro-wrap').style.display = 'block'); $('input-faccao-outro') && ($('input-faccao-outro').value = m.faccao) } }
  if ($('input-data')) $('input-data').value = m.data_criacao || ''
  if ($('input-marcas')) $('input-marcas').value = m.marcas || ''
  if ($('input-tr-p')) $('input-tr-p').value = m.tracos_pos || ''
  if ($('input-tr-n')) $('input-tr-n').value = m.tracos_neg || ''
  if ($('input-maneirismos')) $('input-maneirismos').value = m.maneirismos || ''
  if ($('input-fobia')) $('input-fobia').value = m.fobia || ''

  if (obj.status) { if ($('input-vida')) $('input-vida').value = obj.status.vida || 0 }

  if (obj.atributos) { ATTRS.forEach(a => { const v = obj.atributos[a.key] || {}; if ($(`${a.key}-base`)) $(`${a.key}-base`).value = v.base || 0; if ($(`${a.key}-bonus-raca`)) $(`${a.key}-bonus-raca`).value = v.bonus_raca || 0; if ($(`${a.key}-bonus-faccao`)) $(`${a.key}-bonus-faccao`).value = v.bonus_faccao || 0 }) }

  if (obj.skills) obj.skills.forEach((s, idx) => { if ($(`skill-${idx}-lvl`)) $(`skill-${idx}-lvl`).value = s.level || 0 })
  if (obj.conditions) obj.conditions.forEach((c, i) => { if ($(`cond-${i + 1}`)) $(`cond-${i + 1}`).value = c })

  if (obj.kagune) { if ($('input-kagune-tipo')) $('input-kagune-tipo').value = obj.kagune.tipo || ''; if ($('input-kagune-nome')) $('input-kagune-nome').value = obj.kagune.nome || ''; if ($('input-kagune-nivel')) $('input-kagune-nivel').value = obj.kagune.nivel || 0; if ($('input-kagune-cor')) $('input-kagune-cor').value = obj.kagune.cor || ''; if ($('input-kagune-textura')) $('input-kagune-textura').value = obj.kagune.textura || ''; if ($('k-visual-0-3')) $('k-visual-0-3').value = obj.kagune.visual_0_3 || ''; if ($('k-visual-4-7')) $('k-visual-4-7').value = obj.kagune.visual_4_7 || ''; if ($('k-visual-8-10')) $('k-visual-8-10').value = obj.kagune.visual_8_10 || '' }

  if (obj.itens) { obj.itens.forEach((item, idx) => { const i = idx + 1; if ($(`item${i}-tipo`)) $(`item${i}-tipo`).value = item.tipo || ''; if ($(`item${i}-n`)) $(`item${i}-n`).value = item.nome || ''; if ($(`item${i}-desc`)) $(`item${i}-desc`).value = item.descricao || ''; if ($(`item${i}-efeito`)) $(`item${i}-efeito`).value = item.efeito || ''; if ($(`item${i}-db`)) $(`item${i}-db`).value = item.dano_base || 0; if ($(`item${i}-de`)) $(`item${i}-de`).value = item.dano_esp || 0 }) }
  if ($('inv-geral')) $('inv-geral').value = obj.inv_geral || ''
  
  // Aplicar dados dos espólios
  if (obj.espolios) {
    playerEspolios.activeEspolio = obj.espolios.activeEspolio || null
    playerEspolios.unlockedEspolios = obj.espolios.unlockedEspolios || {}
    playerEspolios.progress = obj.espolios.progress || {}
  }
    // garantir que os itens de espólios desbloqueados sejam aplicados ao inventário (sem duplicar)
  Object.entries(playerEspolios.unlockedEspolios || {}).forEach(([esId, data]) => {
    const lvl = (data && data.level) ? data.level : 1
    const esp = ESPOLIOS_DEFINITIONS[esId]
    if (!esp || !esp.bonuses) return
    const b = esp.bonuses[lvl.toString()] || {}
    if (b.item) appendItemToInventory(String(b.item))
    if (b.unique_item) appendItemToInventory(String(b.unique_item))
    if (b.access_item) appendItemToInventory(String(b.access_item))
    if (b.items && Array.isArray(b.items)) b.items.forEach(it => appendItemToInventory(String(it)))
  })

  
  buildEspolios()
  updateView()
}

setTimeout(() => { aplicarBonusesPericias(); updateStatus(); enforceWeaponLimit() }, 50)

function downloadJSON(obj, filename) { try { const data = JSON.stringify(obj, null, 2); const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename || 'ficha.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); return true } catch (e) { console.error(e); return false } }

if ($('exportBtn')) $('exportBtn').addEventListener('click', () => { const obj = gather(); if (!obj.meta.fobia || obj.meta.fobia.trim().length === 0) { if (!confirm('Campo "Fobia" está vazio. Deseja exportar mesmo assim?')) return } const filename = (obj.meta.nome || 'ficha').replace(/[^a-z0-9_\-]/gi, '_') + '.json'; const ok = downloadJSON(obj, filename); if (ok) alert('Exportado com sucesso — arquivo gerado: ' + filename) })
if ($('importBtn')) $('importBtn').addEventListener('click', () => $('fileImport') && $('fileImport').click())
if ($('fileImport')) $('fileImport').addEventListener('change', function () { const f = this.files[0]; if (!f) return; const reader = new FileReader(); reader.onload = e => { try { const parsed = JSON.parse(e.target.result); if (!parsed.meta || !parsed.atributos) { alert('Arquivo inválido: formato de ficha não reconhecido.'); return } applyData(parsed); alert('Ficha importada com sucesso.') } catch (err) { console.error(err); alert('Erro ao ler JSON: ' + err.message) } }; reader.readAsText(f) })

function previewAvatar(e) { const f = e.target.files[0]; if (!f) return; const url = URL.createObjectURL(f); if ($('avatar-preview')) { $('avatar-preview').style.backgroundImage = `url(${url})`; $('avatar-preview').textContent = '' } }

if ($('input-raca')) $('input-raca').addEventListener('change', () => { if ($('input-raca').value === 'Outro') $('raca-outro-wrap').style.display = 'block'; else { $('raca-outro-wrap').style.display = 'none'; if ($('input-raca-outro')) $('input-raca-outro').value = '' } validateRaceFaction() });
if ($('input-faccao')) $('input-faccao').addEventListener('change', () => { if ($('input-faccao').value === 'Outro') $('faccao-outro-wrap').style.display = 'block'; else { $('faccao-outro-wrap').style.display = 'none'; if ($('input-faccao-outro')) $('input-faccao-outro').value = '' } validateRaceFaction() });

for (let i = 1; i <= 3; i++) { if ($(`item${i}-tipo`)) $(`item${i}-tipo`).addEventListener('change', () => { enforceWeaponLimit(); updateStatus() }); if ($(`item${i}-db`)) $(`item${i}-db`).addEventListener('change', () => { updateStatus() }) }
if ($('input-kagune-tipo')) $('input-kagune-tipo').addEventListener('change', () => { updateStatus(); aplicarBonusesPericias(); })
if ($('input-kagune-nivel')) $('input-kagune-nivel').addEventListener('change', () => { updateStatus(); aplicarBonusesPericias(); })

window.aplicarNivelBonus = aplicarNivelBonus
window.updateAttribute = updateAttribute
window.getKaguneBonusesByLevel = getKaguneBonusesByLevel
window.updateStatus = updateStatus
window.calcularKaguneDanoBase = calcularKaguneDanoBase
window.calcularKaguneDanoEspecial = calcularKaguneDanoEspecial
window.aplicarBonusesPericias = aplicarBonusesPericias
window.validateRaceFaction = validateRaceFaction
window.enforceWeaponLimit = enforceWeaponLimit
window.previewAvatar = previewAvatar
window.toggleEspolio = toggleEspolio
window.showEspolioDetails = showEspolioDetails
window.unlockEspolio = unlockEspolio

function updateView() {
  const nome = readVal('input-nome')
  const apelido = readVal('input-apelido')
  if ($('display-name')) $('display-name').textContent = nome || 'Nome do Personagem'
  if ($('display-nick')) $('display-nick').textContent = apelido || 'Apelido / Codinome'
  updateStatus()
  buildEspolios()
}

document.addEventListener('DOMContentLoaded', () => {
  buildAttrs()
  buildSkills()

  buildEspolios()
  updateView()
  
  // Para testes - desbloquear alguns espólios
  // unlockEspolio('espolio-1', 1)
})


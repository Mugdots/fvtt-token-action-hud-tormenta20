/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'token-action-hud-t20'
}

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '2.0'

/**
 * Action types
 */
export const ACTION_TYPE = {
    item: 'tokenActionHud.t20.item',
    efeito: 'tokenActionHud.t20.effect',
    condicao: 'tokenActionHud.t20.condition',
    utility: 'tokenActionHud.utility',
    pericia: 'tokenActionHud.skill',
    atributo: 'tokenActionHud.atribute',
    feature: 'tokenActionHud.feature',
    spell: 'tokenActionHud.spell'
}

/**
 * Groups
 */
export const GROUP = {
    _1oCirculoMagias: { id: "1o-circulo-magias", name: "tokenActionHud.t20.1o-circle-spells", circulo: 1, type: "system"},
    _2oCirculoMagias: { id: "2o-circulo-magias", name: "tokenActionHud.t20.2o-circle-spells", circulo: 2, type: "system"},
    _3oCirculoMagias: { id: "3o-circulo-magias", name: "tokenActionHud.t20.3o-circle-spells", circulo: 3, type: "system"},
    _4oCirculoMagias: { id: "4o-circulo-magias", name: "tokenActionHud.t20.4o-circle-spells", circulo: 4, type: "system"},
    _5oCirculoMagias: { id: "5o-circulo-magias", name: "tokenActionHud.t20.5o-circle-spells", circulo: 5, type: "system"},
    equipamento: { id: 'equipamento', name: 'tokenActionHud.t20.equipment', type: 'system' },
    consumivel: { id: 'consumivel', name: 'tokenActionHud.t20.consumables', type: 'system' },
    tesouro: { id: 'tesouro', name: 'tokenActionHud.t20.treasure', type: 'system' },
    condicoes: {id: 'condicoes', name: 'tokenActionHud.t20.conditions', type:'system'},
    efeito_passivos: { id: 'efeito-passivos', name: 'tokenActionHud.t20.passiveEffect', type:'system'},
    efeito_temporarios: { id: 'efeito-temporarios', name: 'tokenActionHud.t20.temporaryEffect', type:'system'},
    arma: { id: 'arma', name: 'tokenActionHud.t20.weapons', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' },
    poder_ativo: {id: 'poder-ativo', name: 'tokenActionHud.t20.activePowers', type: 'system'},
    poder_passivo: {id: 'poder-passivo', name: 'tokenActionHud.t20.passivePowers', type: 'system'},
    pericias: {id: 'pericias', name: 'tokenActionHud.t20.skills', type: 'system'},
    pericias_oficio: {id: 'pericias-oficio', name: 'tokenActionHud.t20.skillcraft', type: 'system'},
    pericias_salvamento: {id: 'pericias-salvamento', name: 'tokenActionHud.t20.skillsavingthrow', type: 'system'},
    atributos: {id: 'atributos', name: 'tokenActionHud.t20.atributes', type: 'system'},
    descanso: {id: 'descanso', name: 'tokenActionHud.t20.rest', type: 'system'}
}

/**
 * Item types
 */
export const PERICIAS_IDS = [
    "pericias_salvamento",
    "pericias_oficio",
    "pericias"
]

export const FEATURE_TYPE = {
    poder_ativo: { groupId: 'poder-ativo'},
    poder_passivo: { groupId: 'poder-passivo'}
}

export const ITEM_TYPE = {
    consumivel: { groupId: 'consumivel' },
    equipamento: { groupId: 'equipamento' },
    tesouro: { groupId: 'tesouro' },
    arma: { groupId: 'arma' }
}

export const PROFICIENCY_LEVEL_ICON = {
    false: "fa-regular fa-circle",
    true: "fa-solid fa-circle"
};

export const GRUPO_MAGIA_IDS = [
    "_1oCirculoMagias",
    "_2oCirculoMagias",
    "_3oCirculoMagias",
    "_4oCirculoMagias",
    "_5oCirculoMagias"
]
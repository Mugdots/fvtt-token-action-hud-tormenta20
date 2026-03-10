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
    _1oCirculoMagias: { id: "1o-circulo-magias", name: "tokenActionHud.t20.1oCirculoMagias", circulo: 1, type: "system"},
    _2oCirculoMagias: { id: "2o-circulo-magias", name: "tokenActionHud.t20.2oCirculoMagias", circulo: 2, type: "system"},
    _3oCirculoMagias: { id: "3o-circulo-magias", name: "tokenActionHud.t20.3oCirculoMagias", circulo: 3, type: "system"},
    _4oCirculoMagias: { id: "4o-circulo-magias", name: "tokenActionHud.t20.4oCirculoMagias", circulo: 4, type: "system"},
    _5oCirculoMagias: { id: "5o-circulo-magias", name: "tokenActionHud.t20.5oCirculoMagias", circulo: 5, type: "system"},
    equipamento: { id: 'equipamento', name: 'tokenActionHud.t20.equipment', type: 'system' },
    consumivel: { id: 'consumivel', name: 'tokenActionHud.t20.consumables', type: 'system' },
    //containers: { id: 'containers', name: 'tokenActionHud.t20.containers', type: 'system' },
    tesouro: { id: 'tesouro', name: 'tokenActionHud.t20.treasure', type: 'system' },
    arma: { id: 'arma', name: 'tokenActionHud.t20.weapons', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' },
    poderes: {id: 'poderes', name: 'tokenActionHud.t20.poderes', type: 'system'},
    pericias: {id: 'pericias', name: 'tokenActionHud.t20.skills', type: 'system'},
    atributos: {id: 'atributos', name: 'tokenActionHud.t20.atributes', type: 'system'},
    poder: {id: 'poder', name: 'tokenActionHud.t20.powers', type: 'system'}
}

/**
 * Item types
 */


export const FEATURE_TYPE = {
    poderes: { groupId: 'poderes' }
}

export const ITEM_TYPE = {
    //armor: { groupId: 'armor' },
    //backpack: { groupId: 'containers' },
    consumivel: { groupId: 'consumivel' },
    equipamento: { groupId: 'equipamento' },
    tesouro: { groupId: 'tesouro' },
    arma: { groupId: 'arma' }
}

export const FEATURE_TYPE = {
    poder: { groupId: 'poder'}
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
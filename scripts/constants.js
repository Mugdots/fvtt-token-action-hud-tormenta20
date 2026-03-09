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
    atributo: 'tokenActionHud.atribute'
}

/**
 * Groups
 */
export const GROUP = {
    //armor: { id: 'armor', name: 'tokenActionHud.t20.armor', type: 'system' },
    equipamento: { id: 'equipamento', name: 'tokenActionHud.t20.equipment', type: 'system' },
    consumivel: { id: 'consumivel', name: 'tokenActionHud.t20.consumables', type: 'system' },
    //containers: { id: 'containers', name: 'tokenActionHud.t20.containers', type: 'system' },
    tesouro: { id: 'tesouro', name: 'tokenActionHud.t20.treasure', type: 'system' },
    arma: { id: 'arma', name: 'tokenActionHud.t20.weapons', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' },
    pericias: {id: 'pericias', name: 'tokenActionHud.t20.skills', type: 'system'},
    atributos: {id: 'atributos', name: 'tokenActionHud.t20.atributes', type: 'system'}
}

/**
 * Item types
 */
export const ITEM_TYPE = {
    //armor: { groupId: 'armor' },
    //backpack: { groupId: 'containers' },
    consumivel: { groupId: 'consumivel' },
    equipamento: { groupId: 'equipamento' },
    tesouro: { groupId: 'tesouro' },
    arma: { groupId: 'arma' }
}


export const PROFICIENCY_LEVEL_ICON = {
    false: "fa-regular fa-circle",
    true: "fa-solid fa-circle"
};
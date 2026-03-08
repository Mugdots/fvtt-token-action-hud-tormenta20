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
    atributes: 'tokenActionHud.atributes'
}

/**
 * Groups
 */
export const GROUP = {
    armor: { id: 'armor', name: 'tokenActionHud.t20.armor', type: 'system' },
    equipment: { id: 'equipment', name: 'tokenActionHud.t20.equipment', type: 'system' },
    consumables: { id: 'consumables', name: 'tokenActionHud.t20.consumables', type: 'system' },
    containers: { id: 'containers', name: 'tokenActionHud.t20.containers', type: 'system' },
    treasure: { id: 'treasure', name: 'tokenActionHud.t20.treasure', type: 'system' },
    weapons: { id: 'weapons', name: 'tokenActionHud.t20.weapons', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' },
    skills: {id: 'skills', name: 'tokenActionHud.t20.skills', type: 'system'}
}

/**
 * Item types
 */
export const ITEM_TYPE = {
    armor: { groupId: 'armor' },
    backpack: { groupId: 'containers' },
    consumable: { groupId: 'consumables' },
    equipment: { groupId: 'equipment' },
    treasure: { groupId: 'treasure' },
    weapon: { groupId: 'weapons' }
}

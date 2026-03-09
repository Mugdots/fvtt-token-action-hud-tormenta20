import { GROUP } from './constants.js'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP
    Object.values(groups).forEach(group => {
        group.name = coreModule.api.Utils.i18n(group.name)
        group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
        console.log(`Aqui | Esse é o Grupo: ${group.listName}`);
    })
    const groupsArray = Object.values(groups)
    DEFAULTS = {
        layout: [
            {
                nestId: 'skill',
                id: 'skill',
                name: coreModule.api.Utils.i18n('tokenActionHud.t20.skill'),
                groups: [
                    { ...groups.atributos, nestId: 'skill_atributos'},
                    { ...groups.pericias, nestId: 'skill_pericias'}
                ]

            },
            {
                nestId: 'inventory',
                id: 'inventory',
                name: coreModule.api.Utils.i18n('tokenActionHud.t20.inventory'),
                groups: [
                    { ...groups.arma, nestId: 'inventory_arma' },
                    //{ ...groups.armor, nestId: 'inventory_armor' },
                    { ...groups.equipamento, nestId: 'inventory_equipamento' },
                    { ...groups.consumivel, nestId: 'inventory_consumivel' },
                    //{ ...groups.containers, nestId: 'inventory_containers' },
                    { ...groups.tesouro, nestId: 'inventory_tesouro' }
                ]
            },
            {
                nestId: 'utility',
                id: 'utility',
                name: coreModule.api.Utils.i18n('tokenActionHud.utility'),
                groups: [
                    { ...groups.combat, nestId: 'utility_combat' },
                    { ...groups.token, nestId: 'utility_token' },
                    { ...groups.rests, nestId: 'utility_rests' },
                    { ...groups.utility, nestId: 'utility_utility' }
                ]
            }
        ],
        groups: groupsArray
    }
})

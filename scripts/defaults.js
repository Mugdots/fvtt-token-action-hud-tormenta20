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
    })
    const groupsArray = Object.values(groups)
    DEFAULTS = {
        layout: [
            {
                nestId: 'feature',
                id: 'feature',
                name: coreModule.api.Utils.i18n('tokenActionHud.t20.features'),
                groups: [
                    { ...groups.poder, nestId: 'feature_poder'}
                ]

            },

            {
                nestId: 'skill',
                id: 'skill',
                name: coreModule.api.Utils.i18n('tokenActionHud.t20.skill'),
                groups: [
                    { ...groups.atributos, nestId: 'skill_atributos'},
                    { ...groups.pericias, nestId: 'skill_pericias'},
                    { ...groups.pericias_oficio, nestId: 'skill_oficio'}
                ]

            },
            {
                nestId: 'spell',
                id: 'spell',
                name: coreModule.api.Utils.i18n('tokenActionHud.t20.spell'),
                groups: [
                    {...groups._1oCirculoMagias, nestId: 'spell_1o-circulo-magias'},
                    {...groups._2oCirculoMagias, nestId: 'spell_2o-circulo-magias'}, 
                    {...groups._3oCirculoMagias, nestId: 'spell_3o-circulo-magias'},
                    {...groups._4oCirculoMagias, nestId: 'spell_4o-circulo-magias'},
                    {...groups._5oCirculoMagias, nestId: 'spell_5o-circulo-magias'}
                ]
            },
            {
                nestId: 'inventory',
                id: 'inventory',
                name: coreModule.api.Utils.i18n('tokenActionHud.t20.inventory'),
                groups: [
                    { ...groups.arma, nestId: 'inventory_arma' },
                    { ...groups.equipamento, nestId: 'inventory_equipamento' },
                    { ...groups.consumivel, nestId: 'inventory_consumivel' },
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

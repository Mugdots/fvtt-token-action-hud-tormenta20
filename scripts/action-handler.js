// System Module Imports
import { ACTION_TYPE, ITEM_TYPE, GROUP, PROFICIENCY_LEVEL_ICON, FEATURE_TYPE } from './constants.js'

import { Utils } from './utils.js'

export let ActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
     */
    ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
        /**
         * Build system actions
         * Called by Token Action HUD Core
         * @override
         * @param {array} groupIds
         */a
        async buildSystemActions (groupIds) {
            // Set actor and token variables
            this.actors = (!this.actor) ? this._getActors() : [this.actor]
            this.actorType = this.actor?.type

            // Settings
            this.displayUnequipped = Utils.getSetting('displayUnequipped')

            // Set items variable
            if (this.actor) {
                let items = this.actor.items
                items = coreModule.api.Utils.sortItemsByName(items)
                this.items = items
                console.log(items);
            }

            if (this.actorType === 'character') {
                this.#buildCharacterActions()
            } else if (!this.actor) {
                this.#buildMultipleTokenActions()
            }
        }

        /**
         * Build character actions
         * @private
         */
        #buildCharacterActions () {
            this.#buildInventory()
            this.#buildPericias()
            this.#buildFeatures()
        }

        /**
         * Build multiple token actions
         * @private
         * @returns {object}
         */
        #buildMultipleTokenActions () {
        }

        /**
         * Build Habilidade
         * @private
         * @param {string} groupId
         */

        #buildAtributos () {
             const atributos = this.actor?.system.atributos || CONFIG.T20.atributos;
            
            if (atributos.length === 0) return;

            const actionType = "atributo";
            // Pegar Ações
            const actions = Object.entries(atributos)
            .map(([id, atributo]) => {
                const name = CONFIG.T20.atributos[id];
                const encodedValue = [actionType, id].join(this.delimiter)

                return {
                    id: id,
                    name: name,
                    info1: (this.actor) ? { text: coreModule.api.Utils.getModifier(atributo.value) } : "",
                    listName: name,
                    encodedValue,
                    system: { actionType, actionId: id }
                }
            }).filter(atributo => !!atributo);
            
        this.addActions(actions, GROUP.atributos);

        }

        #buildPericias () {
        
            const pericias = this.actor?.system.pericias || CONFIG.T20.pericias;
            
            if (pericias.length === 0) return;

            const actionType = "pericia";
            // Pegar Ações
            const actions = Object.entries(pericias)
            .map(([id, pericia]) => {
                const name = CONFIG.T20.pericias[id].label;
                const encodedValue = [actionType, id].join(this.delimiter)

                return {
                    id: id,
                    name: pericia.label,
                    icon1: this.#getProficiencyIcon(pericia.treinado),
                    info1: (this.actor) ? { text: coreModule.api.Utils.getModifier(pericia.value) } : "",
                    listName: name,
                    encodedValue,
                    system: { actionType, actionId: id }
                }
            }).filter(pericia => !!pericia);
            
        this.addActions(actions, GROUP.pericias);
    }


        async #buildInventory () {
            if (this.items.size === 0) return

            const actionTypeId = 'item'
            const inventoryMap = new Map()

            for (const [itemId, itemData] of this.items) {
                const type = itemData.type
                const equipped = itemData.equipped
                if (equipped || this.displayUnequipped) {
                    const typeMap = inventoryMap.get(type) ?? new Map()
                    typeMap.set(itemId, itemData)
                    inventoryMap.set(type, typeMap)
                }
            }

            for (const [type, typeMap] of inventoryMap) {
                const groupId = ITEM_TYPE[type]?.groupId
                if (!groupId) continue

                const groupData = { id: groupId, type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([itemId, itemData]) => {
                    const id = itemId
                    const name = itemData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionTypeId, id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue
                    }
                })

                // TAH Core method to add actions to the action list
                this.addActions(actions, groupData)
            }
        }


        async #buildFeatures () {
            if (this.items.size == 0) return
            const actionTypeId = 'item'
            const featureMap = new Map()

            for (const [itemId, itemData ] of this.items) {
                const type = itemData.type
                typeMap.set(itemId, itemData)
                featureMap.set(type, typeMap)
            }

            for (const [type, typeMap] of featureMap) {
                const groupId = FEATURE_TYPE[type]?.groupId

                if (!groupId) continue
                
                const groupData = { id: groupId, type: 'system'}

                const actions = [...typeMap].map(([itemId, itemData]) => {
                    const id = itemId
                    const name = itemData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionTypeId, id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue
                    }
                })
                this.addActions(actions, groupData)
            }
        }

        //async #buildFeatures () {
        //    if (this.items.size == 0) return 
        //    const actionTypeId = 'item'
        //    const featureMap = new Map()


        //}
        /**
         * @param {boolean} treinado 
         * @returns {string}
         */


        #getProficiencyIcon(treinado) {
            const title = treinado ? "treinado" : "não treinado";
            const icon = PROFICIENCY_LEVEL_ICON[treinado];
            return (icon) ? `<i class="${icon}" title=t20."${title}"></i>` : "";
        }
    }
})

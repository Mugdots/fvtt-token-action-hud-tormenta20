// System Module Imports
import { ACTION_TYPE, ITEM_TYPE, GROUP, PROFICIENCY_LEVEL_ICON, FEATURE_TYPE, GRUPO_MAGIA_IDS} from './constants.js'
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
            this.#buildAtributos()
            this.#buildFeatures()
            this.#buildSpells()
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

        
        /**
         * Build Pericias
         * @private
         */
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

          /**
         * Build Inventário
         * @private
         */
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
                        img: coreModule.api.Utils.getImage(itemData),
                        listName,
                        encodedValue
                    }
                })

                // TAH Core method to add actions to the action list
                this.addActions(actions, groupData)
            }
        }

        /**
         * Build Features
         * @private
         */
        async #buildFeatures () {
            const poderes = new Map([...this.items].filter(([, value]) => value.type === "poder"));
            if (this.items.size == 0) return

            const actionTypeId = 'item'
            const featureMap = new Map()

            for (const [itemId, itemData ] of this.items) {
                const type = itemData.type
                const typeMap = featureMap.get(type) ?? new Map()
                typeMap.set(itemId, itemData)
                featureMap.set(type, typeMap)
            }

            for (const [type, typeMap] of featureMap) {
                const groupId = FEATURE_TYPE[type]?.groupId
                if (!groupId) continue
                console.log(typeMap);
                
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
                        img: coreModule.api.Utils.getImage(itemData),
                        icon1: this.#getManaCostIcon(itemData.system.ativacao.custo),
                        listName,
                        encodedValue
                    }
                })
                this.addActions(actions, groupData)
            }
        }

        async #buildSpells () {
            const spells = new Map([...this.items].filter(([, value]) => value.type === "magia"));
            if (spells.size === 0) return;

            // Inicializa o mapa de categorias das magias
            const actionTypeId = 'spell'
            const spellsMap = new Map([
                ["_1oCirculoMagias", new Map()],
                ["_2oCirculoMagias", new Map()],
                ["_3oCirculoMagias", new Map()],
                ["_4oCirculoMagias", new Map()],
                ["_5oCirculoMagias", new Map()]
            ]);

            for (const [key, value] of spells) {
                switch (value.system.circulo) {
                    case 1:
                        spellsMap.get("_1oCirculoMagias").set(key, value); break;
                    case 2:
                        spellsMap.get("_2oCirculoMagias").set(key, value); break;   
                    case 3:
                        spellsMap.get("_3oCirculoMagias").set(key, value); break;
                    case 4: 
                        spellsMap.get("_4oCirculoMagias").set(key, value); break;
                    case 5: 
                        spellsMap.get("_5oCirculoMagias").set(key, value); break;
                }
            }

            for (const id of GRUPO_MAGIA_IDS) {
                const actionData = spellsMap.get(id)
                if (actionData.size === 0) continue
                const groupData = {
                    id: GROUP[id].id,
                    name: GROUP[id].name
                }
                const actions = [...actionData].map(([itemId, itemData]) => {
                    const id = itemId
                    const name = itemData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionTypeId, id].join(this.delimiter)

                    console.log(itemData);
                    return {
                        id,
                        name,
                        img: coreModule.api.Utils.getImage(itemData),
                        icon1: this.#getManaCostIcon(itemData.system.ativacao.custo),
                        listName,
                        encodedValue
                    }
                })
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
        #getManaCostIcon(custoPM) {     
            return (custoPM) ? `<div class="numero-custo-pm">${custoPM}<div class="custo-pm"> PM</div></div>` : "";
        }

        #getProficiencyIcon(treinado) {
            const title = treinado ? "treinado" : "não treinado";
            const icon = PROFICIENCY_LEVEL_ICON[treinado];
            return (icon) ? `<i class="${icon}" title=t20."${title}"></i>` : "";
        }

    }
})

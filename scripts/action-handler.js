// System Module Imports
import { ACTION_TYPE, ITEM_TYPE, GROUP, PROFICIENCY_LEVEL_ICON, FEATURE_TYPE, GRUPO_MAGIA_IDS, PERICIAS_IDS} from './constants.js'
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
            this.#buildSpells()
            this.#buildSkills()
            this.#buildAtributes()
            this.#buildFeatures()
            this.#buildEffects()
            this.#buildCondition()
            this.#buildCombat()
            this.#buildRest()
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

        #buildAtributes () {
            const atributes = this.actor?.system.atributos || CONFIG.T20.atributos;
            
            if (atributes.length === 0) return;

            const actionType = "atributo";
            // Pegar Ações
            const actions = Object.entries(atributes)
            .map(([id, atribute]) => {
                const name = CONFIG.T20.atributos[id];
                const encodedValue = [actionType, id].join(this.delimiter)

                return {
                    id: id,
                    name: name,
                    info1: (this.actor) ? { text: coreModule.api.Utils.getModifier(atribute.value) } : "",
                    listName: name,
                    encodedValue,
                    system: { actionType, actionId: id }
                }
            }).filter(atribute => !!atribute);
            
        this.addActions(actions, GROUP.atributos);

        }

        /**
         * Build Combate
         * @private
         * 
         */
        #buildCombat() {
            const combatType = {
                iniciative: coreModule.api.Utils.i18n("tokenActionHud.t20.rollInitiative"),
                ... (game.combat?.current?.tokenId === this.token?.id && { endTurn: "tokenActionHud.endTurn" })
            };

            const tokens = coreModule.api.Utils.getControlledTokens();
            const tokenIds = tokens?.map(token => token.id)
            const combatant = (game.combat) 
                ? game.combat.combatants.filter(combatant => tokenIds.includes(combatant.tokenId))
                : [];

            const getInfo1 = id => {
                if (id === "initiative" && combatant.length === 1) {
                    const currentInitiative = combatant[0].initiative;
                    return { class: "tah-spotlight", text: currentInitiative};
                }
                return {};
            };

            const getActive = () => { return combatant.length > 0 && (combatant.every(combatant => combatant?.initiative)) ? " active" :
                "";};
            
            // Get actions
            const actionType = "utility";
            const actions = Object.entries(combatType).map(([id, combat]) => {
                const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionType])
                const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${combat}`
                const encodedValue = [actionType, id].join(this.delimiter)
                return {
                    id,
                    name: game.i18n.localize(combat), 
                    info1: getInfo1(id),
                    cssClass: (id === "initiative" ) ? `togle${getActive()}` : "",
                    listName,
                    encodedValue,
                    system: { actionType, actionId: id}
                }
            });

            this.addActions(actions, GROUP.combat);

        }

        /**
         * Build Descanso
         * @private
         * 
         */
        #buildRest() {
            if (this.actor.length === 0 || !this.actors.every(actor => actor.type === 'character')) return;

            const actionType = 'utility';
            const id = "rest";
            const name = game.i18n.localize("tokenActionHud.t20.rest");
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionType])
            const encodedValue = [actionType, id].join(this.delimiter);
            const action = [{
                id: id,
                name: name,
                listName: `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`,
                encodedValue,
                system: { actionType, actionId: id }
            }]
            this.addActions(action, GROUP.descanso);
        }

        /**
         * Build Skills
         * @private
         */
        #buildSkills () {     
            const skills = this.actor?.system.pericias || CONFIG.T20.pericias;
            
            if (skills.length === 0) return;
            
            const actionTypeId = 'pericia'
            const skillMap = new Map([
                ["pericias_salvamento", new Map()],
                ["pericias_oficio", new Map()],
                ["pericias", new Map()]
            ]);

            for (const [key, value] of (Object.entries(skills))) {
                const name = value.label
                const savingThrow = ["Reflexos", "Fortitude", "Vontade"];

                if (name.includes("Ofício:")) {
                    skillMap.get("pericias_oficio").set(key, value);
                } else if (savingThrow.some(str => str === name)){
                    skillMap.get("pericias_salvamento").set(key, value);
                } else {
                    skillMap.get("pericias").set(key, value);
                }
            }

            for(const skillType of PERICIAS_IDS) {
                const actionData = skillMap.get(skillType);
                if (actionData.size === 0) continue;

                const groupData = {
                    id: GROUP[skillType].id,
                    name: GROUP[skillType].name
                }

                const actions =[...actionData].map(([itemId, itemData]) => {
                    const id = itemId
                    const name = itemData.label
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionTypeId])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionTypeId, id].join(this.delimiter)

                    return {
                        id,
                        name,
                        icon1: this.#getProficiencyIcon(itemData.treinado),
                        info1: (this.actor) ? { text: coreModule.api.Utils.getModifier(itemData.value) } : "",
                        listName,
                        encodedValue,
                        system: { actionTypeId, actionId: id }
                    }
                }).filter(skill => !!skill);
            
            this.addActions(actions, groupData);
        }}

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
            const powers = new Map([...this.items].filter(([, value]) => value.type === "poder"));
            if (powers.size == 0) return

            const actionTypeId = 'feature'
            const featureMap = new Map()
            let type
            for (const [itemId, itemData ] of powers) {
                if (itemData.labels.ativacao === "Passivo") {
                    type = "poder_passivo"
                    } else {
                    type = "poder_ativo"
                    }
                const typeMap = featureMap.get(type) ?? new Map()
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
                        img: coreModule.api.Utils.getImage(itemData),
                        icon1: this.#getManaCostIcon(itemData.system.ativacao.custo),
                        listName,
                        encodedValue
                    }
                })
                this.addActions(actions, groupData)
            }
        }


        /**
         * Build Magias
         * @private
         */
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

        /**
        * Build actions
        * @public
        * @param {object} data actionData, groupData, actionType
        * @param {object} options
        */
        async buildActions(data, options) {
            const { actionData, groupData, actionType } = data;

            // Exit if there is no action data
            if (actionData.size === 0) return;

            // Exit if there is no groupId
            const groupId = (typeof groupData === "string" ? groupData : groupData?.id);
            if (!groupId) return;

            // Get actions
            const actions = [...actionData].map(([itemId, itemData]) => {
                const hasEffect = this.actors.every(actor => {
                    return actor.effects.some(effect => effect.name === itemData.name && !effect?.disabled);
                });
                    const id = itemId
                    const name = itemData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionType])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = [actionType, id].join(this.delimiter)

                    return {
                        id,
                        name,
                        img: coreModule.api.Utils.getImage(itemData),
                        cssClass: `toggle${(hasEffect) ? " active": ""}`,
                        tooltip: this.#getConditionTooltipData(itemId, itemData.name),
                        listName,
                        system: { actionType, actionType: itemId },
                        encodedValue
                    }
                })
            // Add actions to action list
            this.addActions(actions, groupData)
        }

        #getConditionTooltipData(id, name) {
            if (this.tooltipsSetting === "none") return "";

            const condition = CONFIG.T20.conditionTypes[id];

            if (this.tooltipsSetting === "nameOnly" || !condition?.reference) return name;

            const tooltip = {};
            tooltip.content = `<section class="loading" data-uuid="${condition.reference}"><i class="fas fa-spinner fa-spin-pulse"></i></section>`;
            tooltip.class = "numero-custo-pm";

            return tooltip;
        }


        /**
         * Build Condições
         * @private
         */
        async #buildCondition () {
            if (this.tokens?.length === 0) return;
            const condition = CONFIG.statusEffects.filter(condition => condition.id !== "");
            if (condition.length === 0) return
            const actionType = "condicao";
            const actions = await Promise.all(condition.map(async condition => {
                const hasCondition = this.actors.every(actor => {
                   return actor.effects.some(effect => effect.statuses.some(status => status === condition.id) && !effect?.disabled);
               });
                const name = condition.name; 
                const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE[actionType]);
                const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`;
                const encodedValue = [actionType, condition.id].join(this.delimiter)
                return {
                    id: condition.id,
                    name,
                    img: coreModule.api.Utils.getImage(condition),
                    cssClass: `toggle${(hasCondition) ? " active": ""}`,
                    listName: listName,
                    tooltip: this.#getConditionTooltipData(condition.id, condition.name),
                    system: { actionType, actionId: condition.id },
                    encodedValue
                }
            }))
            this.addActions(actions, GROUP.condicoes)
        }

        /**
         * Build Efeitos
         * @private
         */
        async #buildEffects () {
            const actionType = "efeito";
            const effects = this.actor?.effects;
            if (effects.size === 0) return;


            const passiveEffect = new Map();
            const temporaryEffect = new Map();
            const statusStatusEffectIds = new Set(CONFIG.statusEffects.map(statusEffect => statusEffect.name));


            for (const [idEffect, effect] of effects.entries()) {
                if (effect.isSuppressed) continue;
                if (statusStatusEffectIds.has(effect.name)) continue;

                if (effect.isTemporary) {temporaryEffect.set(idEffect, effect); }
                else { passiveEffect.set(idEffect, effect); }
            }

            await Promise.all([
                this.buildActions({ groupData: { id: "efeito-passivos"}, actionData: passiveEffect, actionType}),
                this.buildActions({ groupData: { id: "efeito-temporarios"}, actionData: temporaryEffect, actionType})
            ])
        }

        #getManaCostIcon(custoPM) {     
            return (custoPM) ? `<div class="numero-custo-pm">${custoPM}<div class="custo-pm"> PM</div></div>` : "";
        }

        //}
        /**
         * @param {boolean} trained 
         * @returns {string}
         */
        #getProficiencyIcon(trained) {
            const title = trained ? "treinado" : "não treinado";
            const icon = PROFICIENCY_LEVEL_ICON[trained];
            return (icon) ? `<i class="${icon}" title=t20."${title}"></i>` : "";
        }

    }
})

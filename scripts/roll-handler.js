export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
     */
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        /**
         * Handle action click
         * Called by Token Action HUD Core when an action is left or right-clicked
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionClick (event, encodedValue) {
            const [actionTypeId, actionId] = encodedValue.split('|')

            const renderable = ['item']
            if (renderable.includes(actionTypeId) && this.isRenderItem()) {
                return this.doRenderItem(this.actor, actionId)
            }

            const knownCharacters = ['character']

            // If single actor is selected
            if (this.actor) {
                await this.#handleAction(event, this.actor, this.token, actionTypeId, actionId)
                return
            }

            const controlledTokens = canvas.tokens.controlled
                .filter((token) => knownCharacters.includes(token.actor?.type))

            // If multiple actors are selected
            for (const token of controlledTokens) {
                const actor = token.actor
                await this.#handleAction(event, actor, token, actionTypeId, actionId)
            }
        }

        /**
         * Handle action hover
         * Called by Token Action HUD Core when an action is hovered on or off
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionHover (event, encodedValue) {}

        /**
         * Handle group click
         * Called by Token Action HUD Core when a group is right-clicked while the HUD is locked
         * @override
         * @param {object} event The event
         * @param {object} group The group
         */
        async handleGroupClick (event, group) {}

        /**
         * Handle action
         * @private
         * @param {object} event        The event
         * @param {object} actor        The actor
         * @param {object} token        The token
         * @param {string} actionTypeId The action type id
         * @param {string} actionId     The actionId
         */
        async #handleAction (event, actor, token, actionTypeId, actionId) {
            switch (actionTypeId) {
                case 'pericia':
                    this.rollSkill(event, actor, actionId); 
                    break;
                case 'atributo':
                    this.rollAtributo(event, actor, actionId);
                    break;
                case 'efeito':
                    await this.toggleEffect(actor, actionId) 
                    break;
                case 'condicao':
                    if (!token) return;
                    await this.toggleCondition(actor, token, actionId); 
                    break;
                case 'feature':
                case 'item':
                case 'spell':
                case 'arma':
                    if (this.isRenderItem()) this.renderItem(actor, actionId);
                    else this.useItem(event, actor, actionId);
                    break;
                case 'utility':
                    await this.peformUtilityAction(event, actor, token, actionId);
                    break;
                }
        }

        /**
         * Handle utility action
         * @private
         * @param {object} token    The token
         * @param {string} actionId The action id
         */
        async peformUtilityAction (event, actor, token, actionId) {
            switch (actionId) {
            case 'rest':
                tormenta20.applications.RestConfigDialog.create([actor]);
                break;
            case 'iniciative':
                await this.rollIniciative(event, actor, actionId);
                break;
            case 'endTurn':
                if (game.combat?.current?.tokenId === token.id) {
                    await game.combat?.nextTurn()
                }
                break
            }
        }



        #findCondicao(actionId) {
            return CONFIG.statusEffects.find(effect => effect.id === actionId);
        }

        #findEfeito(actor, actionId) {
            return actor.effects.find(effect => effect.statuses.every(status => status === actionId));
        }

        /**
        * Toggle Effect
        * @private
        * @param {object} actor    The actor
        * @param {string} actionId The action id
        */
        async toggleEffect(actor, actionId) {
            const effect = actor.effects.find(effect => effect.id === actionId);
            if (!effect) return;

            if (this.isRightClick && !effect.transfer) {
                await effect.delete();
            } else {
                await effect.update({ disabled: !effect.disabled });
            }

            Hooks.callAll("forceUpdateTokenActionHud");
        }


        /**
         * Toggle Condition
         * @private
         * @param {object} actor    The actor
         * @param {object} token    The token
         * @param {string} actionId The action id
         */
        async toggleCondition(actor, token, actionId) {
            if (!token) return;
            const condicao = this.#findCondicao(actionId);
            if (!condicao) return;
            const efeito = this.#findEfeito(actor, actionId);
            if (efeito?.disabled) {await efeito.delete();}

            await actor.toggleStatusEffect(condicao.id, {overlay: !!this.isRightClick});

            Hooks.callAll("forceUpdateTokenActionHud");
        }

        rollSkill(event, actor, actionId) {
            if (!actor.system?.pericias) return;
            actor.rollPericia(actionId, {event: event});
        }

        async rollIniciative(event, actor, actionId) {
            if (!actor) return;
            await actor.rollPericia("inic", {event: event});
            Hooks.callAll("forceUpdateTokenActionHud");
        }

        rollAtributo(event, actor, actionId) {
            if (!actor.system?.atributos) return;
            actor.rollAtributo(actionId, {event: event});
        }

        useItem(event, actor, actionId) {
            const item = coreModule.api.Utils.getItem(actor, actionId);
            console.log(item);
            item.roll({event, legacy: false});
        }

        async handleActionHover(event) {
            const type = ["Feature", "Item", "Spell", "Arma"];
            if(!this.actor || !this.action?.system?.actionId) return;

            const {actionType, actionId} = this.action.system;

            if (!type.includes(actionType)) return;
            const item = coreModule.api.Utils.getItem(this.actor, actionId);
            if (this.isHover) {
                Hooks.call("tokenActionHudSystemActionHoverOn", event, item);
            } else {
                Hooks.call("tokenActionHudSystemActionHoverOff", event, item);
            }

        }
    }
})

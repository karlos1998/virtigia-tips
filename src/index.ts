import ToolTipDirective, { useToolTip } from "./tooltips/module";
import RockTip from "./RockTip/components/rockTip.vue";
import ItemTipContent from "./RockTip/components/itemTipContent.vue";
import type {HtmlPayload, ItemPayload, TroopPayload, NpcPayload, OtherPayload, PetPayload, RipPayload} from './RockTip/typings/payloads';
import type {ItemSchema, ItemTipContentProps} from './RockTip/typings/schematics';
import { createApp, type App } from 'vue';

export {
  ToolTipDirective,
  RockTip,
  ItemTipContent,
  useToolTip,
  HtmlPayload,
  ItemPayload,
  NpcPayload,
  OtherPayload,
  PetPayload,
  RipPayload,
  ItemSchema,
  ItemTipContentProps,
};

/**
 * Renders a RockTip component to HTML for testing purposes
 * @param payload - The payload data (npc, item, html, or other)
 * @param heroLvl - Hero level (default: 500)
 * @param heroProfession - Hero profession (default: null)
 * @param innerOnly - If true, returns only the inner content without the outer rockTip div (default: false)
 * @returns HTML string of the rendered tooltip
 */
export function renderRockTipToHtml(
  payload: NpcPayload | TroopPayload | ItemPayload | HtmlPayload | OtherPayload | RipPayload | PetPayload,
  heroLvl: number = 500,
  heroProfession: string | null = null,
  innerOnly: boolean = false
): string {
  // Create a temporary container
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { state } = useToolTip();
  const previousState = { ...state.value };
  let app: App<Element> | null = null;

  try {
    // Reset all payloads
    state.value.npcPayload = false;
    state.value.troopPayload = false;
    state.value.itemPayload = false;
    state.value.htmlPayload = false;
    state.value.otherPayload = false;
    state.value.ripPayload = false;
    state.value.petPayload = false;
    state.value.gatePayload = false;

    // Set the appropriate payload based on type
    if (
      'schema' in payload &&
      'inner' in payload.schema &&
      'attributes' in payload.schema.inner
    ) {
      state.value.itemPayload = payload as ItemPayload;
    } else if (
      'schema' in payload &&
      'inner' in payload.schema &&
      'ownerName' in payload.schema.inner
    ) {
      state.value.petPayload = payload as PetPayload;
    } else if (
      'schema' in payload &&
      'inner' in payload.schema &&
      'nick' in payload.schema.inner &&
      'lvl' in payload.schema.inner
    ) {
      state.value.ripPayload = payload as RipPayload;
    } else if (
      'schema' in payload &&
      'inner' in payload.schema &&
      'content' in payload.schema.inner
    ) {
      // This is an HTML payload
      state.value.htmlPayload = payload as HtmlPayload;
    } else if (
      'schema' in payload &&
      'inner' in payload.schema &&
      'currentHp' in payload.schema.inner &&
      'maxHp' in payload.schema.inner
    ) {
      state.value.troopPayload = payload as TroopPayload;
    } else if (
      'schema' in payload &&
      'inner' in payload.schema &&
      'lvl' in payload.schema.inner
    ) {
      state.value.npcPayload = payload as NpcPayload;
    } else if (
      'schema' in payload &&
      'inner' in payload.schema &&
      ('profession' in payload.schema.inner || 'level' in payload.schema.inner)
    ) {
      // This is an other payload
      state.value.otherPayload = payload as OtherPayload;
    }

    // Trigger the tooltip to show
    state.value.opened = true;
    state.value.positionX = 0;
    state.value.positionY = 0;

    // Populate the shared state before mounting so the synchronous renderer
    // captures the first complete render instead of an empty pre-update frame.
    app = createApp(RockTip, {
      heroLvl,
      heroProfession
    });
    app.mount(container);

    // Get the HTML content
    let html = container.innerHTML;

    // If innerOnly is true, extract the inner content
    if (innerOnly) {
      const rockTipDiv = container.querySelector('.rockTip');
      if (rockTipDiv) {
        html = rockTipDiv.innerHTML;
      }
    }

    return html;
  } catch (error) {
    throw error;
  } finally {
    app?.unmount();
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    Object.assign(state.value, previousState);
  }
}

import ToolTipDirective, { useToolTip } from "./tooltips/module";
import RockTip from "./RockTip/components/rockTip.vue";
import type {HtmlPayload, ItemPayload, NpcPayload, OtherPayload} from './RockTip/typings/payloads';
import { createApp } from 'vue';

export { ToolTipDirective, RockTip, useToolTip, HtmlPayload, ItemPayload, NpcPayload, OtherPayload };

/**
 * Renders a RockTip component to HTML for testing purposes
 * @param payload - The payload data (npc, item, html, or other)
 * @param heroLvl - Hero level (default: 500)
 * @param heroProfession - Hero profession (default: null)
 * @param baseSrc - Base source URL for images
 * @param innerOnly - If true, returns only the inner content without the outer rockTip div (default: false)
 * @returns HTML string of the rendered tooltip
 */
export function renderRockTipToHtml(
  payload: NpcPayload | ItemPayload | HtmlPayload | OtherPayload,
  heroLvl: number = 500,
  heroProfession: string | null = null,
  baseSrc: string = '',
  innerOnly: boolean = false
): string {
  // Create a temporary container
  const container = document.createElement('div');
  document.body.appendChild(container);

  try {
    // Create app instance with RockTip component
    const app = createApp(RockTip, {
      heroLvl,
      heroProfession,
      baseSrc
    });

    // Mount the app
    app.mount(container);

    // Get the tooltip state
    const { state } = useToolTip();

    // Reset all payloads
    state.value.npcPayload = false;
    state.value.itemPayload = false;
    state.value.htmlPayload = false;
    state.value.otherPayload = false;

    // Set the appropriate payload based on type
    if (
      'schema' in payload &&
      'inner' in payload.schema &&
      'lvl' in payload.schema.inner
    ) {
      // This is an NPC payload
      state.value.npcPayload = payload as NpcPayload;
    } else if (
      'schema' in payload &&
      'inner' in payload.schema &&
      'attributes' in payload.schema.inner
    ) {
      // This is an item payload
      state.value.itemPayload = payload as ItemPayload;
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
      ('profession' in payload.schema.inner || 'level' in payload.schema.inner)
    ) {
      // This is an other payload
      state.value.otherPayload = payload as OtherPayload;
    }

    // Trigger the tooltip to show
    state.value.opened = true;
    state.value.positionX = 0;
    state.value.positionY = 0;

    // Get the HTML content
    let html = container.innerHTML;

    // If innerOnly is true, extract the inner content
    if (innerOnly) {
      const rockTipDiv = container.querySelector('.rockTip');
      if (rockTipDiv) {
        html = rockTipDiv.innerHTML;
      }
    }

    // Clean up
    app.unmount();
    document.body.removeChild(container);

    return html;
  } catch (error) {
    // Clean up on error
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    throw error;
  }
}

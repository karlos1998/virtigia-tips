import {DirectiveBinding, nextTick, ref, onMounted, onUnmounted} from 'vue'
import {HtmlPayload, ItemPayload, TroopPayload, NpcPayload, OtherPayload, PetPayload, RipPayload, GatePayload} from '../RockTip/typings/payloads';
// import {useHeroStore} from "../stores/hero.store";

type TipDirection = 'top' | 'bottom' | 'left' | 'right'

// Track if mouse button is pressed globally
const isMouseButtonPressed = ref(false)

interface ToolTipState {
    opened: boolean
    otherPayload: OtherPayload | false,
    itemPayload: ItemPayload | false,
    htmlPayload: HtmlPayload | false,
    troopPayload: TroopPayload | false,
    npcPayload: NpcPayload | false,
    ripPayload: RipPayload | false,
    petPayload: PetPayload | false,
    gatePayload: GatePayload | false,
    positionX: number
    positionY: number
    element: HTMLElement | null
    target: HTMLElement | null,
    direction: TipDirection
}

const state = ref<ToolTipState>({
    opened: false,
    otherPayload: false,
    itemPayload: false,
    htmlPayload: false,
    troopPayload: false,
    npcPayload: false,
    ripPayload: false,
    petPayload: false,
    gatePayload: false,
    positionX: -9999,
    positionY: -9999,
    element: null,
    target: null,
    direction: 'top',
})



const reposition = (tipDirection: TipDirection = state.value.direction) => {
    if (!state.value.element || !state.value.target) return
    const rect = state.value.target.getBoundingClientRect()
    const bounds = state.value.target.dataset.targetBounds?.split(',').map(Number)
    const [x, y, targetWidth, targetHeight] = bounds?.length === 4 && bounds.every(Number.isFinite) && bounds[2] >= 0 && bounds[3] >= 0
        ? bounds : [rect.left, rect.top, rect.width, rect.height]
    const {width, height} = state.value.element.getBoundingClientRect()
    const padding = 6, gap = 4
    const viewportWidth = window.innerWidth, viewportHeight = window.innerHeight
    const clamp = (value: number, size: number, viewport: number) =>
        Math.max(padding, Math.min(value, viewport - size - padding))
    const centerX = x + targetWidth / 2 - width / 2
    const centerY = y + targetHeight / 2 - height / 2
    // Clamp only across the chosen side first, preserving the gap from the source.
    const candidates = {
        top: {left: clamp(centerX, width, viewportWidth), top: y - height - gap},
        bottom: {left: clamp(centerX, width, viewportWidth), top: y + targetHeight + gap},
        left: {left: x - width - gap, top: clamp(centerY, height, viewportHeight)},
        right: {left: x + targetWidth + gap, top: clamp(centerY, height, viewportHeight)},
    }
    const opposite = {top: 'bottom', bottom: 'top', left: 'right', right: 'left'} as const
    const order = [...new Set<TipDirection>([tipDirection, opposite[tipDirection], 'left', 'right', 'top', 'bottom'])]
    const fits = ({left, top}: {left: number, top: number}) => left >= padding && top >= padding &&
        left + width <= viewportWidth - padding && top + height <= viewportHeight - padding
    let position = order.map(side => candidates[side]).find(fits)
    if (!position) {
        // Oversized tips may not fit anywhere. Prefer the visible position that covers least of the source.
        const overlap = ({left, top}: {left: number, top: number}) =>
            Math.max(0, Math.min(left + width, x + targetWidth) - Math.max(left, x)) *
            Math.max(0, Math.min(top + height, y + targetHeight) - Math.max(top, y))
        position = order.map(side => ({
            left: clamp(candidates[side].left, width, viewportWidth),
            top: clamp(candidates[side].top, height, viewportHeight),
        })).sort((a, b) => overlap(a) - overlap(b))[0]
    }
    state.value.positionX = position.left + window.scrollX
    state.value.positionY = position.top + window.scrollY
}

const updateDataset = (el: HTMLElement, binding: DirectiveBinding) => {
    // const heroStore = useHeroStore();
    // console.log('binding', heroStore.getLvl(), binding.modifiers, binding.value)
    // if (binding.modifiers.npc) {
    //     el.dataset.npc = JSON.stringify(binding.value)
    // } else if (binding.modifiers.item) {
    //     el.dataset.item = JSON.stringify(binding.value)
    // } else if (binding.modifiers.other) {
    //     el.dataset.other = JSON.stringify(binding.value)
    // } else {
    //     el.dataset.html = binding.value
    // }

    const data = {
        schema: {
            inner: binding.value,
            // hero: {
            //     // level: heroStore.getLvl(),
            //     // profession: heroStore.getProfession(),
            //     level: 1,
            //     profession: 'w',
            // },
            showId: binding.modifiers['show-id'],
        }
    };

    delete el.dataset.npc;
    delete el.dataset.troop;
    delete el.dataset.item;
    delete el.dataset.other;
    delete el.dataset.html;
    delete el.dataset.rip;
    delete el.dataset.pet;
    delete el.dataset.gate;

    if (binding.modifiers.npc) {
        el.dataset.npc = JSON.stringify(data)
    } else if (binding.modifiers.troop) {
        el.dataset.troop = JSON.stringify(data)
    } else if (binding.modifiers.item) {
        el.dataset.item = JSON.stringify(data)
    } else if (binding.modifiers.other) {
        el.dataset.other = JSON.stringify(data)
    } else if (binding.modifiers.rip) {
        el.dataset.rip = JSON.stringify(data)
    } else if (binding.modifiers.pet) {
        el.dataset.pet = JSON.stringify(data)
    } else if (binding.modifiers.gate) {
        el.dataset.gate = JSON.stringify(data)
    } else {
        el.dataset.html = binding.value
        el.dataset.color = binding.modifiers.green ? 'green' : '';
    }
}

const triggerEnter = async (el: HTMLElement, binding?: DirectiveBinding) => {
    // Don't show tooltip if mouse button is pressed
    if (isMouseButtonPressed.value) {
        return
    }

    state.value.target = el
    state.value.opened = true

    state.value.gatePayload = el.dataset.gate ? JSON.parse(el.dataset.gate) : false
    state.value.troopPayload = el.dataset.troop ? JSON.parse(el.dataset.troop) : false
    state.value.npcPayload = el.dataset.npc ? JSON.parse(el.dataset.npc) : false
    state.value.itemPayload = el.dataset.item ? JSON.parse(el.dataset.item) : false
    state.value.otherPayload = el.dataset.other ? JSON.parse(el.dataset.other) : false
    state.value.ripPayload = el.dataset.rip ? JSON.parse(el.dataset.rip) : false
    state.value.petPayload = el.dataset.pet ? JSON.parse(el.dataset.pet) : false
    state.value.htmlPayload = el.dataset.html ? {
        schema: {
            inner: {
                content: el.dataset.html
            }
        }
    } : false
    let tipDirection: TipDirection = binding ? 'top' : state.value.direction
    if (binding) {
        if (binding.modifiers.bottom) {
            tipDirection = 'bottom'
        } else if (binding.modifiers.left) {
            tipDirection = 'left'
        } else if (binding.modifiers.right) {
            tipDirection = 'right'
        } else if (binding.modifiers.top) {
            tipDirection = 'top'
        }
    }

    state.value.direction = tipDirection
    await nextTick(() => {
        if (state.value.opened && state.value.target === el) reposition(tipDirection)
    })
}

const triggerOut = (el: HTMLElement, event?: Event) => {
    // Only the element that opened the tip may close it. Otherwise a late "out" from another
    // source (e.g. the map canvas under a battle window) hides a tip the cursor is still on.
    if (state.value.target && state.value.target !== el) {
        return
    }

    const mouseEvent = event as MouseEvent | undefined
    const nextElement = (mouseEvent?.relatedTarget ?? null) as Node | null
    if (event && nextElement && el.contains(nextElement)) {
        return
    }

    state.value.opened = false
    state.value.positionX = -9999
    state.value.positionY = -9999
    state.value.target = null
}

const ToolTipDirective = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        updateDataset(el, binding)

        el.addEventListener('mouseenter', async (event: Event) => {
            // The pressed flag is cleared only by a mouseup reaching the document; if that was lost
            // (released outside the window, native menu...) every tip stayed blocked until the next click.
            if ((event as MouseEvent).buttons === 0) {
                isMouseButtonPressed.value = false
            }
            await triggerEnter(el, binding)
        }, {passive: true})
        el.addEventListener('mouseout', (event: Event) => {
            triggerOut(el, event)
        })
        // We don't need element-specific mousedown and mouseup handlers anymore
        // as they're handled globally
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        updateDataset(el, binding)
    },
}

const setToolTipElement = (el: HTMLElement | null) => {
    state.value.element = el
}

export default ToolTipDirective
// Set up global event listeners for mouse button press
const setupGlobalMouseListeners = () => {
    const handleMouseDown = () => {
        isMouseButtonPressed.value = true
        // Hide any visible tooltip
        if (state.value.opened) {
            state.value.opened = false
            state.value.positionX = -9999
            state.value.positionY = -9999
            state.value.target = null
        }
    }

    const handleMouseUp = (event: MouseEvent) => {
        isMouseButtonPressed.value = false

        // Use a small timeout to ensure the DOM has settled after drag operations
        setTimeout(() => {
            // Check if mouse is over an element with a tooltip
            const elementUnderMouse = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement
            if (elementUnderMouse) {
                // Find the closest element with a tooltip (v-tip directive)
                let currentElement: HTMLElement | null = elementUnderMouse
                while (currentElement) {
                    if (currentElement.dataset.troop || currentElement.dataset.gate ||
                        currentElement.dataset.npc || currentElement.dataset.item || 
                        currentElement.dataset.other || currentElement.dataset.html ||
                        currentElement.dataset.rip || currentElement.dataset.pet) {
                        // Found an element with a tooltip, trigger it
                        triggerEnter(currentElement)
                        break
                    }
                    currentElement = currentElement.parentElement
                }
            }
        }, 10); // Small delay to ensure DOM is updated after drag
    }

    // Add event listeners to document
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('dragend', handleMouseUp)
    document.addEventListener('drop', handleMouseUp)

    // Clean up function to remove event listeners
    return () => {
        document.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('dragend', handleMouseUp)
        document.removeEventListener('drop', handleMouseUp)
    }
}

// Set up global listeners only in a browser. Consumers can import the
// stateless item content component during SSR or tests without a DOM.
if (typeof document !== 'undefined') {
    setupGlobalMouseListeners()
}

export const useToolTip = () => {
    return {
        state,
        setToolTipElement,
        triggerEnter,
        triggerOut,
        reposition
    }
}

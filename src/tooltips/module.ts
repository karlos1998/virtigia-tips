import {DirectiveBinding, nextTick, ref, onMounted, onUnmounted} from 'vue'
import {HtmlPayload, ItemPayload, NpcPayload, OtherPayload} from '../RockTip/typings/payloads';
// import {useHeroStore} from "../stores/hero.store";

type TipDirection = 'top' | 'bottom' | 'left' | 'right'

// Track if mouse button is pressed globally
const isMouseButtonPressed = ref(false)

interface ToolTipState {
    opened: boolean
    otherPayload: OtherPayload | false,
    itemPayload: ItemPayload | false,
    htmlPayload: HtmlPayload | false,
    npcPayload: NpcPayload | false,
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
    npcPayload: false,
    positionX: -9999,
    positionY: -9999,
    element: null,
    target: null,
    direction: 'top',
})

const reposition = (tipDirection?: TipDirection) => {
    if (!state.value.element || !state.value.target) {
        return
    }
    const tip = state.value.element

    if (!tipDirection) {
        tipDirection = state.value.direction
    }

    state.value.direction = tipDirection
    let position = getTipPositionByDirection(tipDirection)!
    const height = tip.getBoundingClientRect().height
    const width = tip.getBoundingClientRect().width
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth

    switch (tipDirection) {
        case 'top':
            if (position.top < 0) {
                position = getTipPositionByDirection('bottom')!
            }
            if (position.left < 0) {
                position.left = 0
            }
            if (position.left + width > windowWidth - 10) {
                position.left = windowWidth - width
            }
            break
        case 'bottom':
            if (position.top + height > windowHeight - 10) {
                position = getTipPositionByDirection('top')!
            }
            if (position.left < 0) {
                position.left = 0
            }
            if (position.left + width > windowWidth - 10) {
                position.left = windowWidth - width
            }
            break
        case 'left':
            if (position.left < 0) {
                position = getTipPositionByDirection('right')!
            }
            if (position.top < 0) {
                position.top = 0
            }
            if (position.top + height > windowHeight - 10) {
                position.top = windowHeight - height
            }
            break
        case 'right':
            if (position.left + width > windowWidth - 10) {
                position = getTipPositionByDirection('left')!
            }
            if (position.top < 0) {
                position.top = 0
            }
            if (position.top + height > windowHeight - 10) {
                position.top = windowHeight - height
            }
    }
    state.value.positionX = position.left + window.scrollX
    state.value.positionY = position.top + window.scrollY
}

const getTipPositionByDirection = (direction: TipDirection) => {
    const target = state.value.target!
    const targetRect = target.getBoundingClientRect()
    const tipRect = state.value.element!.getBoundingClientRect()
    let position = { left: targetRect.left, top: targetRect.top }
    let targetWidth = targetRect.width
    let targetHeight = targetRect.height
    const tipWidth = tipRect.width
    const tipHeight = tipRect.height

    if (target.dataset.targetBounds) {
        const [x, y, w, h] = target.dataset.targetBounds.split(',').map(Number)
        position = { left: x, top: y }
        targetWidth = w
        targetHeight = h
    }

    switch (direction) {
        case 'top':
            return {
                left: position.left - tipWidth / 2 + targetWidth / 2,
                top: position.top - tipHeight - 2
            }
        case 'bottom':
            return {
                left: position.left - tipWidth / 2 + targetWidth / 2,
                top: position.top + targetHeight + 2
            }
        case 'left':
            return {
                left: position.left - tipWidth - 2,
                top: position.top - tipHeight / 2 + targetHeight / 2
            }
        case 'right':
            return {
                left: position.left + targetWidth + 2,
                top: position.top - tipHeight / 2 + targetHeight / 2
            }
    }
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
    delete el.dataset.item;
    delete el.dataset.other;
    delete el.dataset.html;

    if (binding.modifiers.npc) {
        el.dataset.npc = JSON.stringify(data)
    } else if (binding.modifiers.item) {
        el.dataset.item = JSON.stringify(data)
    } else if (binding.modifiers.other) {
        el.dataset.other = JSON.stringify(data)
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

    state.value.npcPayload = el.dataset.npc ? JSON.parse(el.dataset.npc) : false
    state.value.itemPayload = el.dataset.item ? JSON.parse(el.dataset.item) : false
    state.value.otherPayload = el.dataset.other ? JSON.parse(el.dataset.other) : false
    state.value.htmlPayload = el.dataset.html ? {
        schema: {
            inner: {
                content: el.dataset.html
            }
        }
    } : false
    let tipDirection: TipDirection = state.value.direction
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

    await nextTick(() => {
        reposition(tipDirection)
    })
}

const triggerOut = (el: HTMLElement, event?: Event) => {
    const mouseEvent = event as MouseEvent | undefined
    /** @ts-ignore */
    if (event && el.contains(mouseEvent.toElement)) {
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

const setToolTipElement = (el: HTMLElement) => {
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
                    if (currentElement.dataset.npc || currentElement.dataset.item || 
                        currentElement.dataset.other || currentElement.dataset.html) {
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
        document.addEventListener('dragend', handleMouseUp)
        document.addEventListener('drop', handleMouseUp)
    }
}

// Set up global listeners when module is imported
setupGlobalMouseListeners()

export const useToolTip = () => {
    return {
        state,
        setToolTipElement,
        triggerEnter,
        triggerOut
    }
}

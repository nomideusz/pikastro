/**
 * Portal action to move an element to a specific target in the DOM (default: body)
 * Useful for modals/tooltips to escape stacking contexts (z-index, transform, overflow)
 */
export function portal(node: HTMLElement, target: HTMLElement | string = 'body') {
    let targetEl: HTMLElement | null;

    async function update(newTarget: HTMLElement | string) {
        if (typeof newTarget === 'string') {
            targetEl = document.querySelector(newTarget);
        } else {
            targetEl = newTarget;
        }

        if (targetEl) {
            targetEl.appendChild(node);
        } else {
            // If target not found immediately (e.g. during SSR hydration), try waiting a tick or fallback to body
            if (typeof document !== 'undefined') {
                document.body.appendChild(node);
            }
        }
    }

    update(target);

    return {
        update,
        destroy() {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }
    };
}

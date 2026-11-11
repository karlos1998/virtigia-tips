const HTML_ESCAPES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

export function escapeTipHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]);
}

/**
 * "Discord: name" line for HTML tips (e.g. chat message authors), styled like the one in character tips.
 * Returns an empty string when the player has no linked Discord account.
 */
export function discordTipHtml(discordName?: string | null): string {
    const name = discordName?.trim();
    if (!name) return '';

    return `<div class="tip-discord"><span class="tip-discord__label">Discord:</span> <span class="tip-discord__name">${escapeTipHtml(name)}</span></div>`;
}

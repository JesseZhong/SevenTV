import { Twitch } from 'src/Page/Util/Twitch';
import { ChatListener } from 'src/Page/Runtime/ChatListener';
import { DataStructure } from '@typings/typings/DataStructure';
import { EmoteStore } from 'src/Page/Util/EmoteStore';

export const Page = {
	EmoteSet: [] as DataStructure.Emote[],
	EmoteStore: new EmoteStore(),
	ChatListener: new ChatListener()
};

Page.ChatListener.subscribe();

window.addEventListener('7TV#BackgroundExtMessage', event => {
	if (!(event instanceof CustomEvent)) return undefined;
	const ev = event as CustomEvent;

	if (ev.detail.tag === 'LoadChannel') { // Handle LoadChannel
		// Unload all non-global emotes from the current set
		Page.EmoteSet
			.filter(emote => !emote.global)
			.map(emote => Page.EmoteSet.splice(Page.EmoteSet.indexOf(emote), 1));

		// Append new channel emote
		Page.EmoteSet.push(...ev.detail.emotes);
	} else if (ev.detail.tag === 'MapGlobalEmotes') {
		// Unload previous global emotes from the current set
		Page.EmoteSet
			.filter(emote => emote.global)
			.map(emote => Page.EmoteSet.splice(Page.EmoteSet.indexOf(emote), 1));

		Page.EmoteSet.push(...ev.detail.emotes);
	}
});

setTimeout(() => {
	window.dispatchEvent(new Event('7TV#PageScriptReady'));
}, 50);
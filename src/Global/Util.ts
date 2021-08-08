import { DataStructure } from '@typings/typings/DataStructure';
import { Config } from 'src/Config';
import Color from 'color';
import { createTheme } from '@material-ui/core';

export function getRunningContext(): Context {
	try {
		if (!!chrome?.extension?.getBackgroundPage) {
			return 'background';
		}
		else if (typeof chrome.runtime.id !== 'undefined') {
			return 'content';
		} else {
			return 'page';
		}
	}
	catch (_) {
		return 'content';
	}
}

export function sendExtensionMessage(tag: string, data: any, callback?: ((response: any) => void), tabId?: number): void {
	if (typeof tabId === 'number') {
		chrome.tabs.sendMessage(tabId, {
			tag, data
		}, callback);
		return;
	}

	chrome.runtime.sendMessage({
		tag,
		data
	}, callback);
}

export function broadcastExtensionMessage(tag: string, data: any, callback?: ((response: any) => void)): void {
	chrome.tabs.query({ url: '*://*.twitch.tv/*' }, tabs => {
		for (const tab of tabs) {
			sendExtensionMessage(tag, data, callback, tab.id);
		}
	});
}

type Context = 'background' | 'content' | 'page';

export interface ExtensionRuntimeMessage<T = any> {
	tag: string;
	data: T;
}

export const Colors = {
	Primary: Color('#0288D1'),
	Accent: Color('#b2ff59'),
	Warning: Color('#f44336'),
	Background: Color('#303030')
};

export const theme = createTheme({
	palette: {
		primary: {
			main: '#34a0d8',
			light: '#29B6F6',
			dark: '#0288D1',
			contrastText: 'rgba(113,113,113,0.87)',
		},
		secondary: {
			main: '#f50057',
		},
		text: {
			primary: 'rgba(255,255,255,0.87)',
			secondary: 'rgba(255,255,255,0.54)',
		},
		background: {
			default: '#303030',
		},
	},
});

/**
 * @returns the cdn url to a provider's logo
 */
export function getProviderLogo(provider: DataStructure.Emote.Provider): string {
	let value = Config.cdnUrl;
	switch (provider) {
		case '7TV':
			value += '/misc/7tv-d.webp';
			break;
		case 'BTTV':
			value += '/misc/bttv.webp';
			break;
		case 'FFZ':
			value += '/misc/ffz.webp';
			break;
		case 'TWITCH':
			value += '/misc/twitch.webp';
			break;
		default:
			value += '/misc/7tv-q.webp';
			break;
	}

	return value;
}

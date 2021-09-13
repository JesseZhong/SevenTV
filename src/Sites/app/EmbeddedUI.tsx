import React from 'react';
import ReactDOM from 'react-dom';
import { EmoteMenuButton } from 'src/Sites/app/EmoteMenu/EmoteMenuButton';
import { assetStore, SiteApp } from 'src/Sites/app/SiteApp';
import { Twitch } from 'src/Sites/twitch.tv/Util/Twitch';

export class EmbeddedUI {
	/**
	 * Embedded UI manages user interface components embedded on the site
	 */
	constructor(private app: SiteApp) {
		this.embedNavButton();
	}

	/**
	 * Add a button below the chat input box
	 */
	embedChatButton(): void {
		// Add emote list button
		const buttons = document.querySelector(Twitch.Selectors.ChatInputButtonsContainer);
		if (!!buttons && !!buttons.lastChild) {
			if (buttons.querySelector('.seventv-emote-menu-button')) {
				return undefined;
			}

			const last = buttons.lastChild;
			const container = document.createElement('div');
			container.classList.add('seventv-emote-menu-button');

			last.insertBefore(container, last.lastChild ?? null);

			ReactDOM.render(<EmoteMenuButton main={this.app.mainComponent} />, container);
		}
	}

	/**
	 * Add a button on the navigation bar
	 */
	embedNavButton(): void {
		const nav = document.querySelector(Twitch.Selectors.NAV);
		const buttons = nav?.firstChild?.lastChild;

		if (!!buttons) {
			const container = document.createElement('div');
			container.classList.add('Layout-sc-nxg1ff-0');
			const icon = document.createElement('img');
			icon.src = assetStore.get('7tv.webp') ?? '';
			icon.style.width = '2.5rem';
			icon.style.height = '2.5rem';

			ReactDOM.render(<EmoteMenuButton toSettings={true} main={this.app.mainComponent} />, container);
			buttons.insertBefore(container, buttons.lastChild?.previousSibling ?? buttons);
			if (!!container.firstElementChild) {
				(container.firstElementChild as HTMLDivElement).style.width = '2.5em';
			}
		}
	}
}
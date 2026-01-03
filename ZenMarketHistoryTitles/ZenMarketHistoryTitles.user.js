// ==UserScript==
// @author      PotcFdk
// @name        ZenMarket Auction Watchlist History Titles
// @namespace   https://github.com/PotcFdk
// @description Adds buttons to make the Auction Watchlist History more readable by replacing Item IDs with Item Titles.
// @match       https://zenmarket.jp/profile/watchlist.aspx*?*history=true*
// @version     0.0.3
// @grant       none
// @icon        https://zenmarket.jp/favicon.ico
// @homepageURL https://github.com/PotcFdk/userscripts/tree/master/ZenMarketHistoryTitles
// @supportURL  https://github.com/PotcFdk/userscripts/issues
// @downloadURL https://raw.githubusercontent.com/PotcFdk/userscripts/master/ZenMarketHistoryTitles/ZenMarketHistoryTitles.user.js
// @updateURL   https://raw.githubusercontent.com/PotcFdk/userscripts/master/ZenMarketHistoryTitles/ZenMarketHistoryTitles.meta.js
// ==/UserScript==

/*
	ZenMarket Auction Watchlist History Titles - Copyright (c) PotcFdk, 2026

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

function loadAndReadTranslatedTitle(url) {
	return new Promise((resolve, reject) => {
		const iframe = document.createElement('iframe');
		iframe.style.visibility = 'hidden';
		iframe.style.position = 'fixed';
		iframe.style.top = '0';
		iframe.style.left = '0';
		iframe.style.width = '500px';
		iframe.style.height = '600px';
		//iframe.style.opacity = '0';
		//iframe.style.pointerEvents = 'none';
		//iframe.style.zIndex = '-1';

		iframe.src = url;

		iframe.onload = () => {
			try {
				const doc = iframe.contentDocument;
				const titleEl = doc.getElementById('itemTitle');

				if (!titleEl) {
					reject('itemTitle not found');
					iframe.remove();
					return;
				}

				const originalText = titleEl.textContent;

				const observer = new MutationObserver(() => {
					if (titleEl.textContent !== originalText) {
						observer.disconnect();
						resolve(titleEl.textContent);
						iframe.remove();
					}
				});

				observer.observe(titleEl, {
					childList: true,
					subtree: true,
					characterData: true
				});

				// Safety timeout
				setTimeout(() => {
					observer.disconnect();
					resolve(titleEl.textContent); // fallback
					iframe.remove();
				}, 5000);

			} catch (e) {
				reject(e);
				iframe.remove();
			}
		};

		document.body.appendChild(iframe);
	});
}

const links = document.querySelectorAll('#history-container > tr > td > a');

const queue = Array.from(links);
queue.reverse();

let activeProcesses = 0;

function process() {
	if (queue.length === 0) return;
	if (activeProcesses >= 3) return;
	++activeProcesses;
	const link = queue.pop();
	link.textContent = 'fetching...';
	const url = link.href;
	loadAndReadTranslatedTitle(url).then(translatedTitle => {
		link.textContent = translatedTitle;
		--activeProcesses;
	});
}

{
	const button = document.createElement('button');
	button.textContent = 'FETCH SINGLE';
	button.type = 'button';
	button.addEventListener('click', () => {
		process();
	});
	document.querySelector('.profile-header').parentNode.appendChild(button);
}

{
	const button = document.createElement('button');
	button.textContent = 'FETCH ALL';
	button.type = 'button';
	button.addEventListener('click', () => {
		setInterval(process, 1000);
	});
	document.querySelector('.profile-header').parentNode.appendChild(button);
}

/* Alternative without iframes. (Doesn't support translations!)

const parser = new DOMParser();
fetch(url, {credentials: 'include'}).then (async response => {
	const html = await response.text();
	//console.log(html);
	const doc = parser.parseFromString(html, 'text/html');
	const itemTitle = doc.getElementById('itemTitle');
	link.parentNode.replaceChild(itemTitle, link);
});
*/

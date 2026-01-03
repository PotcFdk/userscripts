// ==UserScript==
// @author      PotcFdk
// @name        Steam Link-Filter Bypass
// @namespace   https://github.com/PotcFdk
// @description Skips the Steam link filter.
// @include     https://steamcommunity.com/linkfilter/*
// @include     http://steamcommunity.com/linkfilter/*
// @version     0.1.0
// @grant       none
// @icon        https://steamcommunity-a.akamaihd.net/public/images//linkfilter/mascot_sir_roderick_warning.png
// @homepageURL https://github.com/PotcFdk/userscripts/tree/master/SteamLinkFilterBypass
// @supportURL  https://github.com/PotcFdk/userscripts/issues
// @downloadURL https://raw.githubusercontent.com/PotcFdk/userscripts/master/SteamLinkFilterBypass/SteamLinkFilterBypass.user.js
// @updateURL   https://raw.githubusercontent.com/PotcFdk/userscripts/master/SteamLinkFilterBypass/SteamLinkFilterBypass.meta.js
// ==/UserScript==

/*
	Steam LinkFilter Bypass - Copyright (c) PotcFdk, 2015

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

location.search.substr (1).split ('&').forEach (function (param) {
	if (param.split ('=')[0] == "url") {
		location.href = param.substr(4);
	}
});

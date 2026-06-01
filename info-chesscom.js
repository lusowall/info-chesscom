// ==UserScript==
// @name         Infos Adversaire Chess.com
// @namespace    https://github.com/lusowall
// @version      1.0
// @author       LusoWall
// @description  Displays only the opponent's public statistics. 100% fair play.
// @author       Lusowall
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        GM_addStyle
// @homepageURL  https://github.com/lusowall/info-chesscom
// @supportURL   https://github.com/lusowall/info-chesscom/issues
// @updateURL    https://raw.githubusercontent.com/lusowall/info-chesscom/main/chesscom-lichess-analyze.user.js
// @downloadURL  https://raw.githubusercontent.com/lusowall/info-chesscom/main/chesscom-lichess-analyze.user.js
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const POS_KEY = 'chessWidgetPos';

    const style = document.createElement('style');
    style.innerHTML = `
        #custom-chess-widget {
            position: fixed; top: 70px; left: 20px; z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        #chess-widget-bar { display: flex; gap: 6px; align-items: center; }
        #chess-widget-btn {
            width: 44px; height: 44px; flex-shrink: 0;
            background-color: #312e2b; border: 2px solid #423f3c; border-radius: 8px;
            color: #81b64c; font-size: 22px;
            display: flex; justify-content: center; align-items: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3); cursor: pointer; user-select: none;
        }
        #chess-widget-headline {
            height: 44px; display: flex; align-items: center; padding: 0 12px;
            background-color: #262421; border: 2px solid #423f3c; border-radius: 8px;
            color: #81b64c; font-size: 13px; font-weight: bold; white-space: nowrap;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3); cursor: pointer; user-select: none;
        }
        #chess-widget-headline.empty { color: #777; font-weight: normal; }
        #chess-widget-headline .wr { color: #c3c3c2; margin-left: 4px; }
        #custom-chess-widget.unlocked #chess-widget-btn {
            cursor: grab; border-color: #81b64c; box-shadow: 0 0 0 2px rgba(129,182,76,0.45);
        }
        #chess-widget-panel {
            display: none; margin-top: 10px; width: 280px;
            background-color: #262421; border: 1px solid #423f3c; border-radius: 8px;
            box-shadow: 0 8px 15px rgba(0,0,0,0.5); padding: 15px; color: #c3c3c2;
        }
        #chess-widget-panel-header {
            display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
        }
        #chess-widget-panel-header span { color: #fff; font-size: 13px; font-weight: bold; }
        #chess-widget-pin {
            width: 28px; height: 28px;
            background-color: #312e2b; border: 1px solid #423f3c; border-radius: 6px;
            color: #c3c3c2; font-size: 14px;
            display: flex; justify-content: center; align-items: center;
            cursor: pointer; user-select: none;
        }
        #custom-chess-widget.unlocked #chess-widget-pin { color: #81b64c; border-color: #81b64c; }
        .player-stat-card {
            background-color: #312e2b; padding: 10px; border-radius: 6px; border-left: 3px solid #cc6666;
        }
        .player-name {
            font-weight: bold; color: #fff; font-size: 14px; margin-bottom: 8px;
            border-bottom: 1px solid #423f3c; padding-bottom: 4px;
            display: flex; align-items: center; flex-wrap: wrap; gap: 4px;
        }
        .title-badge { background: #7c2929; color: #fff; font-size: 10px; font-weight: bold; padding: 1px 4px; border-radius: 3px; }
        .ban-banner { background: #5a1f1f; color: #ff9b9b; font-size: 12px; font-weight: bold; padding: 6px 8px; border-radius: 4px; margin-bottom: 8px; text-align: center; }
        .stat-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
        .stat-row .muted { opacity: 0.55; font-weight: normal; }
    `;
    document.head.appendChild(style);

    // ---------- DOM ----------
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'custom-chess-widget';

    const bar = document.createElement('div');
    bar.id = 'chess-widget-bar';

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'chess-widget-btn';
    toggleBtn.innerHTML = '📊';

    const headline = document.createElement('div');
    headline.id = 'chess-widget-headline';
    headline.classList.add('empty');
    headline.innerHTML = '…';

    bar.appendChild(toggleBtn);
    bar.appendChild(headline);

    const panel = document.createElement('div');
    panel.id = 'chess-widget-panel';

    const panelHeader = document.createElement('div');
    panelHeader.id = 'chess-widget-panel-header';
    const headerTitle = document.createElement('span');
    headerTitle.textContent = 'Stats adversaire';
    const pinBtn = document.createElement('button');
    pinBtn.id = 'chess-widget-pin';
    pinBtn.innerHTML = '📌';
    pinBtn.title = 'Cliquer pour déplacer le widget';
    panelHeader.appendChild(headerTitle);
    panelHeader.appendChild(pinBtn);

    const contentDiv = document.createElement('div');
    panel.appendChild(panelHeader);
    panel.appendChild(contentDiv);

    widgetContainer.appendChild(bar);
    widgetContainer.appendChild(panel);
    document.body.appendChild(widgetContainer);

    // ---------- Détection robuste de l'adversaire ----------
    function extractUsername(el) {
        if (!el) return null;
        const href = el.getAttribute && el.getAttribute('href');
        if (href && href.includes('/member/')) return href.split('/member/')[1].split(/[/?#]/)[0].toLowerCase();
        const data = el.getAttribute && el.getAttribute('data-username');
        if (data) return data.trim().toLowerCase();
        const txt = (el.textContent || '').trim();
        if (txt && !/\s/.test(txt) && txt.length >= 2 && txt.length <= 30) return txt.toLowerCase();
        return null;
    }
    function findUsernameEl(zone) {
        const el = zone.querySelector('a[href*="/member/"], [data-username], [class*="username"], [class*="tagline"]');
        return (el && extractUsername(el)) ? el : null;
    }
    function getOpponentEl() {
        const zones = ['.player-top', '.board-layout-top', '.board-layout-player-top',
                       '.player-component.player-top', '[class*="player-top"]'];
        for (const z of zones) {
            const zone = document.querySelector(z);
            if (zone) { const el = findUsernameEl(zone); if (el) return el; }
        }
        const candidates = [...document.querySelectorAll(
            'a[href*="/member/"], [data-username], [class*="username"], [class*="tagline"]'
        )].filter(el => extractUsername(el) &&
            !el.closest('header, nav, [class*="nav-"], [class*="header-"], [class*="sidebar"]'));
        candidates.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
        return candidates[0] || null;
    }

    // ---------- Positionnement ----------
    function applyPos(left, top) {
        const w = widgetContainer.offsetWidth || 90, h = widgetContainer.offsetHeight || 44;
        left = Math.max(0, Math.min(left, window.innerWidth - w));
        top = Math.max(0, Math.min(top, window.innerHeight - h));
        widgetContainer.style.left = left + 'px';
        widgetContainer.style.top = top + 'px';
    }
    function placeBesideOpponent() {
        const el = getOpponentEl();
        if (el) { const r = el.getBoundingClientRect(); applyPos(r.right + 12, r.top - 6); return true; }
        return false;
    }
    function loadSavedPos() {
        const saved = localStorage.getItem(POS_KEY);
        if (!saved) return false;
        try { const { left, top } = JSON.parse(saved); applyPos(left, top); return true; } catch (e) { return false; }
    }
    function savePos() {
        localStorage.setItem(POS_KEY, JSON.stringify({
            left: parseInt(widgetContainer.style.left, 10) || 20,
            top: parseInt(widgetContainer.style.top, 10) || 70
        }));
    }
    function initPosition(attempt = 0) {
        if (loadSavedPos()) return;
        if (placeBesideOpponent()) return;
        if (attempt < 20) setTimeout(() => initPosition(attempt + 1), 500);
        else applyPos(20, 70);
    }
    initPosition();
    window.addEventListener('resize', () => applyPos(
        parseInt(widgetContainer.style.left, 10) || 20, parseInt(widgetContainer.style.top, 10) || 70));

    // ---------- Déplacement / fixation ----------
    let unlocked = false, isDragging = false, moved = false, offsetX = 0, offsetY = 0;
    pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        unlocked = !unlocked;
        widgetContainer.classList.toggle('unlocked', unlocked);
        pinBtn.innerHTML = unlocked ? '✋' : '📌';
        pinBtn.title = unlocked ? 'Cliquer pour fixer la position' : 'Cliquer pour déplacer le widget';
        if (!unlocked) savePos();
    });
    toggleBtn.addEventListener('mousedown', (e) => {
        if (!unlocked) return;
        isDragging = true; moved = false;
        const r = widgetContainer.getBoundingClientRect();
        offsetX = e.clientX - r.left; offsetY = e.clientY - r.top;
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moved = true; applyPos(e.clientX - offsetX, e.clientY - offsetY);
    });
    document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; savePos(); } });

    // ---------- Helpers d'affichage ----------
    function flagEmoji(code) {
        if (!code || code.length !== 2) return '';
        return code.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
    }
    function statusLabel(s) {
        if (!s) return null;
        if (s.startsWith('closed:fair_play') || s.startsWith('closed:abuse')) return { txt: '⛔ Compte fermé (fair play)', ban: true };
        if (s.startsWith('closed')) return { txt: '🚫 Compte fermé', ban: true };
        if (['premium', 'gold', 'platinum', 'diamond'].includes(s)) return { txt: '⭐ Premium', ban: false };
        if (s === 'staff') return { txt: '🛠️ Staff Chess.com', ban: false };
        if (s === 'mod') return { txt: '🛡️ Modérateur', ban: false };
        return null;
    }
    function relTime(ts) {
        if (!ts) return null;
        const d = Date.now() / 1000 - ts;
        if (d < 180) return 'en ligne';
        if (d < 3600) return 'il y a ' + Math.round(d / 60) + ' min';
        if (d < 86400) return 'il y a ' + Math.round(d / 3600) + ' h';
        return 'il y a ' + Math.round(d / 86400) + ' j';
    }
    function row(label, value) { return `<div class="stat-row"><span>${label}</span><strong>${value}</strong></div>`; }

    // ---------- Stats (API publique) ----------
    async function fetchStats(username) {
        try {
            const [profRes, statsRes] = await Promise.all([
                fetch(`https://api.chess.com/pub/player/${username}`),
                fetch(`https://api.chess.com/pub/player/${username}/stats`)
            ]);
            const profile = await profRes.json();
            const data = await statsRes.json();

            // bilan + winrate combinés sur rapide/blitz/bullet, et elo max global
            let w = 0, l = 0, d = 0, eloMax = 0;
            for (const f of [data.chess_rapid, data.chess_blitz, data.chess_bullet]) {
                if (!f) continue;
                if (f.record) { w += f.record.win || 0; l += f.record.loss || 0; d += f.record.draw || 0; }
                if (f.best?.rating) eloMax = Math.max(eloMax, f.best.rating);
            }
            const totalGames = w + l + d;
            const winrate = totalGames > 0 ? Math.round((w / totalGames) * 100) + '%' : 'N/A';
            if (!eloMax) eloMax = data.chess_rapid?.last?.rating || data.chess_blitz?.last?.rating || 0;

            const countryCode = profile.country ? profile.country.split('/').pop() : '';

            return {
                title: profile.title || '', streamer: !!profile.is_streamer,
                flag: flagEmoji(countryCode), countryCode,
                status: profile.status || '', league: profile.league || '',
                followers: profile.followers ?? null, lastOnline: profile.last_online || null,
                joinedYear: profile.joined ? new Date(profile.joined * 1000).getFullYear() : null,
                rapid: data.chess_rapid?.last?.rating || 'Non classé', rapidBest: data.chess_rapid?.best?.rating || null,
                blitz: data.chess_blitz?.last?.rating || 'Non classé', blitzBest: data.chess_blitz?.best?.rating || null,
                bullet: data.chess_bullet?.last?.rating || null,
                daily: data.chess_daily?.last?.rating || null,
                tactics: data.tactics?.highest?.rating || 'N/A',
                puzzleRush: data.puzzle_rush?.best?.score || null,
                eloMax, winrate, totalGames, rec: { w, l, d }
            };
        } catch (e) { return null; }
    }

    function renderCard(username, s) {
        const titleBadge = s.title ? `<span class="title-badge">${s.title}</span>` : '';
        const streamer = s.streamer ? '🔴' : '';
        const st = statusLabel(s.status);
        const banner = (st && st.ban) ? `<div class="ban-banner">${st.txt}</div>` : '';
        const online = relTime(s.lastOnline);
        const age = s.joinedYear ? `${s.joinedYear} <span class="muted">(${new Date().getFullYear() - s.joinedYear} ans)</span>` : 'Inconnu';

        let rows = '';
        rows += row('Membre depuis', age);
        if (s.countryCode) rows += row('Pays', `${s.flag} ${s.countryCode}`);
        rows += row('Rapide', `${s.rapid}${s.rapidBest ? ` <span class="muted">(max ${s.rapidBest})</span>` : ''}`);
        rows += row('Blitz', `${s.blitz}${s.blitzBest ? ` <span class="muted">(max ${s.blitzBest})</span>` : ''}`);
        if (s.bullet) rows += row('Bullet', s.bullet);
        if (s.daily) rows += row('Daily', s.daily);
        rows += row('Tactiques', s.tactics);
        if (s.puzzleRush) rows += row('Puzzle Rush', s.puzzleRush);
        if (s.totalGames > 0) {
            rows += row('Bilan', `<span style="color:#81b64c">${s.rec.w}V</span> / <span style="color:#cc6666">${s.rec.l}D</span> / ${s.rec.d}N`);
            rows += row('Winrate', s.winrate);
            rows += row('Parties', s.totalGames.toLocaleString('fr-FR'));
        }
        if (s.league) rows += row('League', s.league);
        if (s.followers != null) rows += row('Followers', s.followers.toLocaleString('fr-FR'));
        if (st && !st.ban) rows += row('Statut', st.txt);
        if (online) rows += row('Vu', online);

        return `<div class="player-stat-card">
            <div class="player-name">${streamer} ${titleBadge} ${username}</div>
            ${banner}${rows}
        </div>`;
    }

    // ---------- Headline (auto, sans clic) + rafraîchissement ----------
    let currentUsername = null, currentStats = null, fetching = false;

    function setHeadline(s) {
        if (s) {
            headline.classList.remove('empty');
            headline.innerHTML = `🏆 ${s.eloMax || '?'} <span class="wr">· ${s.winrate} WR</span>`;
        } else {
            headline.classList.add('empty');
            headline.innerHTML = '…';
        }
    }

    async function refresh() {
        if (fetching) return;
        const el = getOpponentEl();
        const u = el ? extractUsername(el) : null;
        if (!u) { currentUsername = null; currentStats = null; setHeadline(null); return; }
        if (u === currentUsername && currentStats) return; // déjà à jour
        fetching = true;
        currentUsername = u;
        const s = await fetchStats(u);
        currentStats = s;
        fetching = false;
        setHeadline(s);
        if (panel.style.display === 'block') {
            contentDiv.innerHTML = s ? renderCard(u, s) : 'Erreur de récupération.';
        }
    }
    setInterval(refresh, 4000);
    setTimeout(refresh, 800);

    // ---------- Ouverture du panneau ----------
    async function openPanel() {
        panel.style.display = 'block';
        if (currentStats) { contentDiv.innerHTML = renderCard(currentUsername, currentStats); return; }
        contentDiv.innerHTML = "Recherche de l'adversaire...";
        await refresh();
        if (currentStats) contentDiv.innerHTML = renderCard(currentUsername, currentStats);
        else contentDiv.innerHTML = currentUsername ? 'Erreur de récupération.' : 'Adversaire non trouvé.';
    }
    function togglePanel() {
        if (moved) { moved = false; return; }
        if (unlocked) return;
        if (panel.style.display === 'block') { panel.style.display = 'none'; return; }
        openPanel();
    }
    toggleBtn.addEventListener('click', togglePanel);
    headline.addEventListener('click', togglePanel);
})();
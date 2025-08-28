// テーマ切り替え機能 - 全ページ共通
function setTheme(theme) {
    if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('selectedTheme', theme);
        // 他のタブにも変更を通知
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.removeItem('selectedTheme');
        // 他のタブにも変更を通知
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: null } }));
    }
    updateThemeButtons();
}

// ボタンの選択状態を更新
function updateThemeButtons() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'default';
    const buttons = document.querySelectorAll('[data-theme-button]');
    
    buttons.forEach(button => {
        const buttonTheme = button.getAttribute('data-theme-button');
        if ((currentTheme === 'default' && buttonTheme === '') || currentTheme === buttonTheme) {
            button.style.opacity = '1';
            button.style.transform = 'scale(1.05)';
        } else {
            button.style.opacity = '0.7';
            button.style.transform = 'scale(1)';
        }
    });
}

// ページ読み込み時に保存されたテーマを適用
function initializeTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        updateThemeButtons();
    }
}

// 他のタブからのテーマ変更を監視
window.addEventListener('storage', function(e) {
    if (e.key === 'selectedTheme') {
        const theme = e.newValue;
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        updateThemeButtons();
    }
});

// 同じタブ内の他のウィンドウからの変更を監視
window.addEventListener('themeChanged', function(e) {
    updateThemeButtons();
});

// DOM読み込み後にテーマを初期化
document.addEventListener('DOMContentLoaded', initializeTheme);

// カラーボタンのHTML作成関数
function createColorSwitcher() {
    const colorSwitcher = document.createElement('div');
    colorSwitcher.className = 'fixed bottom-4 right-4 z-50 bg-elevated rounded-lg shadow-lg p-4';
    colorSwitcher.style.cssText = 'background: var(--bg-elevated); border: 1px solid var(--border);';
    
    colorSwitcher.innerHTML = `
        <div class="text-sm font-bold mb-3" style="color: var(--text-heading);">カラーパターン:</div>
        <div class="flex flex-col gap-2">
            <button onclick="setTheme('')" data-theme-button="" class="px-3 py-2 rounded text-left hover:opacity-80 transition-all" style="background: linear-gradient(135deg, #32BFB9, #F8D92E); color: white;">
                <span class="font-bold">Sunny Breeze</span>
            </button>
            <button onclick="setTheme('fresh-lime-green')" data-theme-button="fresh-lime-green" class="px-3 py-2 rounded text-left hover:opacity-80 transition-all" style="background: linear-gradient(135deg, #44c59b, #c8e6a0); color: white;">
                <span class="font-bold">Fresh Lime Green</span>
            </button>
            <button onclick="setTheme('sunrise-horizon')" data-theme-button="sunrise-horizon" class="px-3 py-2 rounded text-left hover:opacity-80 transition-all" style="background: linear-gradient(135deg, #F1BE25, #98BCD5); color: white;">
                <span class="font-bold">Sunrise Horizon</span>
            </button>
        </div>
    `;
    
    return colorSwitcher;
}

// ページにカラーボタンを自動追加（index.html以外）
function autoAddColorSwitcher() {
    // 既にカラーボタンが存在しない場合のみ追加
    if (!document.querySelector('[data-theme-button]')) {
        document.body.appendChild(createColorSwitcher());
    }
}

// DOM読み込み後にカラーボタンを追加
document.addEventListener('DOMContentLoaded', autoAddColorSwitcher);
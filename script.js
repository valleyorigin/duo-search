let data = [];

// CSVデータの読み込み
fetch('data.csv')
    .then(response => response.text())
    .then(csvText => {
        data = parseCSV(csvText);
        setupEventListeners();
    })
    .catch(error => console.error('CSV読み込みエラー:', error));

// CSVの解析を行う関数
function parseCSV(text) {
    const lines = text.split('\n');
    const result = [];
    let currentLine = '';

    lines.forEach((line) => {
        currentLine += line;

        // ダブルクオートの数を数えて、1行が閉じているか確認する
        const quoteCount = (currentLine.match(/"/g) || []).length;
        if (quoteCount % 2 === 0) {
            // パース処理
            const regex = /"([^"]*)"|([^,]+)/g;
            let match;
            let fields = [];
            while ((match = regex.exec(currentLine)) !== null) {
                fields.push(match[1] || match[2]);
            }
            if (fields.length === 2) {
                result.push({ english: fields[1], japanese: fields[0] });
            }
            currentLine = ''; // リセット
        } else {
            // 改行を結合
            currentLine += '\n';
        }
    });

    return result;
}

// イベントリスナーの設定
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', function (e) {
        searchAndDisplayResults(e.target.value.trim().toLowerCase());
    });

    document.getElementById('clearButton').addEventListener('click', function () {
        document.getElementById('searchInput').value = '';
        searchAndDisplayResults('');
    });
}

// 検索処理と結果表示の関数
function searchAndDisplayResults(keyword) {
    const orSearch = keyword.includes(' or ');
    const keywords = keyword.split(orSearch ? ' or ' : ' ');

    const results = data.filter(item => {
        const englishMatch = item.english.toLowerCase();
        const japaneseMatch = item.japanese.toLowerCase();

        if (orSearch) {
            return keywords.some(k => englishMatch.includes(k) || japaneseMatch.includes(k));
        }

        return keywords.every(k => englishMatch.includes(k) || japaneseMatch.includes(k));
    });

    displayResults(results);
    displayWeblioFrame(keyword);
}

// 検索結果を表示する関数
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length > 0) {
        results.forEach(item => {
            const originalIndex = data.findIndex(d => d.english === item.english && d.japanese === item.japanese) + 1;
            const p = document.createElement('p');
            p.innerHTML = `<strong>${originalIndex} ${item.japanese}</strong><br>"${item.english}"`;
            resultsDiv.appendChild(p);
        });
    } else {
        resultsDiv.innerHTML = '<p>結果が見つかりませんでした。</p>';
    }
}

// Weblioのフレームを表示する関数
function displayWeblioFrame(keyword) {
    const weblioFrame = document.getElementById('weblioFrame');
    if (keyword) {
        const url = `https://ejje.weblio.jp/content/${encodeURIComponent(keyword)}`;
        weblioFrame.innerHTML = `<iframe src="${url}"></iframe>`;
    } else {
        weblioFrame.innerHTML = '';
    }
}

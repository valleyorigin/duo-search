let data = [];

// CSVデータの読み込み
fetch('data.csv')
    .then(response => response.text())
    .then(csvText => {
        data = parseCSV(csvText);
    })
    .catch(error => console.error('CSV読み込みエラー:', error));

// CSVの解析を行う関数
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const result = [];
    lines.forEach((line) => {
        // ダブルクオート内のコンマと改行を考慮してパース
        const regex = /("([^"]*?)")|([^,]+)/g;
        let match;
        let fields = [];
        while ((match = regex.exec(line)) !== null) {
            fields.push(match[2] || match[3]);
        }
        if (fields.length === 2) {
            result.push({ english: fields[0], japanese: fields[1] });
        }
    });
    return result;
}

// キーワード入力時の検索処理
document.getElementById('searchInput').addEventListener('input', function (e) {
    searchAndDisplayResults(e.target.value.trim().toLowerCase());
});

// バツボタンで検索窓をクリア
document.getElementById('clearButton').addEventListener('click', function () {
    document.getElementById('searchInput').value = '';
    searchAndDisplayResults('');
});

// 検索処理と結果表示の関数
function searchAndDisplayResults(keyword) {
    // AND検索とOR検索を判定
    const orSearch = keyword.includes(' or ');
    const keywords = keyword.split(orSearch ? ' or ' : ' ');

    const results = data.filter(item => {
        const englishMatch = item.english.toLowerCase();
        const japaneseMatch = item.japanese.toLowerCase();

        // OR検索
        if (orSearch) {
            return keywords.some(k => englishMatch.includes(k) || japaneseMatch.includes(k));
        }

        // AND検索
        return keywords.every(k => englishMatch.includes(k) || japaneseMatch.includes(k));
    });

    const resultsDiv = document.getElementById('results');
    if (results.length > 0) {
        resultsDiv.innerHTML = results.map(item => {
            // 元のCSVの行番号を取得（1から始まるインデックス）
            const originalIndex = data.findIndex(d => d.english === item.english && d.japanese === item.japanese) + 1;
            return `<p><strong>${originalIndex} ${item.japanese}</strong><br>"${item.english}"</p>`;
        }).join('');
    } else {
        resultsDiv.innerHTML = '<p>結果が見つかりませんでした。</p>';
    }

    // Weblioのページを同じ画面に表示
    const weblioFrame = document.getElementById('weblioFrame');
    if (keyword) {
        const url = `https://ejje.weblio.jp/content/${encodeURIComponent(keyword)}`;
        weblioFrame.innerHTML = `<iframe src="${url}"></iframe>`;
    } else {
        weblioFrame.innerHTML = '';
    }
}

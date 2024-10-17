let data = [];

// CSVデータの読み込み
fetch('data.csv')
    .then(response => response.text())
    .then(csvText => {
        data = csvText.trim().split('\n').slice(1).map(line => {
            const [english, japanese] = line.split(/,(.+)/);
            return { 
                english: english.trim(), 
                japanese: japanese.trim() 
            };
        });
    })
    .catch(error => console.error('CSV読み込みエラー:', error));

// キーワード入力時の検索処理
document.getElementById('searchInput').addEventListener('input', function (e) {
    const keyword = e.target.value.trim().toLowerCase();

    const results = data.filter(item =>
        item.english.toLowerCase().includes(keyword) ||
        item.japanese.includes(keyword)
    );

    const resultsDiv = document.getElementById('results');
    if (results.length > 0) {
        resultsDiv.innerHTML = results.map(item =>
            `<p><strong>${item.english}</strong><br>${item.japanese}</p>`
        ).join('');
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
});

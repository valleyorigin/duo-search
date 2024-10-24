document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("results");
    const clearButton = document.getElementById("clearButton");
    const weblioIframe = document.getElementById("weblioIframe");

    // CSVデータの読み込み
    fetch("data.csv")
        .then(response => response.text())
        .then(data => {
            // 改行ごとにCSVを分割し、ヘッダー行をスキップ
            const csvLines = data.split("\n").slice(1);

            // 各行をカンマ区切りで分割して、カンマが含まれている場合でも正常に処理する
            const entries = csvLines.map((line, index) => {
                // 正規表現でカンマ区切りを処理（カンマを含むデータも考慮）
                const [english, japanese] = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map(col => col.replace(/"/g, ''));
                return { number: index + 1, english, japanese };
            });

            // 検索機能
            searchInput.addEventListener("input", function() {
                const query = searchInput.value.trim().toLowerCase();
                resultsContainer.innerHTML = "";

                // Weblioページを更新
                weblioIframe.src = `https://ejje.weblio.jp/content/${query}`;

                // 検索キーワードに基づきフィルタリング
                const filteredEntries = entries.filter(entry => entry.english.toLowerCase().includes(query));

                // 結果の表示
                filteredEntries.forEach(entry => {
                    const resultElement = document.createElement("p");
                    resultElement.innerHTML = `<strong>${entry.number}</strong>. ${entry.english} - ${entry.japanese}`;
                    resultsContainer.appendChild(resultElement);
                });
            });

            // クリアボタンの機能
            clearButton.addEventListener("click", function() {
                searchInput.value = "";
                resultsContainer.innerHTML = "";
                weblioIframe.src = "";
            });
        })
        .catch(error => {
            console.error("CSV読み込みエラー:", error);
        });
});

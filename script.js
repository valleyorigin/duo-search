document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("results");
    const clearButton = document.getElementById("clearButton");
    const weblioIframe = document.getElementById("weblioIframe");

    // CSVデータの読み込み
    fetch("data.csv")
        .then(response => response.text())
        .then(data => {
            const csvLines = data.split("\n").slice(1); // 最初のヘッダー行をスキップ
            const entries = csvLines.map((line, index) => {
                const [english, japanese] = line.split(",");
                // 行番号に基づいて、CSVの2行目を1としてカウント
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

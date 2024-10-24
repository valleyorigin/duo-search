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

            // 各行をダブルクオートとカンマを考慮してパースする
            const entries = csvLines.map((line, index) => {
                // 正規表現でダブルクオートとカンマを考慮して分割
                const [english, japanese] = parseCSVLine(line);
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

    /**
     * CSVの1行を解析して、各フィールドを分割する関数
     * @param {string} line - CSVの1行の文字列
     * @returns {Array<string>} - 分割されたフィールドの配列
     */
    function parseCSVLine(line) {
        const regex = /("(?:[^"]|"")*"|[^,]*)(?=,|$)/g;
        const result = [];
        let match;

        while ((match = regex.exec(line)) !== null) {
            let field = match[0].trim();
            // ダブルクオートで囲まれている場合、それを取り除く
            if (field.startsWith('"') && field.endsWith('"')) {
                field = field.slice(1, -1).replace(/""/g, '"');
            }
            result.push(field);
        }

        return result;
    }
});

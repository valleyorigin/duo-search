/* 検索窓のスタイル */
.search-container {
    position: relative;
    width: 100%;
}

input[type="text"] {
    width: 100%;
    padding: 15px 40px 15px 15px; /* 右側にクリアボタンの余白を確保 */
    font-size: 18px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
}

.clear-btn {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    font-size: 20px;
    color: #ccc;
    cursor: pointer;
}

.clear-btn:hover {
    color: #000;
}

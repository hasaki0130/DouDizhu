import gameManager from "./gameManager";

export default class HTTP {
    // 預設 URL，這裡是本地伺服器的地址
    URL = 'http://127.0.0.1:3000'

    // 發送 HTTP 請求的方法
    // 可以傳入路徑（path）、資料（data）、回調函數（handler）、額外的 URL（extraUrl）
    getRequest(path?, data?, handeler?, extraUrl?) {
        // 如果 extraUrl 未提供，則使用預設的 URL
        if (extraUrl == null) {
            extraUrl = this.URL;
        }


        let str = "?";

        // 遍歷資料物件，將鍵值轉換為 URL 查詢字串的形式
        for (const k in data) {
            if (str != "?") {
                str += "&";
            }
            str += k + "=" + data[k];
        }

        // 組合最終的請求 URL
        var url = extraUrl + path + encodeURI(str);

        // 記錄請求的日誌
        let gameLog = "觸發時間: " + (new Date()).toLocaleTimeString() + " 請求url: " + url;
        console.log(gameLog);

        console.log("reqUrl: ", url);

        // 使用 XMLHttpRequest 物件進行 HTTP 請求
        let xhr = new XMLHttpRequest();

        // 監聽狀態改變事件
        xhr.onreadystatechange = function () {
            // 當請求完成且狀態碼為成功時執行
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {

                try {
                    // 解析回傳的 JSON 字串
                    let ret = JSON.parse(xhr.responseText);

                    // 如果提供了回調函數，則執行回調函數
                    if (handeler != null) {
                        handeler(ret);
                        console.log("觸發時間: " + (new Date()).toLocaleTimeString() + " 請求url: " + url + " 響應回調函數: " + handeler.name);

                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log(xhr.readyState);
                console.log(xhr.status);


            }
        };

        // 開啟 GET 請求，非同步
        xhr.open("GET", url, true);
        xhr.send();



        // 返回 XMLHttpRequest 物件，以便後續操作或監聽
        return xhr;
    }
    postRequest(path?, data?, handler?) {
        // 如果 extraUrl 未提供，則使用預設的 URL
        if (data == null) {
            data = {}
        }
        // 使用 XMLHttpRequest 物件進行 HTTP 請求
        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.URL + path, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    try {
                        let ret = JSON.parse(xhr.responseText);
                        console.log(ret);
                        handler(ret);
                    } catch (e) {
                        console.error('JSON 解析錯誤', e);
                    }
                } else if (xhr.status === 401) {
                    console.log('登錄失敗', xhr.status, xhr.statusText);
                    gameManager.Instance.loading.hide();
                    gameManager.Instance.alert.show("登入失敗", "帳號或密碼輸入錯誤...");
                } else {
                    console.error('HTTP 錯誤', xhr.status, xhr.statusText);
                }
            }
        };
        xhr.send(JSON.stringify(data));

    }

    // 發送POST請求到後端並帶上金額
    postAmount(amount: number) {
        const xhr = new XMLHttpRequest(); // 創建一個 XMLHttpRequest 物件
        xhr.open("POST", "http://localhost:8080/ecpayCheckout", true); // 初始化一個POST請求
        xhr.setRequestHeader("Content-Type", "text/plain"); // 設置請求頭，告訴後端請求體是純文本

        // 設置請求完成後的回調函數
        xhr.onload = function () {
            // 檢查請求是否成功完成
            if (xhr.status === 200) {
                // 處理成功的響應
                
                    var newWindow = window.open("");// 在当前窗口打开新页面
                    newWindow.document.write(xhr.responseText);// 将响应写入新页面
                    newWindow.document.close();// 关闭文档流
                    console.log(xhr.responseText);
                
            } else {
                // 處理錯誤的響應
                console.error("Error occurred: " + xhr.statusText);
            }
        };

        // 處理網絡錯誤
        xhr.onerror = function () {
            console.error("Network error");
        };

        // 發送請求
        xhr.send(amount.toString()); // 直接發送數字轉換為字符串
    }
}

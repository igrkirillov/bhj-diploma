/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (url, data, method, callback) => {
    if (method.toUpperCase() === "GET") {
        callGetOperation(url, data, callback)
    } else {
        callNotGetOperation(url, method, data, callback);
    }
};

function callGetOperation(url, data, callback) {
    let queryParameters = "";
    for (const key of Object.keys(data)) {
        if (queryParameters.length !== 0) {
            queryParameters += "&";
        }
        queryParameters += key + "=" + data[key];
    }
    let fullUrl = queryParameters.length !== 0 ? (url + "?" + queryParameters) : url;
    console.log(fullUrl);
    const xhr = new XMLHttpRequest;
    xhr.open("GET", fullUrl, true);
    xhr.responseType = "json";
    xhr.addEventListener("load", () => {
       if (xhr.readyState === xhr.DONE) {
           if (xhr.status >= 200 && xhr.status < 300) {
               callback(null, xhr.response);
           } else {
               const err = xhr.response || "Ошибка пустой ответ";
               callback(err, null);
           }
       }
    });
    try {
        xhr.send();
    } catch (e) {
        alert(e);
    }
}

function callNotGetOperation(url, method, data, callback) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData;
    for (const key of Object.keys(data)) {
        formData.append(key, data[key]);
    }
    console.log(url);
    console.log(formData);
    xhr.open( method, url);
    xhr.responseType = "json";
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(null, xhr.response);
            } else {
                const err = xhr.response || "Ошибка пустой ответ";
                callback(err, null);
            }
        }
    });
    try {
        xhr.send(formData);
    } catch (e) {
        alert(e);
    }
}

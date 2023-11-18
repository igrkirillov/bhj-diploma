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
    let fullUrl = url + "?";
    for (const key of Object.keys(data)) {
        fullUrl = fullUrl + key + "=" + data[key];
    }
    const xhr = new XMLHttpRequest;
    xhr.open("GET", fullUrl, true);
    xhr.responseType = "json";
    xhr.addEventListener("readystatechange", () => {
       if (xhr.readyState === xhr.DONE) {
           if (xhr.status >= 200 && xhr.status < 300) {
               callback(null, xhr.response);
           } else {
               callback(xhr.response, null);
           }
       }
    });
    xhr.send();
}

function callNotGetOperation(url, method, data, callback) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData;
    for (const key of Object.keys(data)) {
        formData.append(key, data[key]);
    }
    xhr.open( method, url);
    xhr.responseType = "json";
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(null, xhr.response);
            } else {
                callback(xhr.response, null);
            }
        }
    });
    xhr.send(formData);
}

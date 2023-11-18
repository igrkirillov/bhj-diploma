/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {

  static URL = "/user";

  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem("user");
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    const userDataText = localStorage.getItem("user");
    if (userDataText) {
      return JSON.parse(userDataText);
    } else {
      return undefined;
    }
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    const url = User.URL + "/current";
    createRequest(url, {}, "GET", (err, response) => {
      if (!err) {
        if (response.success) {
          const user = response.user;
          User.setCurrent(user);
        } else {
          User.unsetCurrent();
        }
      }
      callback(err, response);
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    const url = User.URL + "/login";
    createRequest(url, data, "POST", (err, response) => {
      if (!err && response && response.user) {
        User.setCurrent(response.user);
      }
      callback(err, response);
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    const url = User.URL + "/register";
    createRequest(url, data, "POST", (err, response) => {
      if (!err && response.success && response.user) {
        User.setCurrent(response.user);
      }
      callback(err, response);
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    const url = User.URL + "/logout";
    createRequest(url, {}, "POST", (err, response) => {
      if (!err && response.success) {
        User.unsetCurrent();
      }
      callback(err, response);
    });
  }
}

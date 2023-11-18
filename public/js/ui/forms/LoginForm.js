/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    const form = this.element;
    User.login(data, (err, response) => {
      if (err) {
        alert("Ошибка " + err);
      } else if (response.success && response.user) {
        form.reset();
        App.setState("user-logged");
        const modal = App.getModal("login");
        modal.close();
      } else {
        alert("Неправильный логин/пароль! " + response.error);
      }
    })
  }
}
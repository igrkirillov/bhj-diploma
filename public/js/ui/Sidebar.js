/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sideBarToggleElement = document.querySelectorAll("a.sidebar-toggle")[0];
    sideBarToggleElement.addEventListener("click", event => {
      event.preventDefault();
      const body = document.body;
      if (body.classList.contains("sidebar-collapse") || !body.classList.contains("sidebar-open")) {
        body.classList.add("sidebar-open");
        body.classList.remove("sidebar-collapse");
      } else {
        body.classList.remove("sidebar-open");
        body.classList.add("sidebar-collapse");
      }
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    this.addEventListenerOpenModal(".menu-item_register a", "register");
    this.addEventListenerOpenModal(".menu-item_login a", "login");
    this.addEventListenerLogout(".menu-item_logout a");
  }

  static addEventListenerOpenModal(linkSelector, modalId) {
    const link = document.querySelector(linkSelector);
    link.addEventListener("click", event => {
      event.preventDefault();
      const modal = App.getModal(modalId);
      modal.open();
    })
  }

  static addEventListenerLogout(linkSelector) {
    const link = document.querySelector(linkSelector);
    link.addEventListener("click", event => {
      event.preventDefault();
      User.logout(() => {
        App.setState("init");
      });
    })
  }
}
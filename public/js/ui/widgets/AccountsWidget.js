/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.checkNotNullElement(element);
    this.element = element;
    this.registerEvents();
    this.update();
  }

  checkNotNullElement(element) {
    if (element === null) {
      throw new Error("Элемент равен null");
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccountElement = document.querySelector(".create-account");
    createAccountElement.addEventListener("click", (event) => {
      const modal = App.getModal("createAccount");
      modal.open();
    });
    const accountsElements = Array.from(document.querySelectorAll(".account"));
    const accountsWidget = this;
    for (const accountElement of accountsElements) {
      accountElement.addEventListener("click", (event) => {
        event.preventDefault();
        accountsWidget.onSelectAccount(accountElement);
      });
    }
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const currentUser = User.current();
    const accountsWidget = this;
    if (currentUser) {
      Account.list({}, (err, response) => {
        if (!err) {
          if (response.success) {
            console.log(response.data);
            const activeAccountId = this.getActiveAccountId();
            accountsWidget.clear();
            for (const account of response.data) {
              accountsWidget.renderItem(account);
            }
            if (activeAccountId) {
              this.findAccountElementAndSetAsActive(activeAccountId);
            }
          } else {
            alert("Ошибка! " + response.error);
          }
        } else {
          alert("Ошибка! " + err);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accountsElements = Array.from(document.querySelectorAll(".account"));
    accountsElements.forEach(el => {
      el.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const activeAccountElement = document.querySelector(".account.active");
    if (activeAccountElement) {
      activeAccountElement.classList.remove("active");
    }
    element.classList.add("active");
    App.showPage("transactions", {account_id: element.dataset.id});
  }

  getActiveAccountId() {
    const activeAccountElement = this.getActiveAccountElement();
    return activeAccountElement && activeAccountElement.dataset.id;
  }

  getActiveAccountElement() {
    return document.querySelector(".account.active");
  }

  findAccountElementAndSetAsActive(accountId) {
    Array.from(document.querySelectorAll(".account"))
        .filter(el => el.dataset.id === accountId)
        .forEach(el => el.classList.add("active"));
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(data){
    return `<li class="account" data-id="${data.id}">
        <a href="#">
            <span>${data.name}</span>
            <span>${data.sum}</span>
        </a>
    </li>`;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    const accountsWidget = this;
    this.element.insertAdjacentHTML("beforeend", this.getAccountHTML(data));
    const accountElement = this.element.lastElementChild;
    accountElement.firstElementChild.addEventListener("click", (event) => {
      event.preventDefault();
      accountsWidget.onSelectAccount(accountElement);
      const accountId = accountElement.dataset.id;
      App.getForm("createIncome").setActiveAccount(accountId);
      App.getForm("createExpense").setActiveAccount(accountId);
    });
  }
}

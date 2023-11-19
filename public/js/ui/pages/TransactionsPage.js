/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    this.checkNotNullElement(element);
    this.element = element;
    this.registerEvents();
  }

  checkNotNullElement(element) {
    if (element === null) {
      throw new Error("Элемент равен null");
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {

  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {

  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {

  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    this.lastOptions = options;
    if (options) {
      const accountId = options["account_id"];
      Account.get(accountId, (err, response) => {
        if (!err) {
          if (response.success) {
            this.renderTitle(response.data.name);
          } else {
            alert("Ошибка!" + response.error);
          }
        } else {
          alert("Ошибка!" + err);
        }
      })
      Transaction.list({account_id: accountId}, (err, response) => {
        if (!err) {
          if (response.success) {
            this.renderTransactions(response.data);
          } else {
            alert("Ошибка!" + response.error);
          }
        } else {
          alert("Ошибка!" + err);
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTitle("Название счёта");
    this.renderTransactions([]);
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const titleElement = document.querySelector(".content-title");
    titleElement.textContent = name;
  }

  monthsNamesMap = {
    1: "января",
    2: "февраля",
    3: "марта",
    4: "апреля",
    5: "мая",
    6: "июня",
    7: "июля",
    8: "августа",
    9: "сентября",
    10: "октября",
    11: "ноября",
    12: "декабря"
  };
  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const dateAndTimeParts = date.split(/[\sT]+/);
    const dateParts = dateAndTimeParts[0].split("-");
    const timeParts = dateAndTimeParts[1].split(":");
    const dateTime = new Date(+dateParts[0], +dateParts[1], +dateParts[2], +timeParts[0], +timeParts[1]);
    return dateTime.getDate() + " " + this.monthsNamesMap[dateTime.getMonth()] + " " + dateTime.getFullYear()
        + " г." + " в "
        + dateTime.getHours() + ":" + dateTime.getMinutes();
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `
    <div class="transaction transaction_${item.type} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <!-- дата -->
            <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
        <!--  сумма -->
            ${item.sum} <span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
          <!-- в data-id нужно поместить id -->
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
              <i class="fa fa-trash"></i>  
          </button>
      </div>
    </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const contentElement = Array.from(this.element.children).filter(el => el.classList.contains("content"))[0];
    Array.from(contentElement.children).forEach(el => el.remove());
    for (const item of data) {
      contentElement.insertAdjacentHTML("beforeend", this.getTransactionHTML(item));
    }
  }
}
/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
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
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const createIncomeElement = document.querySelector(".create-income-button");
    createIncomeElement.addEventListener("click", event => {
      const modal = App.getModal("newIncome");
      modal.open();
    });

    const createExpenseElement = document.querySelector(".create-expense-button");
    createExpenseElement.addEventListener("click", event => {
      const modal = App.getModal("newExpense");
      modal.open();
    });
  }
}

/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list({}, (err, response) => {
      if (!err) {
        if (response.success) {
          this.addAccountsToDropdown(response.data);
        } else {
          alert("Ошибка! " + response.error);
        }
      } else {
        alert("Ошибка! " + err);
      }
    });
  }

  addAccountsToDropdown(accounts) {
    const selectElement = this.getSelectElement();
    for (const account of accounts) {
      selectElement.insertAdjacentHTML("beforeend", this.getOptionHTML(account));
    }
  }

  getSelectElement() {
    if (this.isExpenseForm()) {
      return document.getElementById("expense-accounts-list");
    } else if (this.isIncomeForm()) {
      return document.getElementById("income-accounts-list");
    }
  }

  getOptionHTML(account) {
    return `<option value="${account.id}">${account.name}</option>`;
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (!err) {
        if (response.success) {
          App.update();
          this.element.reset();
          const modal = this.getModal();
          modal.close();
        } else {
          alert("Ошибка! " + response.error);
        }
      } else {
        alert("Ошибка! " + err);
      }
    });
  }

  getModal() {
    if (this.isExpenseForm()) {
      return App.getModal("newExpense");
    } else if (this.isIncomeForm()) {
      return App.getModal("newIncome");
    }
  }

  isExpenseForm() {
    return this.element.closest(".modal").dataset.modalId === "newExpense";
  }

  isIncomeForm() {
    return this.element.closest(".modal").dataset.modalId === "newIncome";
  }
}
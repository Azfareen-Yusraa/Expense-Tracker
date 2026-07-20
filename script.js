/* ==========================================
   DOM Elements
========================================== */

const themeToggle = document.getElementById("themeToggle");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const type = document.getElementById("type");
const date = document.getElementById("date");

const transactionForm =
    document.getElementById("transactionForm");

const submitButton =
    document.getElementById("submitButton");

const cancelEdit =
    document.getElementById("cancelEdit");

const list =
    document.getElementById("list");

const emptyMessage =
    document.getElementById("emptyMessage");

const chartMessage =
    document.getElementById("chartMessage");

const search =
    document.getElementById("search");

const filterType =
    document.getElementById("filterType");

const filterCategory =
    document.getElementById("filterCategory");



/* ==========================================
   Constants
========================================== */

const STORAGE_KEY = "transactions";

const THEME_KEY = "theme";

const FILTER_KEY = "expenseFilters";

const DARK_THEME = "dark";

const LIGHT_THEME = "light";

const DEFAULT_CATEGORY = "Food";

const DEFAULT_TYPE = "expense";



/* ==========================================
   Variables
========================================== */

let transactions = [];

let editingTransactionId = null;

let expenseChart = null;



/* ==========================================
   Load Transactions
========================================== */

try {

    const storedTransactions =
        localStorage.getItem(STORAGE_KEY);

    transactions =
        storedTransactions
        ? JSON.parse(storedTransactions)
        : [];

}
catch (error) {

    console.error(error);

    transactions = [];

}



/* ==========================================
   Save Transactions
========================================== */

function updateLocalStorage() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
    );

}



/* ==========================================
   Save Filter Preferences
========================================== */

function saveFilters() {

    const filters = {

        search:
            search.value,

        type:
            filterType.value,

        category:
            filterCategory.value

    };

    localStorage.setItem(
        FILTER_KEY,
        JSON.stringify(filters)
    );

}



/* ==========================================
   Load Filter Preferences
========================================== */

function loadFilters() {

    try {

        const filters = JSON.parse(
            localStorage.getItem(FILTER_KEY)
        );

        if (!filters) return;

        search.value = filters.search || "";
        filterType.value = filters.type || "all";
        filterCategory.value = filters.category || "all";

    }

    catch (error) {

        console.error(error);

        localStorage.removeItem(FILTER_KEY);

    }

}


/* ==========================================
   Form Submit
========================================== */

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();



        if (
            text.value.trim() === "" ||
            amount.value === "" ||
            date.value === ""
        ) {

            alert(
                "Please fill in all required fields."
            );

            return;

        }



        let transactionAmount =
            Number(amount.value);



        if (transactionAmount <= 0) {

            alert(
                "Amount must be greater than zero."
            );

            return;

        }



        transactionAmount =
            type.value === DEFAULT_TYPE
            ? -Math.abs(transactionAmount)
            : Math.abs(transactionAmount);



        const transaction = {

            id:
                editingTransactionId
                || crypto.randomUUID(),

            text:
                text.value.trim(),

            amount:
                transactionAmount,

            type:
                type.value,

            category:
                category.value,

            date:
                date.value

        };



        if (editingTransactionId) {

            const index =
                transactions.findIndex(
                    item =>
                    item.id === editingTransactionId
                );

            if (index !== -1) {

                transactions[index] =
                    transaction;

            }

        }

        else {

            transactions.unshift(transaction);

        }



        updateLocalStorage();

        displayTransactions();

        resetForm();

    }

);



/* ==========================================
   Reset Form
========================================== */

function resetForm() {

    transactionForm.reset();



    category.value =
        DEFAULT_CATEGORY;

    type.value =
        DEFAULT_TYPE;



    date.value =
        new Date()
            .toISOString()
            .split("T")[0];



    editingTransactionId = null;



    submitButton.textContent =
        "Add Transaction";



    cancelEdit.classList.add(
        "hidden"
    );

}



/* ==========================================
   Currency Formatter
========================================== */

function formatCurrency(value) {

    return new Intl.NumberFormat(

        "en-IN",

        {

            style: "currency",

            currency: "INR",

            maximumFractionDigits: 2

        }

    ).format(value);

}
/* ==========================================
   Display Transactions
========================================== */

function displayTransactions() {

    list.innerHTML = "";



    const searchText =
        search.value
        .trim()
        .toLowerCase();



    const filteredTransactions =
        transactions.filter(transaction => {

            const matchesSearch =
                transaction.text
                .toLowerCase()
                .includes(searchText);

            const matchesType =
                filterType.value === "all" ||
                transaction.type === filterType.value;

            const matchesCategory =
                filterCategory.value === "all" ||
                transaction.category === filterCategory.value;

            return (
                matchesSearch &&
                matchesType &&
                matchesCategory
            );

        });



    saveFilters();



    if (filteredTransactions.length === 0) {

        emptyMessage.style.display = "block";

        list.innerHTML = "";

        updateSummary();

        updateChart();

        return;

    }



    emptyMessage.style.display = "none";



    filteredTransactions.forEach(transaction => {

        const li =
            document.createElement("li");



        /* ==========================
           Transaction Info
        ========================== */

        const info =
            document.createElement("div");

        info.className =
            "transaction-info";



        const title =
            document.createElement("strong");

        title.textContent =
            transaction.text;



        const details =
            document.createElement("small");

        details.textContent =
            `${transaction.type.toUpperCase()} • ${transaction.category} • ${transaction.date}`;



        info.appendChild(title);

        info.appendChild(details);



        /* ==========================
           Actions
        ========================== */

        const actions =
            document.createElement("div");

        actions.className =
            "transaction-actions";



        const amountText =
            document.createElement("span");

        amountText.className =
            transaction.amount > 0
            ? "plus"
            : "minus";

        amountText.textContent =
            formatCurrency(
                Math.abs(transaction.amount)
            );



        /* ==========================
           Edit Button
        ========================== */

        const editButton =
            document.createElement("button");

        editButton.innerHTML = "✏️";

        editButton.title =
            "Edit Transaction";

        editButton.setAttribute(
            "aria-label",
            "Edit Transaction"
        );

        editButton.addEventListener(
            "click",
            () => editTransaction(transaction.id)
        );



        /* ==========================
           Delete Button
        ========================== */

        const deleteButton =
            document.createElement("button");

        deleteButton.innerHTML = "🗑️";

        deleteButton.className =
            "delete-btn";

        deleteButton.title =
            "Delete Transaction";

        deleteButton.setAttribute(
            "aria-label",
            "Delete Transaction"
        );

        deleteButton.addEventListener(
            "click",
            () => deleteTransaction(transaction.id)
        );



        actions.appendChild(amountText);

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);



        li.appendChild(info);

        li.appendChild(actions);



        list.appendChild(li);

    });



    updateSummary();

    updateChart();

}
/* ==========================================
   Update Summary
========================================== */

function updateSummary() {

    const totalIncome = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );



    const totalExpense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );



    const totalBalance =
        totalIncome + totalExpense;



    balance.textContent =
        formatCurrency(totalBalance);



    income.textContent =
        formatCurrency(totalIncome);



    expense.textContent =
        formatCurrency(
            Math.abs(totalExpense)
        );

}





/* ==========================================
   Update Expense Chart
========================================== */

function updateChart() {

    const expenseCategories = {};



    transactions

        .filter(
            transaction =>
                transaction.amount < 0
        )

        .forEach(transaction => {

            expenseCategories[
                transaction.category
            ] =

                (
                    expenseCategories[
                        transaction.category
                    ] || 0
                )

                +

                Math.abs(
                    transaction.amount
                );

        });



    const labels =
        Object.keys(expenseCategories);



    const values =
        Object.values(expenseCategories);



    const canvas =
        document.getElementById(
            "expenseChart"
        );



    if (!canvas) {

        return;

    }



    if (expenseChart) {

        expenseChart.destroy();

        expenseChart = null;

    }



    if (labels.length === 0) {

        canvas.style.display = "none";

        chartMessage.classList.remove(
            "hidden"
        );

        return;

    }



    canvas.style.display = "block";

    chartMessage.classList.add(
        "hidden"
    );



    expenseChart = new Chart(

        canvas,

        {

            type: "pie",

            data: {

                labels,

                datasets: [

                    {

                        label: "Expenses",

                        data: values,

                        backgroundColor: [

                            "#667eea",

                            "#36A2EB",

                            "#4BC0C0",

                            "#FF6384",

                            "#FF9F40",

                            "#9966FF"

                        ],

                        borderWidth: 2

                    }

                ]

            },



            options: {

                responsive: true,

                maintainAspectRatio: false,



                plugins: {

                    legend: {

                        position: "bottom"

                    },



                    tooltip: {

                        callbacks: {

                            label(context) {

                                return (

                                    context.label +

                                    ": " +

                                    formatCurrency(

                                        context.raw

                                    )

                                );

                            }

                        }

                    }

                }

            }

        }

    );

}





/* ==========================================
   Search & Filter Events
========================================== */

search.addEventListener(

    "input",

    displayTransactions

);



filterType.addEventListener(

    "change",

    displayTransactions

);



filterCategory.addEventListener(

    "change",

    displayTransactions

);
/* ==========================================
   Edit Transaction
========================================== */

function editTransaction(id) {

    const transaction =
        transactions.find(
            transaction =>
                transaction.id === id
        );

    if (!transaction) {

        return;

    }



    text.value =
        transaction.text;

    amount.value =
        Math.abs(transaction.amount);

    type.value =
        transaction.type;

    category.value =
        transaction.category;

    date.value =
        transaction.date;



    editingTransactionId =
        id;



    submitButton.textContent =
        "Update Transaction";



    cancelEdit.classList.remove(
        "hidden"
    );



    text.focus();

}





/* ==========================================
   Delete Transaction
========================================== */

function deleteTransaction(id) {

    const confirmed = confirm(

        "Are you sure you want to delete this transaction?"

    );



    if (!confirmed) {

        return;

    }



    transactions =
        transactions.filter(

            transaction =>

                transaction.id !== id

        );



    updateLocalStorage();

    displayTransactions();

}





/* ==========================================
   Cancel Editing
========================================== */

cancelEdit.addEventListener(

    "click",

    () => {

        resetForm();

    }

);





/* ==========================================
   Keyboard Shortcuts
========================================== */

document.addEventListener(

    "keydown",

    function (event) {

        /* Escape → Cancel Edit */

        if (

            event.key === "Escape"

            &&

            editingTransactionId

        ) {

            resetForm();

        }



        /* Ctrl + Enter → Submit */

        if (

            event.ctrlKey

            &&

            event.key === "Enter"

        ) {

            transactionForm.requestSubmit();

        }

    }

);
/* ==========================================
   Theme Functions
========================================== */

function loadTheme() {

    const savedTheme =
    localStorage.getItem(THEME_KEY) || LIGHT_THEME;

    if (savedTheme === DARK_THEME) {

        document.body.classList.add(DARK_THEME);

        themeToggle.textContent = "☀️";

    }
    else {

        document.body.classList.remove(DARK_THEME);

        themeToggle.textContent = "🌙";

    }

}



/* ==========================================
   Theme Toggle
========================================== */

themeToggle.addEventListener(

    "click",

    () => {

        document.body.classList.toggle(DARK_THEME);



        const isDarkMode =
            document.body.classList.contains(DARK_THEME);



        localStorage.setItem(

            THEME_KEY,

            isDarkMode
                ? DARK_THEME
                : LIGHT_THEME

        );



        themeToggle.textContent =

            isDarkMode
                ? "☀️"
                : "🌙";

    }

);





/* ==========================================
   Initial Load
========================================== */

function initializeApp() {

    /* Load Theme */

    loadTheme();



    /* Restore Filters */

    loadFilters();



    /* Reset Form */

    resetForm();



    /* Display Transactions */

    displayTransactions();

}



/* ==========================================
   Page Load
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializeApp();

    }

);

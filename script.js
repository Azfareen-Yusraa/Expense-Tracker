const themeToggle =
document.getElementById("themeToggle");

const balance = document.getElementById("balance");

const income = document.getElementById("income");

const expense = document.getElementById("expense");


const text = document.getElementById("text");

const amount = document.getElementById("amount");

const category = document.getElementById("category");
const type = document.getElementById("type");

const date = document.getElementById("date");


const list = document.getElementById("list");

const search = document.getElementById("search");

const filterType = document.getElementById("filterType");

const filterCategory = document.getElementById("filterCategory");

const transactionForm = document.getElementById("transactionForm");
const submitButton = document.getElementById("submitButton");

const cancelEdit = document.getElementById("cancelEdit");

let expenseChart;

let editingTransactionId = null;

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];




// Add Transaction

transactionForm.addEventListener(
"submit",
function(e){


    e.preventDefault();



    if(
        text.value === "" ||
        amount.value === "" ||
        date.value === ""
    ){

        alert("Please enter all details");

        return;

    }



    let transactionAmount = Number(amount.value);


if(type.value === "expense"){

    transactionAmount = -Math.abs(transactionAmount);

}
else{

    transactionAmount = Math.abs(transactionAmount);

}



const transaction = {


    id: Date.now(),


    text: text.value,


    amount: transactionAmount,


    type: type.value,


    category: category.value,


    date: date.value


};


    if (editingTransactionId !== null) {

    const index = transactions.findIndex(
        transaction => transaction.id === editingTransactionId
    );

    transactions[index] = {

        ...transaction,

        id: editingTransactionId

    };

    editingTransactionId = null;

submitButton.textContent = "Add Transaction";

cancelEdit.style.display = "none";
}
else {

    transactions.push(transaction);

}



    updateLocalStorage();


    displayTransactions();



    text.value = "";

    amount.value = "";

    category.value = "Food";
    
    type.value = "expense";
    
    date.value = "";


});






// Display Transactions

function displayTransactions() {

    list.innerHTML = "";

    const filteredTransactions = transactions.filter(transaction => {

        const matchesSearch =
            transaction.text.toLowerCase().includes(search.value.toLowerCase());

        const matchesType =
            filterType.value === "all" ||
            transaction.type === filterType.value;

        const matchesCategory =
            filterCategory.value === "all" ||
            transaction.category === filterCategory.value;

        return matchesSearch && matchesType && matchesCategory;

    });

    filteredTransactions.forEach(transaction => {

        const li = document.createElement("li");

        li.innerHTML = `

        <div class="transaction-info">

            <strong>${transaction.text}</strong>

            <br>

            <small>

                ${transaction.type ? transaction.type.toUpperCase() : ""}

                |

                ${transaction.category}

                |

                ${transaction.date}

            </small>

        </div>

        <div class="transaction-actions">

            <span class="${transaction.amount > 0 ? "plus" : "minus"}">

                ₹${Math.abs(transaction.amount)}

            </span>

            <button onclick="editTransaction(${transaction.id})">

    ✏️

</button>

<button onclick="deleteTransaction(${transaction.id})">

    🗑️

</button>

        </div>

        `;

        list.appendChild(li);

    });

    updateSummary();

    updateChart();

}







// Update Balance Summary

function updateSummary(){



    const amounts =
    transactions.map(
        transaction => transaction.amount
    );



    const total =
    amounts.reduce(
        (sum,item)=>sum + item,
        0
    );



    const totalIncome =
    amounts
    .filter(
        item => item > 0
    )
    .reduce(
        (sum,item)=>sum + item,
        0
    );



    const totalExpense =
    amounts
    .filter(
        item => item < 0
    )
    .reduce(
        (sum,item)=>sum + item,
        0
    );



    balance.innerText =
    `₹${total}`;



    income.innerText =
    `₹${totalIncome}`;



    expense.innerText =
    `₹${Math.abs(totalExpense)}`;


}








// Delete Transaction

function deleteTransaction(id){



    transactions =
    transactions.filter(
        transaction =>
        transaction.id !== id
    );



    updateLocalStorage();


    displayTransactions();



}

function editTransaction(id) {

    const transaction = transactions.find(
        transaction => transaction.id === id
    );

    if (!transaction) return;

    text.value = transaction.text;

    amount.value = Math.abs(transaction.amount);

    type.value = transaction.type;

    category.value = transaction.category;

    date.value = transaction.date;

    editingTransactionId = id;

    submitButton.textContent = "Update Transaction";

cancelEdit.style.display = "block";

}






// Local Storage

function updateLocalStorage(){


    localStorage.setItem(

        "transactions",

        JSON.stringify(transactions)

    );


}








// Expense Chart

function updateChart(){



    const expenseCategories = {};




    transactions

    .filter(
        transaction =>
        transaction.amount < 0
    )


    .forEach(transaction => {



        if(expenseCategories[transaction.category]){


            expenseCategories[transaction.category]
            += Math.abs(transaction.amount);


        }

        else{


            expenseCategories[transaction.category]
            =
            Math.abs(transaction.amount);


        }



    });





    const labels =
    Object.keys(expenseCategories);



    const values =
    Object.values(expenseCategories);





    const chartCanvas =
    document.getElementById("expenseChart");



    if(!chartCanvas){

        return;

    }





    if(expenseChart){

        expenseChart.destroy();

    }




    if(labels.length === 0){

        return;

    }





    expenseChart =
    new Chart(
        chartCanvas,
        {


        type:"pie",


        data:{


            labels:labels,


            datasets:[

                {


                label:"Expenses",


                data:values,


                backgroundColor:[

                    "#ff6384",

                    "#36a2eb",

                    "#ffce56",

                    "#4bc0c0",

                    "#9966ff",

                    "#ff9f40"


                ]


                }


            ]


        }



    });



}







// Load Data When Page Opens

// Load Theme

if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");

    themeToggle.innerHTML="☀️";

}



// Dark Mode Toggle

themeToggle.addEventListener(
"click",
()=>{


    document.body.classList.toggle("dark");


    if(document.body.classList.contains("dark")){


        localStorage.setItem(
            "theme",
            "dark"
        );


        themeToggle.innerHTML="☀️";


    }

    else{


        localStorage.setItem(
            "theme",
            "light"
        );


        themeToggle.innerHTML="🌙";


    }


});



// Load Transactions

displayTransactions();

search.addEventListener("input", displayTransactions);

filterType.addEventListener("change", displayTransactions);

filterCategory.addEventListener("change", displayTransactions);

// Cancel Edit

cancelEdit.addEventListener("click", () => {

    editingTransactionId = null;

    transactionForm.reset();

    category.value = "Food";

    type.value = "expense";

    submitButton.textContent = "Add Transaction";

    cancelEdit.style.display = "none";

});
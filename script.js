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

const transactionForm = document.getElementById("transactionForm");


let expenseChart;



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


    transactions.push(transaction);



    updateLocalStorage();


    displayTransactions();



    text.value = "";

    amount.value = "";

    category.value = "Food";
    
    type.value = "expense";
    
    date.value = "";


});






// Display Transactions

function displayTransactions(){


    list.innerHTML = "";



    transactions.forEach(transaction => {



        const li =
        document.createElement("li");



        li.innerHTML = `


        <div>


        <strong>
        ${transaction.text}
        </strong>


        <br>


        <small>

${transaction.type ? transaction.type.toUpperCase() : ""}

|

${transaction.category}

|

${transaction.date}

</small>


        </div>



        <span class="${transaction.amount > 0 ? "plus" : "minus"}">

        ₹${Math.abs(transaction.amount)}
        </span>



        <button onclick="deleteTransaction(${transaction.id})">

        X

        </button>


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

displayTransactions();
// Dark Mode

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




// Load Theme

if(localStorage.getItem("theme") === "dark"){


    document.body.classList.add("dark");


    themeToggle.innerHTML="☀️";


}
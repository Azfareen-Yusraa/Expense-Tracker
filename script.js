const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const text = document.getElementById("text");
const category = document.getElementById("category");

const date = document.getElementById("date");
const list = document.getElementById("list");


let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];



function addTransaction(){

    if(text.value === "" || amount.value === "")
    {
        alert("Please enter details");
        return;
    }


    const transaction = {

    id: Date.now(),

    text: text.value,

    amount: Number(amount.value),

    category: category.value,

    date: date.value

};


    transactions.push(transaction);


    updateLocalStorage();


    displayTransactions();


    text.value="";

amount.value="";

category.value="Food";

date.value="";

}




function displayTransactions(){

    list.innerHTML="";


    transactions.forEach(transaction=>{


        const li=document.createElement("li");


        li.innerHTML =

`

<div>

<strong>${transaction.text}</strong>

<br>

<small>
${transaction.category} | ${transaction.date}
</small>

</div>


<span class="${transaction.amount > 0 ? 'plus':'minus'}">

₹${transaction.amount}

</span>


<button onclick="deleteTransaction(${transaction.id})">

X

</button>

`;


        list.appendChild(li);


    });


    updateValues();

}





function updateValues(){


    const amounts =
    transactions.map(
        transaction=>transaction.amount
    );


    const total =
    amounts.reduce(
        (sum,item)=>sum+item,0
    );


    const incomes =
    amounts.filter(
        item=>item>0
    )
    .reduce(
        (sum,item)=>sum+item,0
    );



    const expenses =
    amounts.filter(
        item=>item<0
    )
    .reduce(
        (sum,item)=>sum+item,0
    );



    balance.innerText=
    `₹${total}`;


    income.innerText=
    `₹${incomes}`;


    expense.innerText=
    `₹${Math.abs(expenses)}`;

}




function deleteTransaction(id){


    transactions =
    transactions.filter(
        transaction=>transaction.id!==id
    );


    updateLocalStorage();

    displayTransactions();

}




function updateLocalStorage(){

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}



displayTransactions();
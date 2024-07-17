const data = {
    "customers": [
        { "id": 1, "name": "Ahmed Ali" },
        { "id": 2, "name": "Aya Elsayed" },
        { "id": 3, "name": "Mina Adel" },
        { "id": 4, "name": "Sarah Reda" },
        { "id": 5, "name": "Mohamed Sayed" }
    ],
    "transactions": [
        { "id": 1, "customer_id": 1, "date": "2022-01-01", "amount": 1000 },
        { "id": 2, "customer_id": 1, "date": "2022-01-02", "amount": 2000 },
        { "id": 3, "customer_id": 2, "date": "2022-01-01", "amount": 550 },
        { "id": 4, "customer_id": 3, "date": "2022-01-01", "amount": 500 },
        { "id": 5, "customer_id": 2, "date": "2022-01-02", "amount": 1300 },
        { "id": 6, "customer_id": 4, "date": "2022-01-01", "amount": 750 },
        { "id": 7, "customer_id": 3, "date": "2022-01-02", "amount": 1250 },
        { "id": 8, "customer_id": 5, "date": "2022-01-01", "amount": 2500 },
        { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 }
    ]
};

const customerTransactionTable = document.getElementById('customerTransactionTable');
const searchCustomerName = document.getElementById('searchCustomerName');
const searchTransactionAmount = document.getElementById('searchTransactionAmount');
const transactionChartCtx = document.getElementById('transactionChart').getContext('2d');

let transactionChart;
let currentCustomerId = null;

function loadTable() {
    customerTransactionTable.innerHTML = '';
    data.transactions.forEach(transaction => {
        const customer = data.customers.find(customer => customer.id === transaction.customer_id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>${transaction.amount}</td>
            <td>
                <button class="btn btn-transparent" onclick="renderChart(${customer.id}, 'line')">Line Graph</button>
            </td>
            <td>
                <button class="btn btn-transparent" onclick="renderChart(${customer.id}, 'bar')">Bar Graph</button>
            </td>
            <td>
                <button class="btn btn-transparent" onclick="hideChart(${customer.id})">Hide Graph</button>
            </td>
        `;
        customerTransactionTable.appendChild(row);
    });
}

function filterTable() {
    const nameFilter = searchCustomerName.value.toLowerCase();
    const amountFilter = parseFloat(searchTransactionAmount.value);

    customerTransactionTable.innerHTML = '';
    data.transactions.forEach(transaction => {
        const customer = data.customers.find(customer => customer.id === transaction.customer_id);
        if (customer.name.toLowerCase().includes(nameFilter) &&
            (isNaN(amountFilter) || transaction.amount >= amountFilter)) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${transaction.id}</td>
                <td>${transaction.date}</td>
                <td>${transaction.amount}</td>
                <td>
                    <button class="btn btn-transparent" onclick="renderChart(${customer.id}, 'line')">Line Graph</button>
                </td>
                <td>
                    <button class="btn btn-transparent" onclick="renderChart(${customer.id}, 'bar')">Bar Graph</button>
                </td>
                <td>
                    <button class="btn btn-transparent" onclick="hideChart(${customer.id})">Hide Graph</button>
                </td>
            `;
            customerTransactionTable.appendChild(row);
        }
    });
}

function renderChart(customerId, chartType) {
    if (currentCustomerId === customerId) return;

    currentCustomerId = customerId;
    const customerTransactions = data.transactions.filter(transaction => transaction.customer_id === customerId);
    const labels = [...new Set(customerTransactions.map(transaction => transaction.date))];
    const amounts = labels.map(date => {
        return customerTransactions.filter(transaction => transaction.date === date)
                                    .reduce((sum, transaction) => sum + transaction.amount, 0);
    });

    if (transactionChart) {
        transactionChart.destroy();
    }

    transactionChart = new Chart(transactionChartCtx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Transaction Amount',
                data: amounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                tension: chartType === 'line' ? 0.3 : 0
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function hideChart(customerId) {
    if (currentCustomerId !== customerId) return;

    if (transactionChart) {
        transactionChart.destroy();
        transactionChart = null;
        currentCustomerId = null;
    }
}

searchCustomerName.addEventListener('input', filterTable);
searchTransactionAmount.addEventListener('input', filterTable);

document.addEventListener('DOMContentLoaded', () => {
    loadTable();
});

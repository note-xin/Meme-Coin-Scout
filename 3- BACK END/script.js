document.addEventListener("DOMContentLoaded", () => {
    // Hide the coin info section initially
    document.querySelector('.coin-info').style.display = 'none';
});

// Function to fetch data from the backend script
function fetchData() {
    fetch('../1- SCRIPT/scraped_data.json')
        .then(response => response.json())
        .then(data => {
            displayData(data.data);
        })
        .catch(error => console.error('Error:', error));
}

// Function to display data
function displayData(data) {
    let tbody = document.getElementById('newList');
    tbody.innerHTML = ''; // Clear existing data

    data.forEach((item, index) => {
        // Create a new row and cells
        let row = document.createElement('tr');
        let pin = document.createElement('td');
        let checkbox = document.createElement('input');
        let hashCell = document.createElement('td');
        let nameCell = document.createElement('td');
        let priceCell = document.createElement('td');
        let chainCell = document.createElement('td');
        let addedCell = document.createElement('td');

        // Create a checkbox and add it to the first cell
        checkbox.type = 'checkbox';
        pin.appendChild(checkbox);

        // Add the data to the cells
        hashCell.textContent = item['#'];

        // Create an img element for the logo
        let logo = document.createElement('img');
        logo.src = item['Name'].logo;
        logo.alt = item['Name'].name + ' logo';
        logo.className = 'coinLogo';

        // Create a div element for the symbol
        let symbolDiv = document.createElement('div');
        symbolDiv.textContent = item['Name'].symbol;
        symbolDiv.style.color = '#8d8d8d';

        // Add the name, logo, and symbol to the nameCell
        nameCell.appendChild(logo);
        nameCell.appendChild(document.createTextNode(' ' + item['Name'].name + ' '));
        nameCell.appendChild(symbolDiv);

        priceCell.textContent = item['Price'];
        chainCell.textContent = item['Blockchain'];
        addedCell.textContent = item['Added'];

        // Append the cells to the row
        row.appendChild(pin);
        row.appendChild(hashCell);
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(chainCell);
        row.appendChild(addedCell);

        // Append the row to the table body
        tbody.appendChild(row);

        // Add an event listener to the checkbox
        checkbox.addEventListener('change', () => handlePinChange(checkbox, row, item));

        // Add click event to the row
        row.addEventListener('click', () => showCoinInfo(item, row));
    });
}

// Check if the data needs to be refetched
fetch('../1- SCRIPT/scraped_data.json')
    .then(response => response.json())
    .then(result => {
        let currentTime = Date.now() / 1000; // Current time in seconds
        let lastFetchTime = result.timestamp; // Last fetch time from JSON file

        if (currentTime - lastFetchTime > 3600) { // 3600 seconds = 1 hour
            fetchData(); // Fetch new data if more than 1 hour has passed
        } else {
            displayData(result.data); // Display existing data
        }
    })
    .catch(error => console.error('Error:', error));

// Handle pin change event
function handlePinChange(checkbox, row, item) {
    let pinned = document.getElementById('pinnedList');

    if (checkbox.checked) {
        // Clone the row and append it to the pinned table
        let clonedRow = row.cloneNode(true);
        clonedRow.id = 'pinned-' + item['#'];
        pinned.appendChild(clonedRow);

        // Add click event listener to the cloned row
        clonedRow.addEventListener('click', () => showCoinInfo(item, clonedRow));

        // Add event listener to update the pin status
        let clonedCheckbox = clonedRow.querySelector('input[type="checkbox"]');
        clonedCheckbox.addEventListener('change', () => {
            if (!clonedCheckbox.checked) {
                checkbox.checked = false;
                pinned.removeChild(clonedRow);
            }
        });
    } else {
        // Remove the row from the pinned table
        let clonedRow = document.getElementById('pinned-' + item['#']);
        if (clonedRow) {
            pinned.removeChild(clonedRow);
        }
    }
}

// Show coin info next to the clicked row
function showCoinInfo(item, row) {
    let coinInfo = document.querySelector('.coin-info');
    let tokenName = document.getElementById('tokenName');
    tokenName.innerHTML = `
        <span style="font-weight: bold;">${item['Name'].name}</span>
        <span style="color: #8d8d8d; font-size: 0.6em;">${item['Name'].symbol}</span>
    `;
    document.getElementById('tokenPrice').querySelector('.data-value').textContent = item['Price'];
    document.getElementById('blockchain').querySelector('.data-value').textContent = item['Blockchain'];

    updatePriceData('1h', item['1h']);
    updatePriceData('24h', item['24h']);

    document.getElementById('fullyDilutedMC').querySelector('.data-value').textContent = item['Fully Diluted Market Cap'];
    document.getElementById('volume').querySelector('.data-value').textContent = item['Volume'];

    let button = document.getElementById('gotoMarket');
    button.onclick = () => window.location.href = item['Name'].link;

    // Update the logo
    let logo = document.createElement('img');
    logo.src = item['Name'].logo;
    logo.alt = item['Name'].name + ' logo';
    logo.className = 'coinLogoSection';

    let oldLogo = coinInfo.querySelector('img');
    if (oldLogo) {
        coinInfo.removeChild(oldLogo);
    }
    coinInfo.insertBefore(logo, coinInfo.firstChild);

    // Position the coin info next to the row
    coinInfo.style.display = 'block';
    let rowRect = row.getBoundingClientRect();
    coinInfo.style.top = `${rowRect.top + window.scrollY}px`;
    coinInfo.style.left = `${rowRect.right + 10}px`; // Adjust the left position as needed
}

// Update price data with caret icons
function updatePriceData(id, data) {
    let element = document.getElementById(id).querySelector('.data-value');
    if (data.icon === 'icon-Caret-up') {
        element.innerHTML = `&#9650; ${data.change}`;
        element.style.color = '#46e622';
    } else if (data.icon === 'icon-Caret-down') {
        element.innerHTML = `&#9660; ${data.change}`;
        element.style.color = '#d01b1b';
    } else {
        element.textContent = data.change;
    }
}

# Coin Market Scout | Test Project

Coin Market Scout is a web application that fetches and displays the latest coins listed on CoinMarketCap. It scrapes data periodically and provides an interface to view and pin the recently added coins. This application aims to provide an easy way to monitor new coins, although users should be cautious as many scams can be listed on such platforms.


>**Disclaimer**: This application is for informational purposes only. Do not blindly trust the coins listed. Always perform your own research before making any investments. Also, this application uses web scraping to fetch data from CoinMarketCap, which may violate their terms of service. Using their API is way better. As this was only made for informational purposes, use at your own risk.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Scheduler Setup](#scheduler-setup)
- [Unix-based Systems](#unix-based-systems)
- [Windows](#windows)
- [Contributing](#contributing)

## Features

- Fetches and displays the latest coins listed on CoinMarketCap.
- Allows users to pin their favorite coins.
- Shows detailed information about each coin.
- Data is refreshed every hour to provide up-to-date information.

	>**Note**: Some times you have to adjust locations of css and JavaScript files in the main html.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: Python, Selenium, JSON
- **Web Scraping**: Selenium WebDriver

## Prerequisites

- Python 3.x
- Node.js (for running a local server if needed)
- Chrome WebDriver
- Required Python packages: `selenium`, `webdriver_manager`

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/coin-market-scout.git
   cd coin-market-scout

2. **Install Dependencies**
    Ensure you have `pip` installed and runnig.

   ```bash
   pip install selenium webdriver_manager

3. **Run the Scraping Script**
    Execute the Python script to fetch the latest data from CoinMarketCap:

    ```bash
    python scraper.py

4. **Set Up the Frontend**
    Open the `MECO.html` file in your web browser to view the frontend.
    If you prefer to use a local server, you can use Python's built-in HTTP server:

    ```bash
    python -m http.server
    ```

    Then open `http://localhost:8000` in your browser.


## Scheduler Setup
To automate the data fetching process every hour, you can use a task scheduler like cron on Unix-based systems or Task Scheduler on Windows.

### Unix-based Systems
Add a cron job that runs the scraper script every hour. Open the cron table:

```bash
crontab -e
```
Add the following line to schedule the script:

```plaintext
0 * * * * /usr/bin/python3 /path/to/your/scraper.py
```

### Windows
Use Task Scheduler to create a new task:

   1.  Open Task Scheduler and create a new basic task.
   2.  Set the trigger to repeat every hour.
   3.  Set the action to start a program and select python.exe.
   4.  Add the path to scraper.py as an argument.
   
## Contributing
    Contributions are welcome! Please use the code for improvements or bug fixes. As This is just done as a hobby project this will be dropped after the completion of the project.

    peace and blessings to you friend.

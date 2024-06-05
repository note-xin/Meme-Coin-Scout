import os
import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Function to fetch data
def fetch_data():
    # Configure Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")  # Prevent detection
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--start-maximized")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    # Initialize the Chrome driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    # Open the Cloudflare-protected page
    driver.set_page_load_timeout(300)  # Set the timeout in seconds
    driver.get("https://coinmarketcap.com/new/")

    # Wait for the Cloudflare challenge to complete
    WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, '//*[@id="__next"]/div[2]/div/div[2]/div/div[2]/table/tbody')))

    # Now you should be able to interact with the page

    # Find the table body
    table_body = driver.find_element(By.XPATH, '//*[@id="__next"]/div[2]/div/div[2]/div/div[2]/table/tbody') 

    # Initialize an empty list to hold the extracted data
    data = []

    # Find all rows in the table body
    table_rows = table_body.find_elements(By.TAG_NAME, 'tr')  # Assuming the first row is the header

    for row in table_rows:
        table_data = row.find_elements(By.TAG_NAME, 'td') 
        
        # Check if the row has the expected number of columns
        if len(table_data) < 9:
            continue  # Skip rows that don't have enough columns
        
        # Extract data for each column
        num = table_data[1].text.strip()  # Number

        # Extract the name, link, and logo
        name_link_tag = table_data[2].find_element(By.CSS_SELECTOR, 'a.cmc-link')
        name_tag = table_data[2].find_element(By.CSS_SELECTOR, 'p.sc-71024e3e-0.ehyBa-d')
        name = name_tag.text.strip() if name_tag else ''  # Name
        link = 'https://coinmarketcap.com' + name_link_tag.get_attribute('href') if name_link_tag else ''  # Link

        # Extract the logo source, checking if the image tag exists
        logo_tag = table_data[2].find_element(By.CSS_SELECTOR, 'img.coin-logo')
        logo = logo_tag.get_attribute('src') if logo_tag else ''  # Logo

        symbol_tag = table_data[2].find_element(By.CSS_SELECTOR, 'p.sc-71024e3e-0.OqPKt.coin-item-symbol')
        symbol = symbol_tag.text.strip() if symbol_tag else ''  # Symbol
        price = table_data[3].text.strip()  # Price

        # Extract the 1h change and icon
        # Check for two possible classes
        one_h_tag = table_data[4].find_element(By.CSS_SELECTOR, 'span.sc-4ed47bb1-0.jarZsA, span.sc-4ed47bb1-0.eFxsMT')

        one_h_icon = one_h_tag.find_element(By.TAG_NAME, 'span').get_attribute('class').split()[0] if one_h_tag and one_h_tag.find_element(By.TAG_NAME, 'span') else ''
        one_h = {
            'change': one_h_tag.text.strip() if one_h_tag else '',
            'icon': one_h_icon
        }

        # Extract the 24h change and icon
        # Check for two possible classes
        twenty_four_h_tag = table_data[5].find_element(By.CSS_SELECTOR, 'span.sc-4ed47bb1-0.jarZsA, span.sc-4ed47bb1-0.eFxsMT')

        twenty_four_h_icon = twenty_four_h_tag.find_element(By.TAG_NAME, 'span').get_attribute('class').split()[0] if twenty_four_h_tag and twenty_four_h_tag.find_element(By.TAG_NAME, 'span') else ''
        twenty_four_h = {
            'change': twenty_four_h_tag.text.strip() if twenty_four_h_tag else '',
            'icon': twenty_four_h_icon
        }

        market_cap = table_data[6].text.strip()  # Fully Diluted Market Cap
        volume = table_data[7].text.strip()  # Volume
        blockchain = table_data[8].text.strip()  # Blockchain
        added = table_data[9].text.strip()  # Added

        # Create a dictionary for the current row
        coin_data = {
            "#": num,
            "Name": {
                "name": name,
                "link": link,
                "logo": logo,
                "symbol": symbol
            },
            "Price": price,
            "1h": one_h,
            "24h": twenty_four_h,
            "Fully Diluted Market Cap": market_cap,
            "Volume": volume,
            "Blockchain": blockchain,
            "Added": added
        }

        # Add the dictionary to the list
        data.append(coin_data)

    # Add timestamp to the data
    result = {
        "data": data,
        "timestamp": time.time()
    }

    # Get the directory of the current script file
    current_dir = os.path.dirname(os.path.abspath(__file__)) 

    # Create the path to the output file in the same directory
    output_file = os.path.join(current_dir, 'scraped_data.json')

    with open(output_file, 'w', encoding='utf-8') as json_file:
        json.dump(result, json_file, indent=4)

    print(f"Data has been extracted and saved to {output_file}")

    # Close the browser
    driver.quit()

if __name__ == "__main__":
    fetch_data()



from playwright.sync_api import sync_playwright
import time

def verify_contract_management():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to Contract Management
        page.goto("http://localhost:4200/contracts/manage")
        time.sleep(2)

        # Take screenshot of the list view
        page.screenshot(path="contract-list-v2.png")
        print("Captured contract-list-v2.png")

        # Click Register a New Contract
        page.click("text=Register a New Contract")
        time.sleep(1)

        # Check label styling and asterisk
        label = page.locator("label:has-text('Contract Name')")
        # Check if asterisk is present
        asterisk = page.locator("label:has-text('Contract Name') span.text-danger")
        if asterisk.count() > 0:
            print("Found red asterisk for mandatory field")

        # Trigger validation
        page.click("button:has-text('Save and Proceed')")
        time.sleep(1)
        page.screenshot(path="contract-form-validation.png")
        print("Captured contract-form-validation.png")

        browser.close()

if __name__ == "__main__":
    verify_contract_management()

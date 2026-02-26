from playwright.sync_api import sync_playwright, expect

def verify_test_case_details(page):
    # Navigate to the test case create page
    page.goto("http://localhost:4200/test-cases/create")

    # Wait for the heading to be visible
    expect(page.get_by_role("heading", name="New TestCase")).to_be_visible()

    # Check if Seq No is disabled and has value 1
    seq_no = page.get_by_label("Seq No")
    expect(seq_no).to_be_disabled()
    expect(seq_no).to_have_value("1")

    # Check if labels are in Title Case
    expect(page.get_by_text("Test Case Name", exact=True)).to_be_visible()
    expect(page.get_by_text("Action", exact=True)).to_be_visible()
    expect(page.get_by_text("Trigger URL", exact=True)).to_be_visible()

    # Take screenshot of the form
    page.screenshot(path="/home/jules/verification/test-case-details-updated.png", full_page=True)

    # Navigate to Edit mode (assuming id 1 exists in mock)
    page.goto("http://localhost:4200/test-cases/edit/1")
    expect(page.get_by_role("heading", name="Edit TestCase")).to_be_visible()

    # Take screenshot of edit mode
    page.screenshot(path="/home/jules/verification/test-case-edit-updated.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 1200})
        try:
            verify_test_case_details(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

import os
import sys
from playwright.sync_api import sync_playwright

url = 'file:///' + os.path.abspath('index.html').replace('\\', '/')
print('Testing URL:', url)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    
    console_errors = []
    page_errors = []
    
    page.on('console', lambda msg: console_errors.append(f'[{msg.type}] {msg.text}') if msg.type in ['error'] else None)
    page.on('pageerror', lambda err: page_errors.append(str(err)))
    
    page.goto(url)
    page.wait_for_timeout(1500)
    page.screenshot(path='screenshot_intro.png')
    print('1. Intro screenshot saved!')

    # Click Comenzar Recorrido
    page.click('text=¡Comenzar Recorrido!')
    page.wait_for_timeout(1000)
    page.screenshot(path='screenshot_board.png')
    print('2. Board screenshot saved!')

    # Click Tirar Dado
    page.click('text=¡Tirar Dado!')
    page.wait_for_timeout(2500)
    page.screenshot(path='screenshot_question.png')
    print('3. Question screenshot saved!')

    # Click the first answer option inside the question modal
    options = page.locator('div.fixed.inset-0 button:has(div.font-mono-title)')
    print('Options found in modal:', options.count())
    if options.count() > 0:
        options.first.click()
        page.wait_for_timeout(1200)
        page.screenshot(path='screenshot_feedback.png')
        print('4. Feedback screenshot saved!')

    # Click Continuar Recorrido
    page.click('text=Continuar Recorrido')
    page.wait_for_timeout(1000)

    # Click Finca Progress button in header
    finca_btn = page.locator('header button:has-text("Nv")')
    if finca_btn.count() > 0:
        finca_btn.click()
        page.wait_for_timeout(1000)
        page.screenshot(path='screenshot_finca_modal.png')
        print('5. Finca modal screenshot saved!')

    browser.close()
    
    print('=== TEST RESULTS ===')
    print('Console Errors:', console_errors)
    print('Page Errors:', page_errors)
    
    if len(console_errors) > 0 or len(page_errors) > 0:
        print('FAILURE: Found errors in console or page!')
        sys.exit(1)
    else:
        print('SUCCESS: All tests passed with 0 console errors and 0 page errors!')

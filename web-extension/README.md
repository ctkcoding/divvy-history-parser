# Page‑HTML‑Ripper

This is a minimal Chromium/Firefox extension that downloads the full HTML source of the current page to the browser’s default downloads folder.

## Installation (Unpacked)

1. **Chromium/Chrome**
   * Open `chrome://extensions/`.
   * Enable *Developer mode*.
   * Click *Load unpacked* and select the `web-extension` directory.

2. **Firefox**
   * Open `about:debugging#/runtime/this-firefox`.
   * Click *Load Temporary Add‑on* and pick any file in `web-extension` (e.g., `manifest.json`).

The toolbar icon appears. Clicking it opens a small popup with a **Rip Page** button.

Press the button and the current page’s HTML will be downloaded to your default downloads folder.

## Usage

* The extension does **not** modify any site content; it merely captures the outer HTML of the page.
* It works with any page that can be fully loaded in the browser.
* The downloaded file is named `<page‑title>-<timestamp>.html`.

## Limitations

* The extension has no advanced parsing capabilities – it simply stores the raw HTML.
* The feature set may change in future releases.

## Contributions

Feel free to open issues or pull requests if you’d like to add features such as automatic parsing or data export.

# Clear Cache Instructions

If product IDs are still showing old format (1, 2, 3 or PROD-XXXX), follow these steps:

## Option 1: Browser Console (Fastest)

1. Open your browser (Chrome/Edge/Firefox)
2. Press `F12` to open Developer Tools
3. Go to the `Console` tab
4. Copy and paste this command:

```javascript
localStorage.clear();
location.reload();
```

5. Press Enter
6. The page will reload with fresh data

## Option 2: Admin Panel Reset

1. Go to http://localhost:3000/admin
2. Login with password: `hipparchus2026`
3. Click on "Settings" tab in sidebar
4. Click "Reset to Defaults" button
5. Confirm the reset

## Option 3: Manual Browser Clear

### Chrome/Edge:

1. Press `F12` to open DevTools
2. Go to `Application` tab
3. In left sidebar, expand `Local Storage`
4. Click on `http://localhost:3000`
5. Right-click → Clear
6. Refresh page (F5)

### Firefox:

1. Press `F12` to open DevTools
2. Go to `Storage` tab
3. Expand `Local Storage`
4. Click on `http://localhost:3000`
5. Right-click → Delete All
6. Refresh page (F5)

## Verify New IDs

After clearing cache, product IDs should look like:

- TX8K9L2M4N6P8Q1R3S5T7V9W
- FD7H2J4K6M8N1P3Q5R7S9T2V
- EC3W5X7Y9Z1A3B5C7D9F2H4J

**No more "PROD-" prefix or numeric IDs!**

# Admin Panel Documentation

## HIPPARCHUS TECHNOLOGIES - Admin Control Panel

### Access Information

**URL:** `http://localhost:3000/admin`

**Admin Password:** `hipparchus2026`

> ⚠️ **IMPORTANT:** This admin panel is for internal company use only. Never share the admin password publicly.

---

## Features Overview

The admin panel provides complete control over the entire website content and appearance.

### 1. Product Management

- **Create** new products
- **Edit** existing products:
  - Product name
  - Price
  - Description
  - Category
  - Images
  - Stock status
- **Delete** products
- Manage product details and specifications

### 2. Pricing & Offers

- Update product pricing in real-time
- Add discount percentages
- Create offer badges (e.g., "HOT DEAL", "LIMITED TIME")
- Automatic price calculation with discounts
- Special promotional pricing

### 3. Content Management (Header & Footer)

- **Header Settings:**
  - Company name
  - Navigation menu items
  - CTA button text and link
  - Logo customization
- **Footer Settings:**
  - Company description
  - Footer sections and links
  - Social media links
  - Copyright text

### 4. Theme & Festival Settings

- **Change website theme** for different festivals/seasons:
  - Default Theme (Purple/Pink)
  - Christmas Theme (Red/Green)
  - New Year Theme (Gold/Blue)
  - Valentine's Day Theme (Red/Pink)
  - Halloween Theme (Orange/Purple)
  - Diwali Theme (Yellow/Orange)
- Theme changes apply **instantly** across the entire website
- Seasonal banner customization
- Festival-specific color schemes

### 5. System Settings

- Reset all products and configurations to defaults
- Database management
- System information and version tracking

---

## How to Use

### Logging In

1. Navigate to `http://localhost:3000/admin`
2. Enter the admin password: `hipparchus2026`
3. Click "Access Admin Panel"

### Managing Products

1. Click on "Products" tab in the sidebar
2. To **edit** a product:
   - Each product displays its unique ID badge (e.g., "ID: PROD-TX8K9L2M4N6P8Q1R3S5T7V9W")
   - Click the "Edit" button on any product
   - Modify the fields (name, price, description, image, category)
   - Note: Product IDs are automatically generated and cannot be changed
   - Click "Save Changes"
3. To **add** a new product:
   - Click "Add New Product" button
   - Fill in all required fields (name*, price*)
   - Product ID will be **automatically generated** as a long random string
   - Click "Create Product"
4. To **delete** a product:
   - Click the "Delete" button on any product
   - Confirm deletion

**Product ID Format:**

- Each product gets a unique long random string ID (e.g., TX8K9L2M4N6P8Q1R3S5T7V9W)
- Format: 5 segments of 4 random alphanumeric characters separated by hyphens
- Automatically generated upon product creation
- Ensures global uniqueness and security

### Changing Prices & Adding Offers

1. Click on "Pricing & Offers" tab
2. Enter new price for any product
3. Add discount percentage (automatically calculates discounted price)
4. Add custom offer badges
5. Changes are saved automatically

### Updating Header & Footer

1. Click on "Header & Footer" tab
2. Edit company name, CTA button text, or footer description
3. Click "Save Changes" to apply
4. Changes reflect immediately on the website

### Switching Festival Themes

1. Click on "Theme & Festival" tab
2. Select a festival theme from the available options
3. Theme changes apply instantly across all pages
4. Preview the changes by clicking "View Site"

### Resetting to Defaults

1. Click on "Settings" tab
2. Click "Reset to Defaults" button
3. Confirm the action
4. All products and configurations return to original state

---

## Data Persistence

All changes made in the admin panel are stored in the browser's **localStorage**:

- Products data
- Site configuration
- Theme settings
- Authentication state

### Production Deployment

For production use, you should implement:

1. **Backend API** (Node.js/Express or Next.js API routes)
2. **Database** (MongoDB, PostgreSQL, MySQL)
3. **Secure Authentication** (JWT tokens, OAuth, or NextAuth.js)
4. **Image Upload Service** (AWS S3, Cloudinary)
5. **Role-Based Access Control** (Admin, Editor, Viewer roles)

---

## Important Notes

✅ **Real-time Updates:** All changes reflect immediately on the website
✅ **Data Persistence:** Data is saved automatically to localStorage
✅ **Mobile Responsive:** Admin panel works on all devices
✅ **Secure Access:** Password-protected for internal use only

⚠️ **Current Limitations:**

- Data stored in localStorage (browser-based)
- Single admin user support
- Manual image URL entry (no file upload yet)

---

## Future Enhancements

### Planned Features:

- [ ] Multiple admin user accounts with roles
- [ ] Image upload functionality
- [ ] Analytics dashboard
- [ ] Customer order management
- [ ] Email notification system
- [ ] Backup and restore functionality
- [ ] Activity logs and audit trails
- [ ] Bulk product import/export (CSV)
- [ ] SEO settings management
- [ ] Blog post management

---

## Support

For technical issues or feature requests, contact the development team.

**Admin Panel Version:** 1.0.0  
**Last Updated:** February 8, 2026

---

## Quick Commands

**View Website:** Click "View Site" button in admin header  
**Logout:** Click "Logout" button in admin header  
**Save Changes:** Click "Save Changes" button (where applicable)  
**Reset Data:** Settings → Reset to Defaults

---

**© 2026 Hipparchus Technologies. Internal Use Only.**

# StyleAura – Luxury Fashion Store CRM (Frontend Only)

A premium, responsive, and complete Fashion Store CRM designed and developed exclusively using **React.js** and **Tailwind CSS**.

---

## 💎 Official StyleAura Logo & Reference Design

- **Official Logo**: Embedded at `public/assets/logo/styleaura-logo.png` (using the official metallic purple dress mannequin insignia) in the Sidebar, Navbar, Login page, Settings, and PDF Invoices.
- **Reference Image Re-creation**: The dashboard layout precisely matches the reference design screenshot:
  - Deep royal purple sidebar (`#2D124D`) with lavender active pill, white typography, and decorative botanical artwork.
  - Soft lavender background (`#FAF5FF`) with card borders and subtle elevation.
  - **Welcome Banner**: "Welcome Back, Admin!", store status subtitle, sparkling star motifs, and the 3D purple fashion shopping bag with the white heart.
  - **4 Statistics Cards**: Total Customers (10,250 / ↑ 12%), Total Orders (5,890 / ↑ 15%), Total Products (1,200 / ↑ 8%), Avg Rating (4.8 ★ / ↑ 0.2).
  - **Sales Overview**: Smooth Recharts area graph with purple gradient and timeframe filters (Weekly, This Month, Yearly).
  - **Top Selling Products**: 3 horizontal cards (Floral Midi Dress - 1,250 Sold, Puff Sleeve Top - 980 Sold, Straight Fit Jeans - 870 Sold).
  - **Recent Orders**: Interactive table with status badges (#ST1001 Priya S, #ST1002 Deepa K, #ST1003 Meena R, #ST1004 Kavya M).
  - **Customer Feedback**: Star ratings, testimonials from Sneha R and Divya M, and verified client badges.
  - **Quick Actions**: 2x2 grid for Add Product, View Customers, View Orders, and Manage Enquiries.

---

## 🛠 Technology Stack

- **React.js 19**: Modern component architecture & hooks
- **Vite**: Ultra-fast frontend build tooling and development server
- **Tailwind CSS v4**: Utility-first luxury styling
- **React Router DOM v7**: Seamless SPA routing & protected navigation
- **Recharts**: Responsive area, bar, and pie charts
- **Lucide React**: Clean vector iconography
- **LocalStorage**: Full persistence across page reloads (zero backend required)

---

## 📂 Project Structure

```
StyleAura/
  public/
    assets/
      logo/
        styleaura-logo.png     <-- Official StyleAura uploaded logo
      images/
  src/
    components/
      Sidebar.jsx              <-- Deep purple sidebar with active pills
      Navbar.jsx               <-- Search, notifications, and profile
      StatCard.jsx             <-- Metric cards with icons & percentage tags
      SalesChart.jsx           <-- Recharts sales area chart
      ProductCard.jsx          <-- Catalog & compact top-sellers
      RecentOrders.jsx         <-- Orders table with status chips
      CustomerFeedback.jsx     <-- Testimonials & ratings
      QuickActions.jsx         <-- 2x2 action buttons
    pages/
      Login.jsx                <-- Official logo, auth form, demo toggle
      Dashboard.jsx            <-- Complete dashboard matching reference image
      Customers.jsx            <-- CRUD, search, city filter, purchase history
      Products.jsx             <-- CRUD, category filters, image upload, stock
      Orders.jsx               <-- Status workflow, manual orders, printable invoices
      Services.jsx             <-- Delivery, Returns, Exchanges, Alterations
      Reviews.jsx              <-- Star filters, admin replies, review modal
      Enquiries.jsx            <-- Bridal & bespoke styling concierge
      Reports.jsx              <-- Sales trajectory, pie charts, CSV/PDF export
      Settings.jsx             <-- Profile, password UI, store info, logo
    layouts/
      AdminLayout.jsx          <-- Persistent sidebar and top navbar layout
    context/
      AuthContext.jsx          <-- LocalStorage demo authentication
      DataContext.jsx          <-- Real-time state & reactive statistics
    hooks/
      useLocalStorage.js       <-- Storage persistence hook
    App.jsx                    <-- Router and route definitions
    main.jsx                   <-- React entry point
    index.css                  <-- Global styling, typography & print rules
  package.json
  vite.config.js
  index.html
  README.md
```

---

## 🚀 How to Run the Application

```bash
# Navigate to project folder
cd StyleAura

# Start the Vite development server
npm run dev
```

Open your browser at `http://localhost:5173` to explore StyleAura!
Demo credentials are pre-filled or can be set to any email/password.

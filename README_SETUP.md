# 🍽️ AR Menu - 3D Restaurant Experience

A full-stack web application for restaurants to showcase their menus with stunning 3D/AR visualization. Features an admin panel for restaurant management and a beautiful customer-facing interface.

## ✨ Features

### Customer Features
- 🏪 Browse multiple restaurants
- 📱 View dishes with 3D models using WebGL
- 🎯 Interactive 3D viewer with zoom, rotate, and pan
- 🎨 Beautiful, responsive UI with animations
- 📂 Category-based menu filtering
- ⭐ Featured dish highlighting

### Admin Features
- 🔐 Secure authentication system
- 🏢 Multi-restaurant management
- ➕ Create, edit, and delete menu items
- 🖼️ Image and 3D model URL support
- 🏷️ Category management
- ⭐ Featured item toggling
- 📊 Restaurant-specific dashboards

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/UI
- **3D Rendering:** @react-three/fiber + @react-three/drei
- **Authentication:** Better Auth
- **Database:** Turso (LibSQL)
- **ORM:** Drizzle
- **Animations:** Framer Motion
- **Forms:** React Hook Form

## 📦 Installation

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Set up the database:**
   
   The database is already configured with Turso. Environment variables are in `.env`:
   ```
   TURSO_CONNECTION_URL=...
   TURSO_AUTH_TOKEN=...
   BETTER_AUTH_SECRET=...
   ```

3. **Seed the database:**
   
   Run these commands in order to populate the database:
   
   ```bash
   # Seed restaurants
   bun src/db/seeds/restaurants.ts
   
   # Seed admins
   bun src/db/seeds/admins.ts
   
   # Seed menu items
   bun src/db/seeds/menu_items.ts
   
   # Seed auth users
   bun src/db/seeds/auth_users.ts
   ```

4. **Start the development server:**
   ```bash
   bun dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3001`

## 🎭 Demo Credentials

You can log in to the admin panel with any of these accounts:

### Golden Spoon Restaurant
- **Email:** admin@goldenspoon.com
- **Password:** password

### Sakura Sushi Restaurant
- **Email:** admin@sakura.com
- **Password:** password

### La Bella Italia Restaurant
- **Email:** admin@bella.com
- **Password:** password

## 📖 Usage Guide

### Customer Experience

1. **Browse Restaurants:**
   - Visit the homepage to see all available restaurants
   - Click on any restaurant card to view their menu

2. **View Menu:**
   - Filter dishes by category (Appetizers, Main Course, Desserts, Beverages)
   - View 3D models directly in the menu (auto-rotating preview)
   - Click "View in 3D" to open fullscreen 3D viewer
   - Interact with 3D models: drag to rotate, scroll to zoom, right-click to pan

### Admin Panel

1. **Login:**
   - Click "Admin Login" on the homepage
   - Enter your credentials

2. **Select Restaurant:**
   - Choose which restaurant to manage from the dashboard

3. **Manage Menu:**
   - Click "Manage Menu" to view all menu items
   - Items are organized by category

4. **Add New Dish:**
   - Click "Add Item" button
   - Fill in dish details:
     - Name (required)
     - Description
     - Price (required)
     - Category (required)
     - Image URL (optional - use Unsplash for high-quality images)
     - 3D Model URL (optional - .glb format)
     - Featured toggle
   - Click "Create Menu Item"

5. **Edit Dish:**
   - Click "Edit" on any menu item card
   - Update the information
   - Click "Save Changes"

6. **Delete Dish:**
   - Click the trash icon on any menu item
   - Confirm deletion in the dialog

## 🎨 3D Models

### Using 3D Models

The app supports GLB format 3D models. You can:

1. **Use existing models:**
   - Placeholder models are included in the seed data
   - They display a preview sphere if no valid GLB URL is provided

2. **Add your own GLB files:**
   - Upload GLB files to a CDN or file storage
   - Paste the public URL in the "3D Model URL" field
   - The model will be automatically rendered in 3D viewer

3. **Free 3D model resources:**
   - [Sketchfab](https://sketchfab.com/) - Download free food models
   - [Poly Pizza](https://poly.pizza/) - Low-poly food models
   - [Clara.io](https://clara.io/) - Free 3D model library

### 3D Viewer Controls

- **Rotate:** Click and drag
- **Zoom:** Scroll or pinch
- **Pan:** Right-click and drag
- **Auto-rotate:** Enabled by default in preview mode

## 🗂️ Project Structure

```
src/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── menu/           # Menu management
│   │   │   ├── add/        # Add menu item
│   │   │   └── edit/[id]/  # Edit menu item
│   │   └── page.tsx        # Admin login
│   ├── restaurant/[slug]/  # Restaurant menu page
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── restaurants/    # Restaurant endpoints
│   │   └── menu-items/     # Menu item endpoints
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # Shadcn UI components
│   └── Model3DViewer.tsx   # 3D model viewer component
├── db/
│   ├── schema.ts           # Database schema
│   ├── index.ts            # Database connection
│   └── seeds/              # Database seeders
└── lib/
    ├── auth.ts             # Auth server config
    └── auth-client.ts      # Auth client config
```

## 🔒 Security

- Passwords are hashed using bcrypt
- Admin routes are protected with middleware
- Session-based authentication with Better Auth
- Bearer token support for API calls

## 🎯 API Endpoints

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/[slug]` - Get restaurant with menu items

### Menu Items
- `GET /api/menu-items?restaurantId=[id]` - Get menu items for restaurant
- `POST /api/menu-items` - Create new menu item (admin)
- `PUT /api/menu-items/[id]` - Update menu item (admin)
- `DELETE /api/menu-items/[id]` - Delete menu item (admin)

### Authentication
- `POST /api/auth/sign-in` - Sign in
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session

## 🎨 Customization

### Adding More Restaurants

1. Add restaurant to database via seeds or API
2. Create admin user with email matching restaurant domain
3. Admin can now manage that restaurant's menu

### Styling

The app uses Tailwind CSS v4. Colors and design tokens are defined in:
- `src/app/globals.css` - Theme variables and global styles

### 3D Viewer Settings

Edit `src/components/Model3DViewer.tsx` to customize:
- Camera position and FOV
- Lighting setup
- Auto-rotate speed
- Environment preset

## 🐛 Troubleshooting

### 3D Models Not Loading
- Ensure GLB file URL is publicly accessible
- Check CORS settings on your file hosting
- Verify file format is GLB (not GLTF or other formats)

### Authentication Issues
- Clear browser localStorage
- Check if auth seeds were run
- Verify BETTER_AUTH_SECRET is set in .env

### Database Issues
- Ensure all seed scripts ran successfully
- Check Turso connection credentials
- Verify database URL is accessible

## 📝 License

This project is built for demonstration purposes.

## 🙏 Credits

- UI Components: [Shadcn/UI](https://ui.shadcn.com/)
- 3D Rendering: [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- Icons: [Lucide React](https://lucide.dev/)
- Images: [Unsplash](https://unsplash.com/)

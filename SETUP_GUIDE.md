# Thesis Project Setup Guide
## University Student Appeal and Complaint Management System

This guide provides step-by-step instructions to set up the "Design and Development of a Web- and Mobile-Based University Student Appeal and Complaint Management System" project.

---

## SECTION 1 — FINAL FOLDER STRUCTURE

The project follows a strict three-folder architecture to separate concerns while maintaining a clean monorepo.

```text
ThesisProject/
├── Backend/        # Laravel API project
├── Frontend/       # Vite + React project
└── Database/       # SQL scripts for manual setup
    ├── schema.sql
    ├── procedures.sql
    └── views.sql
```

- **Backend/**: Contains the Laravel API, handling business logic and stored procedure calls.
- **Frontend/**: Contains the React application for the web interface.
- **Database/**: Contains all SQL scripts to initialize the MySQL schema, stored procedures, and views.

---

## SECTION 2 — BACKEND SETUP (Laravel API)

### 1. Project Initialization
Run the following commands in PowerShell to create and set up the Laravel project:

```powershell
# Navigate to project root
cd ThesisProject

# Create Laravel project in Backend folder
composer create-project laravel/laravel Backend

# Navigate to Backend folder
cd Backend
```

### 2. Laravel Folder Structure
After installation, your `Backend` folder will contain:
- `app/`: Core logic (Models, Controllers, Providers).
- `routes/`: Route definitions (use `api.php` for this project).
- `config/`: Application configuration files.
- `database/`: Migrations/Seeders (Note: We use `Database/` folder instead of Laravel migrations).
- `public/`: Entry point (`index.php`) and static assets.
- `vendor/`: Composer dependencies.
- `.env`: Environment configuration file.

### 3. Database Configuration
Open the `.env` file in the `Backend` folder and update the DB configuration:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=thesis_db
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Clear Cache
Run these commands to ensure configuration changes are applied:
```powershell
php artisan config:clear
php artisan cache:clear
```

### 5. Health Check Route
Open `routes/api.php` and add a route to test the database connection:

```php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    try {
        DB::select('SELECT 1');
        return response()->json([
            'status' => 'OK',
            'database' => 'Connected'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'Error',
            'message' => $e->getMessage()
        ], 500);
    }
});
```

> [!NOTE]
> **Why no migrations?**
> This project uses manual SQL scripts and **Stored Procedures** (e.g., `sp_create_student`) to handle data operations. This ensures database logic is centralized in MySQL, and Laravel acts as a lightweight interface for these procedures.

---

## SECTION 3 — DATABASE SETUP

### Initialization Order
1. **Create Database**: Create `thesis_db` in MySQL.
2. **Execute Schema**: Run `schema.sql` (Tables).
3. **Execute Procedures**: Run `procedures.sql` (Stored Procedures).
4. **Execute Views**: Run `views.sql` (Views).

### Method A: MySQL CLI (Recommended)
```powershell
# Create DB
mysql -u root -e "CREATE DATABASE thesis_db;"

# Import scripts (Order matters!)
mysql -u root thesis_db < ..\Database\schema.sql
mysql -u root thesis_db < ..\Database\procedures.sql
mysql -u root thesis_db < ..\Database\views.sql
```

### Method B: phpMyAdmin
1. Open phpMyAdmin.
2. Click **New** -> Create database `thesis_db`.
3. Select `thesis_db` -> Click **Import** tab.
4. Import files in order: `schema.sql`, then `procedures.sql`, then `views.sql`.

### Verification
To verify stored procedures exist, run:
```sql
SHOW PROCEDURE STATUS WHERE Db = 'thesis_db';
```

---

## SECTION 4 — FRONTEND SETUP (React + Vite)

### 1. Project Initialization
```powershell
# Navigate back to root
cd ..

# Create Vite React project (select React and JavaScript)
npm create vite@latest Frontend -- --template react

# Install dependencies
cd Frontend
npm install
npm install axios lucide-react # lucide-react for icons
```

### 2. Frontend Folder Structure
- `src/`: React components and logic.
- `main.jsx`: Entry file rendering the App.
- `App.jsx`: Main application component.
- `index.html`: Base HTML template.
- `vite.config.js`: Vite configuration.

### 3. API Client Configuration
Create `.env` in `Frontend/`:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Create `src/api/client.js`:
```javascript
import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default client;
```

---

## SECTION 5 — LOGIN PAGE DESIGN (React)

### 1. Tailwind UI Setup
Install Tailwind CSS in `Frontend/`:
```powershell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
Update `tailwind.config.js` content path:
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```
Add Tailwind directives to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Login.jsx Code
Create `src/pages/Login.jsx`:

```jsx
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Loader2 } from 'lucide-react';
import client from '../api/client';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await client.post('/login', { username, password });
            const { user, token } = response.data;

            // Block access if Access_channel is not WEB
            if (user.Access_channel !== 'WEB') {
                throw new Error('Unauthorized channel. Please use the mobile app.');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Role-based redirect
            if (user.role_id === 1) window.location.href = '/admin/dashboard';
            else if (user.role_id === 2) window.location.href = '/student/dashboard';
            
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">Student Appeal & Complaints</h1>
                <p className="text-slate-500 text-center mb-8">Sign in to manage your requests</p>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100 italic">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Lock size={18} />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

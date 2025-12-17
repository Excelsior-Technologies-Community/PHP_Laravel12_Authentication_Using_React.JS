# PHP_Laravel12_Authentication_Using_React.JS





---

## STEP 1: Create and Install Laravel 12 Project

Create a new Laravel 12 project:

```bash
composer create-project laravel/laravel PHP_Laravel12_Authentication_Using_React.JS
```

Now install React packages and Vite React plugin:

```bash
npm install react react-dom
npm install @vitejs/plugin-react --save-dev
```

---

## STEP 2: Database Configuration (.env)

Edit the `.env` file and configure MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your database name
DB_USERNAME=root
DB_PASSWORD=
```

Explanation:  
This connects Laravel with your MySQL database.

---

## STEP 3: Create Migration (Customers Table)

Create migration:

```bash
php artisan make:migration create_users_table
```

Migration file:

 `database/migrations/xxxx_create_users_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
```

Run migration:

```bash
php artisan migrate
```

---

## STEP 4: Create Model

Create model:

```bash
php artisan make:model User
```

 `app/Models/User.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
```

---

## STEP 5: Create Authentication Controller

Create controller:

```bash
php artisan make:controller AuthController
```

 `app/Http/Controllers/AuthController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Customer Registration
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:customers',
            'password' => 'required|min:6|confirmed',
        ]);

        Customer::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect('/login');
    }

    /**
     * Customer Login
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect('/dashboard');
        }

        return redirect('/login')->withErrors([
            'email' => 'Invalid email or password',
        ]);
    }

    /**
     * Customer Logout
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
```

---

## STEP 6: Web Routes

 `routes/web.php`

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// React pages load via welcome.blade.php
Route::get('/login', function () {
    return view('welcome');
});

Route::get('/register', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('welcome');
})->middleware('auth');

// Form submit routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);
```

---

## STEP 7: React Setup

Install dependencies:

```bash
npm install
npm install react react-dom
```

---

## STEP 8: React Entry File

 `resources/js/app.jsx`

```jsx
import { createRoot } from "react-dom/client";
import "../css/app.css";

import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";

function App() {
  const path = window.location.pathname;

  if (path === "/register") return <Registration />;
  if (path === "/dashboard") return <Dashboard />;

  return <Login />;
}

const container = document.getElementById("app");
if (container) {
  createRoot(container).render(<App />);
}
```

---

## STEP 9: React Pages

 `resources/js/pages`

### Login.jsx

```jsx
import React from "react";

export default function Login() {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

  return (
    <form method="POST" action="/login">
      <input type="hidden" name="_token" value={csrfToken} />
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button>Login</button>
    </form>
  );
}
```

### Registration.jsx

```jsx
import React from "react";

export default function Registration() {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

  return (
    <form method="POST" action="/register">
      <input type="hidden" name="_token" value={csrfToken} />
      <input name="name" required />
      <input name="email" required />
      <input type="password" name="password" required />
      <input type="password" name="password_confirmation" required />
      <button>Register</button>
    </form>
  );
}
```

### Dashboard.jsx

```jsx
import React from "react";

export default function Dashboard() {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

  return (
    <form method="POST" action="/logout">
      <input type="hidden" name="_token" value={csrfToken} />
      <button>Logout</button>
    </form>
  );
}
```

---

## STEP 10: Update Vite Config
📄 `vite.config.js`

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',
            ],
            refresh: true,
        }),
        react(),
        tailwindcss()
    ],
});
```

---

## STEP 11: Update Auth Provider

 `config/auth.php`

```php
'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\Customer::class,
    ],
],
```

---

## STEP 12: Update Welcome Blade

 `resources/views/welcome.blade.php`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Laravel React Auth</title>
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

---

## STEP 13: Run Project

```bash
php artisan serve
npm run dev
npm run build
```

---

## Application URLs

- http://127.0.0.1:8000/login  
- http://127.0.0.1:8000/register  
- http://127.0.0.1:8000/dashboard  

---

<img width="1328" height="625" alt="image" src="https://github.com/user-attachments/assets/227bb1c2-7be7-4285-91a8-99f980cb6e6a" />

<img width="1322" height="487" alt="image" src="https://github.com/user-attachments/assets/66675102-4323-4ec6-a411-0d9c67796765" />
<img width="1019" height="336" alt="image" src="https://github.com/user-attachments/assets/055304fb-826e-418d-af51-8dcc7c7d915e" />

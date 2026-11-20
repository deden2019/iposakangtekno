<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>POS Koperasi RSPB - Login</title>

    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <style>
        :root {
            --primary: #03AC0E;
            --primary-hover: #028a0b;
            --primary-light: #e8f7e9;
            --bg-color: #f7f9fa;
            --card-bg: #ffffff;
            --text-dark: #212121;
            --text-muted: #6c757d;
            --border-color: #e0e0e0;
            --danger-bg: #ffebee;
            --danger-text: #d32f2f;
            --danger-border: #ffcdd2;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            -webkit-tap-highlight-color: transparent;
        }

        html,
        body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: var(--bg-color);
            overflow: hidden;
        }

        /* Layout Utama Split Screen */
        .login-container {
            display: flex;
            width: 100vw;
            height: 100vh;
            height: 100svh;
            background: var(--card-bg);
            overflow: hidden;
        }

        /* Bagian Kiri (Banner / Ilustrasi) */
        .login-banner {
            flex: 1.2;
            background: linear-gradient(135deg, #03ac0e 0%, #014d06 100%);
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 40px;
            color: #ffffff;
            overflow: hidden;
        }

        .login-banner::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('https://images.unsplash.com/photo-1556742049-0a67d5e0824f?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
            opacity: 0.25;
            z-index: 1;
        }

        .banner-content {
            position: relative;
            z-index: 2;
            max-width: 500px;
        }

        .banner-content span {
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            opacity: 0.9;
            display: block;
            margin-bottom: 8px;
        }

        .banner-content h1 {
            font-size: 26px;
            font-weight: 700;
            line-height: 1.3;
            letter-spacing: -0.5px;
        }

        /* Bagian Kanan (Form Section yang bisa di-scroll dengan aman) */
        .login-form-section {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: var(--card-bg);
            overflow-y: auto;
            height: 100%;
        }

        .login-card {
            width: 100%;
            max-width: 380px;
            margin: auto;
            padding: 10px 0;
        }

        /* Brand / Header */
        .brand-header {
            text-align: center;
            margin-bottom: 16px;
        }

        .brand-logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background-color: var(--primary-light);
            color: var(--primary);
            border-radius: 12px;
            font-size: 20px;
            margin-bottom: 8px;
        }

        .brand-header h2 {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 2px;
            letter-spacing: -0.3px;
        }

        .brand-header p {
            font-size: 11px;
            color: var(--text-muted);
            line-height: 1.3;
        }

        /* Alert Session Error */
        .alert-error {
            background-color: var(--danger-bg);
            color: var(--danger-text);
            border: 1px solid var(--danger-border);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 11px;
            margin-bottom: 12px;
            display: flex;
            align-items: flex-start;
            gap: 6px;
        }

        .alert-error i {
            font-size: 13px;
            margin-top: 1px;
        }

        /* Form Group & Inputs */
        .form-group {
            margin-bottom: 10px;
        }

        .form-group label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 3px;
        }

        .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }

        .input-wrapper i {
            position: absolute;
            left: 12px;
            color: #9e9e9e;
            font-size: 14px;
            pointer-events: none;
        }

        .form-control {
            width: 100%;
            padding: 9px 12px 9px 38px;
            font-size: 12px;
            color: var(--text-dark);
            background-color: #fff;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            outline: none;
            transition: all 0.2s ease-in-out;
        }

        .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(3, 172, 14, 0.15);
        }

        select.form-control {
            padding-left: 12px;
            cursor: pointer;
        }

        /* Submit Button */
        .btn-submit {
            width: 100%;
            padding: 10px;
            background-color: var(--primary);
            color: #ffffff;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out, transform 0.1s;
            box-shadow: 0 4px 10px rgba(3, 172, 14, 0.2);
            margin-top: 4px;
        }

        .btn-submit:hover {
            background-color: var(--primary-hover);
        }

        .btn-submit:active {
            transform: scale(0.98);
        }

        /* Footer */
        .login-footer {
            margin-top: 12px;
            text-align: center;
            font-size: 11px;
            color: var(--text-muted);
        }

        .login-footer a {
            color: var(--primary);
            font-weight: 600;
            text-decoration: none;
        }

        .login-footer a:hover {
            text-decoration: underline;
        }

        /* ===================================================
            RESPONSIVE DESIGN (MOBILE / TABLET)
            =================================================== */
        @media (max-width: 992px) {
            .login-banner {
                display: none;
            }

            .login-form-section {
                width: 100%;
                padding: 12px;
                align-items: flex-start;
                /* Agar scroll mulai dari paling atas */
            }

            .login-card {
                max-width: 100%;
                padding: 10px 5px;
            }
        }

        @media (max-width: 480px) {
            .form-control {
                font-size: 14px;
                /* Mencegah auto-zoom di iOS */
            }
        }
    </style>
</head>

<body>

    <div class="login-container">
        <!-- Banner Sisi Kiri -->
        <div class="login-banner">
            <div class="banner-content">
                <span>IPOS AkangTekno</span>
                <h1>Teknologi Kasir Modern yang Melesatkan Pertumbuhan Usaha Anda</h1>
            </div>
        </div>

        <!-- Bagian Form Sisi Kanan -->
        <div class="login-form-section">
            <div class="login-card">
                <!-- Logo & Header -->
                <div class="brand-header">
                    <div class="brand-logo">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </div>
                    <h2>IPOS AkangTekno</h2>
                    <p>Silakan masuk menggunakan akun Anda untuk memulai transaksi</p>
                </div>

                <!-- Session Alert Error -->
                @if (session('error'))
                    <div class="alert-error">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <span>{{ session('error') }}</span>
                    </div>
                @endif

                <!-- Form Login -->
                <form action="/login" method="POST">
                    @csrf

                    <!-- Input Username -->
                    <div class="form-group">
                        <label for="username">Username</label>
                        <div class="input-wrapper">
                            <input type="text" id="username" name="username" class="form-control"
                                placeholder="Masukkan username" required autofocus autocomplete="username">
                            <i class="fa-regular fa-user"></i>
                        </div>
                    </div>

                    <!-- Input Password -->
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="input-wrapper">
                            <input type="password" id="password" name="password" class="form-control"
                                placeholder="Masukkan password" required autocomplete="current-password">
                            <i class="fa-solid fa-lock"></i>
                        </div>
                    </div>

                    <!-- Input Shift -->
                    <div class="form-group">
                        <label for="shift_id">Shift</label>
                        <select id="shift_id" name="shift_id" class="form-control" required>
                            @foreach ($shift as $s)
                                <option value="{{ $s->shift_id }}">
                                    {{ $s->nama_shift }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Input Saldo Awal -->
                    <div class="form-group">
                        <label for="saldo_awal">Saldo Awal</label>
                        <input type="number" id="saldo_awal" name="saldo_awal" min="1" class="form-control"
                            placeholder="Masukkan saldo awal">
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn-submit">
                        Masuk
                    </button>
                </form>

                <!-- Footer -->
                <div class="login-footer">
                    Butuh bantuan? <a href="#">Hubungi Admin</a>
                </div>
            </div>
        </div>
    </div>

    @if ($errors->any())
        <script>
            Swal.fire({
                icon: 'warning',
                title: 'Peringatan',
                text: '{{ $errors->first() }}'
            });
        </script>
    @endif

    <script>
        console.log(
            "%c © 2026 akangtekno. All rights reserved. %c \nInformasi Kontak: support@akangtekno.id | Lisensi Resmi Terdaftar.",
            "background: #1e1e3f; color: #38bdf8; padding: 6px 12px; font-weight: bold; border-radius: 4px 0 0 4px; font-size: 13px;",
            "background: #0f172a; color: #94a3b8; padding: 6px 12px; border-radius: 0 4px 4px 0; font-size: 12px;"
        );
    </script>

</body>

</html>

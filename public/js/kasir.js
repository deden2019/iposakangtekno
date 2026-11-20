let produkMap = {};
console.log("FILE KASIR TERBARU");
let produkList = [];
let cart = {};
let customerResult = [];
let customerList = [];
let selectedCustomer = null;
let currentTotal = 0;
let isSaving = false;

document.getElementById("bayar-kartu").readOnly = true;
document.getElementById("bayar-kartu").style.pointerEvents = "none";

document.getElementById("nomor-kartu").disabled = true;

function renderProductGrid(items) {
    console.log("RENDER DIPANGGIL", items.length);

    const grid = document.getElementById("product-grid");
    if (items.length === 0) {
        grid.innerHTML =
            '<div class="col-span-full py-12 text-center text-slate-400 text-xs">Produk tidak ditemukan.</div>';
        return;
    }

    grid.innerHTML = items
        .map(
            (item) => `
                <div onclick="addToCart('${item.kode_produk}')" 
                     class="bg-white border border-slate-100 hover:border-toped-500 rounded-2xl p-3 flex flex-col justify-between shadow-sm active:scale-95 cursor-pointer transition group">
                    <div>
                        <span class="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">${item.kode_produk}</span>
                        <h4 class="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-toped-600 transition">${item.nama_produk}</h4>
                    </div>
                    <div class="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
                        <span class="text-xs font-extrabold text-toped-600">Rp ${Number(item.harga_jual).toLocaleString("id-ID")}</span>
                    </div>
                </div>
            `,
        )
        .join("");
    lucide.createIcons();
}

// CUSTOMER SEARCH

const customerSearch = document.getElementById("customer-search");

customerSearch.addEventListener("input", async function () {
    const keyword = this.value.trim();

    const resultBox = document.getElementById("customer-result");

    if (keyword.length < 2) {
        resultBox.classList.add("hidden");

        resultBox.innerHTML = "";

        return;
    }

    try {
        const hasil = await fetch(
            "/api/cari-customer?q=" + encodeURIComponent(keyword),
        ).then((res) => res.json());

        customerResult = hasil;

        if (hasil.length === 0) {
            resultBox.classList.remove("hidden");

            resultBox.innerHTML =
                '<div class="p-2 text-xs text-slate-500">Customer tidak ditemukan</div>';

            return;
        }

        resultBox.classList.remove("hidden");

        resultBox.innerHTML = hasil
            .map(
                (c) => `
                <div
                    onclick="selectCustomer('${c.customer_id}')"
                    class="p-2 text-xs border rounded-lg cursor-pointer hover:bg-green-50">

                    ${c.nama_customer}

                </div>
            `,
            )
            .join("");
    } catch (err) {
        console.error(err);
    }
});

const searchInput = document.getElementById("barcode-input");
searchInput.addEventListener("input", async function (e) {
    const keyword = e.target.value.trim();

    if (keyword.length < 2) {
        renderProductGrid(produkList);
        return;
    }

    try {
        const data = await fetch(
            "/api/cari-produk?q=" + encodeURIComponent(keyword),
        ).then((res) => res.json());

        data.forEach((item) => {
            produkMap[item.kode_produk] = item;
        });

        renderProductGrid(data);
    } catch (err) {
        console.error(err);
    }
});

searchInput.addEventListener("keypress", async function (e) {
    if (e.key !== "Enter") {
        return;
    }

    const val = this.value.trim();

    // cek kode produk yang sudah ada di memory
    if (produkMap[val]) {
        addToCart(val);
        this.value = "";
        return;
    }

    // cek nama produk yang sudah ada di hasil pencarian
    const produkByNama = Object.values(produkMap).find(
        (p) => p.nama_produk.toLowerCase() === val.toLowerCase(),
    );

    if (produkByNama) {
        addToCart(produkByNama.kode_produk);

        this.value = "";

        return;
    }

    try {
        const product = await fetch(
            "/api/produk-barcode/" + encodeURIComponent(val),
        ).then((res) => res.json());

        if (!product) {
            showError("Produk tidak ditemukan");
            return;
        }

        produkMap[product.kode_produk] = product;

        addToCart(product.kode_produk);

        this.value = "";
    } catch (err) {
        console.error(err);
    }
});

function selectCustomer(id) {
    selectedCustomer = customerResult.find((x) => x.customer_id == id);

    if (!selectedCustomer) {
        return;
    }

    document.getElementById("selected-customer-name").innerText =
        selectedCustomer.nama_customer;

    document.getElementById("customer-search").value =
        selectedCustomer.nama_customer;

    document.getElementById("customer-result").innerHTML = "";

    document.getElementById("customer-result").classList.add("hidden");
}

function addToCart(kode) {
    const product = produkMap[kode];
    console.log(product);
    console.log("stok_gudang =", product.stok_gudang);
    if (!product) return;

    if (product.stok_gudang <= 0) {
        showError("Stok produk habis!");
        return;
    }

    if (cart[kode]) {
        if (cart[kode].qty >= Number(product.stok_gudang)) {
            showError("Stok tidak mencukupi!");
            return;
        }
        cart[kode].qty += 1;
    } else {
        cart[kode] = { ...product, qty: 1 };
    }
    renderCart();
}

function changeQty(kode, delta) {
    if (!cart[kode]) return;
    cart[kode].qty += delta;
    if (cart[kode].qty <= 0) delete cart[kode];
    renderCart();
}

function clearCart() {
    cart = {};
    renderCart();
}

function toggleMobileCart() {
    const cartSection = document.getElementById("cart-section");

    const mobileButton = document.getElementById("mobile-cart-button");

    cartSection.classList.toggle("hidden");

    if (cartSection.classList.contains("hidden")) {
        mobileButton.classList.remove("hidden");
    } else {
        mobileButton.classList.add("hidden");
    }
}

function renderCart() {
    const cartList = document.getElementById("cart-list");
    const keys = Object.keys(cart);

    let totalQty = 0;
    let grandTotal = 0;

    if (keys.length === 0) {
        cartList.innerHTML = `<div class="py-16 text-center text-slate-400 text-xs">Keranjang masih kosong.<br>Silakan pilih produk di katalog.</div>`;
        document.getElementById("total-qty").innerText = "0 Pcs";
        document.getElementById("grand-total").innerText = "Rp 0";
        document.getElementById("mobile-cart-count").innerText = "0 Item";
        document.getElementById("mobile-cart-total").innerText = "Rp 0";
        return;
    }

    cartList.innerHTML = keys
        .map((kode) => {
            const item = cart[kode];
            const subtotal = item.harga_jual * item.qty;
            totalQty += item.qty;
            grandTotal += subtotal;

            return `
                    <div class="py-2.5 flex items-center justify-between gap-2">
                        <div class="flex-1 min-w-0">
                            <h5 class="text-xs font-bold text-slate-800 line-clamp-1">${item.nama_produk}</h5>
                            <p class="text-[11px] font-semibold text-toped-600">Rp ${Number(item.harga_jual).toLocaleString("id-ID")}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm">
                                <button onclick="changeQty('${kode}', -1)" class="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition">-</button>
                                <span class="px-2.5 text-xs font-bold text-slate-700">${item.qty}</span>
                                <button onclick="changeQty('${kode}', 1)" class="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition">+</button>
                            </div>
                        </div>
                    </div>
                `;
        })
        .join("");

    document.getElementById("total-qty").innerText = `${totalQty} Pcs`;
    document.getElementById("grand-total").innerText =
        `Rp ${grandTotal.toLocaleString("id-ID")}`;
    document.getElementById("mobile-cart-count").innerText = `${totalQty} Item`;
    document.getElementById("mobile-cart-total").innerText =
        `Rp ${grandTotal.toLocaleString("id-ID")}`;

    cartList.scrollTo({
        top: cartList.scrollHeight,
        behavior: "smooth",
    });

    lucide.createIcons();
}

function closePaymentModal() {
    document.getElementById("payment-modal").classList.add("hidden");
}

function processCheckout() {
    if (Object.keys(cart).length === 0) {
        showError("Keranjang kosong");
        return;
    }

    let total = 0;

    Object.values(cart).forEach((item) => {
        total += item.qty * item.harga_jual;
    });

    currentTotal = total;

    document.getElementById("payment-total-nota").innerText =
        "Rp " + total.toLocaleString("id-ID");

    hitungGrandTotalModal();

    document.getElementById("payment-customer").innerText = selectedCustomer
        ? selectedCustomer.nama_customer
        : "UMUM";

    document.getElementById("payment-modal").classList.remove("hidden");
}

function hitungGrandTotalModal() {
    const diskon = parseFloat(document.getElementById("diskon").value) || 0;

    const ppn = parseFloat(document.getElementById("ppn").value) || 0;

    const subtotal = currentTotal - diskon;

    const grandTotal = subtotal + (subtotal * ppn) / 100;

    document.getElementById("grand-total-modal").innerText =
        "Rp " + grandTotal.toLocaleString("id-ID");

    return grandTotal;
}

function hitungKembalianModal() {
    const grandTotal = hitungGrandTotalModal();

    const tunai = parseFloat(document.getElementById("bayar-tunai").value) || 0;

    const kartu = parseFloat(document.getElementById("bayar-kartu").value) || 0;

    const kembali = tunai + kartu - grandTotal;

    document.getElementById("kembalian").innerText =
        "Rp " + Math.max(kembali, 0).toLocaleString("id-ID");
}

//otomatis isi nominal kartu
document.getElementById("jenis-kartu").addEventListener("change", function () {
    const bayarTunai = document.getElementById("bayar-tunai");

    const bayarKartu = document.getElementById("bayar-kartu");

    const nomorKartu = document.getElementById("nomor-kartu");

    const total = hitungGrandTotalModal();

    if (this.value) {
        bayarTunai.value = 0;

        bayarTunai.disabled = true;

        bayarKartu.value = total;

        bayarKartu.readOnly = true;
        bayarKartu.style.pointerEvents = "none";

        nomorKartu.disabled = false;
    } else {
        bayarTunai.disabled = false;

        bayarKartu.value = 0;

        bayarKartu.readOnly = true;

        bayarKartu.style.pointerEvents = "none";

        nomorKartu.value = "";

        nomorKartu.disabled = true;
    }

    hitungKembalianModal();
});

document.getElementById("bayar-tunai").addEventListener("input", function () {
    if (Number(this.value) > 0) {
        document.getElementById("bayar-kartu").value = 0;

        document.getElementById("jenis-kartu").value = "";

        document.getElementById("nomor-kartu").value = "";

        document.getElementById("nomor-kartu").disabled = true;
    }

    hitungKembalianModal();
});

document.getElementById("is-piutang").addEventListener("change", function () {
    const piutang = this.checked;

    document.getElementById("bayar-tunai").value = 0;

    document.getElementById("bayar-kartu").value = 0;

    document.getElementById("bayar-tunai").disabled = piutang;

    document.getElementById("bayar-kartu").disabled = piutang;

    document.getElementById("jenis-kartu").disabled = piutang;

    document.getElementById("nomor-kartu").disabled = piutang;

    hitungKembalianModal();
});

function printRawBT(jualId) {
    fetch("/kasir/print/" + jualId)
        .then((res) => res.text())
        .then((text) => {
            window.location.href = "rawbt:text:" + encodeURIComponent(text);
        });
}

// async function hardRefresh()
// {
//     const registrations =
//         await navigator.serviceWorker
//             .getRegistrations();

//     for (const reg of registrations)
//     {
//         await reg.unregister();
//     }

//     window.location.href =
//         window.location.pathname +
//         '?reload=' +
//         Date.now();
// }

function saveTransaction() {
    // VALIDASI PEMBAYARAN KARTU
    if (
        Number(document.getElementById("bayar-kartu").value) > 0 &&
        !document.getElementById("jenis-kartu").value
    ) {
        showError("Pilih jenis kartu");
        return;
    }

    //validasi
    const bayarTunai =
        Number(document.getElementById("bayar-tunai").value) || 0;

    const bayarKartu =
        Number(document.getElementById("bayar-kartu").value) || 0;

    const isPiutang = document.getElementById("is-piutang").checked;

    if (bayarTunai > 0 && bayarKartu > 0) {
        showError("Pilih salah satu pembayaran: Tunai atau Kartu/QRIS");

        return;
    }

    if (!isPiutang && bayarTunai <= 0 && bayarKartu <= 0) {
        showError("Masukkan nominal pembayaran");

        return;
    }

    //validasi tidak boleh pembayaran kurang dari grand total

    const grandTotal = hitungGrandTotalModal();

    if (!isPiutang && bayarTunai + bayarKartu < grandTotal) {
        showError("Nominal pembayaran kurang dari Grand Total");

        return;
    }

    if (isPiutang && !selectedCustomer) {
        showError("Pilih customer terlebih dahulu untuk transaksi piutang");

        return;
    }

    const data = {
        is_piutang: isPiutang,

        customer_id: selectedCustomer ? selectedCustomer.customer_id : null,

        diskon: Number(document.getElementById("diskon").value),

        ppn: Number(document.getElementById("ppn").value),

        total_nota: currentTotal,

        total_pelunasan: hitungGrandTotalModal(),

        bayar_tunai: Number(document.getElementById("bayar-tunai").value),

        bayar_kartu: Number(document.getElementById("bayar-kartu").value),

        kartu_id: document.getElementById("jenis-kartu").value,

        nomor_kartu: document.getElementById("nomor-kartu").value,

        items: Object.values(cart).map((item) => ({
            produk_id: item.produk_id,

            harga_beli: item.harga_beli,

            harga_jual: item.harga_jual,

            jumlah: item.qty,

            diskon: 0,
        })),
    };
    console.log(data.items);
    console.log(data);

    if (isSaving) {
        return;
    }

    isSaving = true;

    const btn = document.getElementById("btn-simpan");

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = "Menyimpan...";
    }

    fetch("/kasir/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
                .content,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((res) => {
            isSaving = false;

            if (btn) {
                btn.disabled = false;
                btn.innerHTML = "Simpan";
            }

            console.log(res);

            if (res.success) {
                showSuccess("Transaksi berhasil disimpan");

                printRawBT(res.jual_id);

                cart = {};

                renderCart();

                closePaymentModal();

                selectedCustomer = null;
                customerResult = [];

                document.getElementById("customer-search").value = "";

                document.getElementById("selected-customer-name").innerText =
                    "UMUM";

                // reset pembayaran
                document.getElementById("bayar-tunai").value = 0;

                document.getElementById("bayar-kartu").value = 0;

                document.getElementById("nomor-kartu").value = "";

                document.getElementById("jenis-kartu").value = "";

                // reset diskon dan ppn
                document.getElementById("diskon").value = 0;

                document.getElementById("ppn").value = 0;

                // reset piutang
                document.getElementById("is-piutang").checked = false;

                // aktifkan kembali field pembayaran
                document.getElementById("bayar-tunai").disabled = false;

                document.getElementById("bayar-kartu").disabled = false;
                document.getElementById("bayar-kartu").readOnly = true;
                document.getElementById("bayar-kartu").style.pointerEvents =
                    "none";

                document.getElementById("jenis-kartu").disabled = false;

                document.getElementById("nomor-kartu").disabled = true;

                // reset tampilan total
                document.getElementById("payment-total-nota").innerText =
                    "Rp 0";

                document.getElementById("grand-total-modal").innerText = "Rp 0";

                document.getElementById("kembalian").innerText = "Rp 0";

                currentTotal = 0;

                document.getElementById("barcode-input").value = "";

                renderProductGrid(produkList);

                document.getElementById("barcode-input").focus();
            }
        })
        .catch(async (err) => {
            isSaving = false;

            const btn = document.getElementById("btn-simpan");

            if (btn) {
                btn.disabled = false;
                btn.innerHTML = "Simpan";
            }

            console.error(err);

            try {
                const res = await err.json();

                showError(res.message || "Gagal menyimpan transaksi");
            } catch {
                showError("Gagal menyimpan transaksi");
            }
        });
}
fetch("/api/produk-kasir")
    .then((res) => {
        console.log("STATUS PRODUK:", res.status);
        return res.json();
    })
    .then((data) => {
        console.log("PRODUK OK", data.length);

        produkList = data;

        data.forEach((item) => {
            produkMap[item.kode_produk] = item;
        });

        console.log("SEBELUM RENDER");

        renderProductGrid(produkList.slice(0, 100));

        console.log("SETELAH RENDER");
    })
    .catch((err) => {
        console.error("ERROR PRODUK:", err);
    });

fetch("/api/kartu")
    .then(async (res) => {
        console.log("KARTU STATUS", res.status);

        const text = await res.text();

        console.log("KARTU RESPONSE", text.length);

        return JSON.parse(text);
    })

    .then((data) => {
        const select = document.getElementById("jenis-kartu");

        select.innerHTML = '<option value="">Pilih Jenis Kartu</option>';

        data.forEach((item) => {
            select.innerHTML += `
            <option value="${item.kartu_id}">
                ${item.nama_kartu}
            </option>
        `;
        });
    })
    .catch((err) => {
        console.error("KARTU ERROR", err);
    });

function showError(message) {
    Swal.fire({
        icon: "error",
        title: "Transaksi Gagal",
        text: message,
        confirmButtonColor: "#dc2626",
    });
}

function showSuccess(message) {
    Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: message,
        confirmButtonColor: "#16a34a",
    });
}

window.saveTransaction = saveTransaction;

document.addEventListener("input", function (e) {
    if (
        e.target.id === "diskon" ||
        e.target.id === "ppn" ||
        e.target.id === "bayar-tunai" ||
        e.target.id === "bayar-kartu"
    ) {
        hitungKembalianModal();
    }
});

lucide.createIcons();

window.clearCart = clearCart;
window.toggleMobileCart = toggleMobileCart;
window.processCheckout = processCheckout;
window.closePaymentModal = closePaymentModal;
window.addToCart = addToCart;
window.changeQty = changeQty;
window.selectCustomer = selectCustomer;

console.log(
    "%c © 2026 akangtekno. All rights reserved. %c \nInformasi Kontak: support@akangtekno.id | Lisensi Resmi Terdaftar.",
    "background: #1e1e3f; color: #38bdf8; padding: 6px 12px; font-weight: bold; border-radius: 4px 0 0 4px; font-size: 13px;",
    "background: #0f172a; color: #94a3b8; padding: 6px 12px; border-radius: 0 4px 4px 0; font-size: 12px;",
);

window.addEventListener("error", function (e) {
    console.error("GLOBAL ERROR", e.error);
});

window.addEventListener("unhandledrejection", function (e) {
    console.error("PROMISE ERROR", e.reason);
});

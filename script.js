// Data menu makanan (contoh)
let menuData = [];

// Fungsi untuk menampilkan modul edit
function displayEditModal(menuIndex) {
    const menu = menuData[menuIndex];
    const editModal = document.getElementById("editModal");
    const editFileInput = document.getElementById("editFileInput");
    const editNamaInput = document.getElementById("editNamaInput");
    const editHargaInput = document.getElementById("editHargaInput");
    const editKeteranganInput = document.getElementById("editKeteranganInput");

    editFileInput.value = ""; // Reset input file (agar tidak menampilkan file sebelumnya)
    editNamaInput.value = menu.nama;
    editHargaInput.value = menu.harga;
    editKeteranganInput.value = menu.keterangan;

    // Menampilkan modul edit
    editModal.style.display = "block";

    // Tombol untuk menutup modul
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.onclick = function () {
        editModal.style.display = "none";
    };

    // Tombol untuk mengupdate menu
    const updateButton = document.getElementById("updateButton");
    updateButton.onclick = function () {
        const newNama = editNamaInput.value.trim();
        const newHarga = editHargaInput.value.trim();
        const newKeterangan = editKeteranganInput.value.trim();
        let newImgSrc = menu.imgSrc; // Gunakan gambar yang ada secara default

        if (editFileInput.files[0]) {
            // Jika file gambar baru diunggah, gunakan gambar yang baru
            const reader = new FileReader();
            reader.onload = function (event) {
                newImgSrc = event.target.result;
                updateMenu(menuIndex, newNama, newHarga, newKeterangan, newImgSrc);
            };
            reader.readAsDataURL(editFileInput.files[0]);
        } else {
            // Jika tidak ada gambar baru diunggah, gunakan gambar yang ada
            updateMenu(menuIndex, newNama, newHarga, newKeterangan, newImgSrc);
        }
    };
}

// Fungsi untuk mengupdate data menu makanan
function updateMenu(menuIndex, nama, harga, keterangan, imgSrc) {
    if (nama && harga) {
        // Update data menu
        menuData[menuIndex].nama = nama;
        menuData[menuIndex].harga = harga;
        menuData[menuIndex].keterangan = keterangan;
        menuData[menuIndex].imgSrc = imgSrc;

        // Simpan data ke localStorage
        localStorage.setItem("menuData", JSON.stringify(menuData));

        // Tampilkan kembali daftar menu dengan data yang telah diupdate
        renderMenuList();

        // Tutup modul edit
        const editModal = document.getElementById("editModal");
        editModal.style.display = "none";
    } else {
        alert("Nama dan harga makanan harus diisi!");
    }
}

// Fungsi untuk menambahkan menu makanan
function addMenu() {
    const fileInput = document.getElementById("fileInput");
    const namaInput = document.getElementById("namaInput");
    const hargaInput = document.getElementById("hargaInput");
    const keteranganInput = document.getElementById("keteranganInput");

    const file = fileInput.files[0];
    const nama = namaInput.value.trim();
    const harga = hargaInput.value.trim();
    const keterangan = keteranganInput.value.trim();

    if (file && nama && harga) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imgSrc = event.target.result;
            const menu = { nama, harga, keterangan, imgSrc };
            menuData.push(menu);

            // Simpan data ke localStorage
            localStorage.setItem("menuData", JSON.stringify(menuData));

            renderMenuList();
        };
        reader.readAsDataURL(file);

        // Reset input fields
        fileInput.value = "";
        namaInput.value = "";
        hargaInput.value = "";
        keteranganInput.value = "";
    } else {
        alert("Please fill in all fields!");
    }
}

// Fungsi untuk menghapus menu makanan
function deleteMenu(menuIndex) {
    menuData.splice(menuIndex, 1);

    // Simpan data ke localStorage
    localStorage.setItem("menuData", JSON.stringify(menuData));

    renderMenuList();
}

// Fungsi untuk menampilkan daftar menu makanan
function renderMenuList() {
    const menuList = document.getElementById("menuList");
    menuList.innerHTML = ""; // Kosongkan daftar menu sebelum menambahkan yang baru

    menuData.forEach((menu, index) => {
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");
        menuItem.innerHTML = `
            <img src="${menu.imgSrc}" alt="${menu.nama}">
            <div class="menu-info">
                <h3>${menu.nama}</h3>
                <p>Harga: Rp ${menu.harga}</p>
                <p>${menu.keterangan}</p>
            </div>
            <div class="menu-actions">
                <button class="edit-button" style="display:none" onclick="displayEditModal(${index})">Edit</button>
                <button class="delete-button" style="display:none" onclick="deleteMenu(${index})">Hapus</button>
            </div>
        `;
        menuList.appendChild(menuItem);

        // Menambahkan event listener untuk menampilkan tombol edit dan hapus saat kursor di atas item menu
        menuItem.addEventListener("mouseenter", () => {
            const editButton = menuItem.querySelector(".edit-button");
            const deleteButton = menuItem.querySelector(".delete-button");
            editButton.style.display = "inline-block";
            deleteButton.style.display = "inline-block";
        });

        menuItem.addEventListener("mouseleave", () => {
            const editButton = menuItem.querySelector(".edit-button");
            const deleteButton = menuItem.querySelector(".delete-button");
            editButton.style.display = "none";
            deleteButton.style.display = "none";
        });
    });
}

// Memeriksa apakah ada data yang disimpan di localStorage saat halaman dimuat
window.onload = function () {
    const storedMenuData = localStorage.getItem("menuData");
    if (storedMenuData) {
        menuData = JSON.parse(storedMenuData);
        renderMenuList();
    }
};

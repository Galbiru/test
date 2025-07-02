document.addEventListener('DOMContentLoaded', () => {
    const countdownText = document.getElementById('countdown-text');
    const intro = document.getElementById('intro-animation');
    const homepage = document.getElementById('homepage-content');
    const rocket = document.querySelector('.rocket');

    // --- Logika Hitung Mundur ---
    let count = 5; // Kembali ke 5 detik agar ada waktu untuk getaran sebelum takeoff
    countdownText.innerText = count;

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownText.innerText = count;
        } else {
            countdownText.innerText = 'LIFT OFF!'; // Kembali ke 'LIFT OFF!'
            setTimeout(() => countdownText.style.display = 'none', 1000);
            clearInterval(countdownInterval);

            // --- Pemicu Guncangan (Tremor) ---
            // Animasi guncangan sudah ada di CSS rocketTakeoff keyframe (50% - 56%)
            // Kita hanya perlu memastikan flameIgnition dimulai di waktu yang tepat.
            
            // --- Mulai Animasi Zoom Setelah Roket Meluncur dan mendekati tengah atas ---
            // Sesuaikan delay agar zoom dimulai saat roket terlihat jelas di tengah atas atau sesuai keinginan
            setTimeout(() => {
                intro.style.animation = 'zoomIn 3s forwards, sceneFadeOut 1.5s 3s forwards';
                // Opsional: Sembunyikan roket jika Anda ingin tampilan zoom hanya menyorot background
                // rocket.style.opacity = 0; 
                
                // Tambahkan kelas untuk efek kedipan pada bintang saat zoom
                // Misalnya, bisa ditambahkan CSS untuk .star-fast { animation: blink 0.1s infinite; }
                // atau manipulasi langsung canvas.

            }, 7000); // Roket terbang 7 detik, zoom dimulai setelah itu

            // --- Tampilkan Homepage Setelah Animasi Intro Selesai ---
            setTimeout(() => {
                homepage.classList.add('visible');
            }, 9500); // total 7 detik roket + 3 detik zoom + 1.5 detik fadeOut = ~11.5 detik. Kita mulai homepage di 9.5 detik.

            // --- Hapus elemen intro setelah semua animasi selesai ---
            setTimeout(() => {
                intro.remove();
                document.body.style.overflow = 'auto';
            }, 11000); // 11 detik, agar cukup waktu untuk fadeOut juga
        }
    }, 1000);

    // --- SCRIPT BACKGROUND BINTANG (EFEK SPEED) ---
    function setupStarCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let stars = [];
        const numStars = 200; // Lebih banyak bintang untuk efek speed

        function initStars() {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z: Math.random() * 1000, // Z-depth untuk efek perspektif
                    size: Math.random() * 2 + 1,
                    initialSpeedY: Math.random() * 2 + 0.5, // Kecepatan awal vertikal
                    speedBoostY: 0, // Akan bertambah saat roket bergerak
                    speedBoostX: 0 // Untuk guncangan horizontal
                });
            }
        }

        let currentRocketSpeed = 0; // Untuk mengontrol efek speed bintang
        let rocketIsShaking = false; // Untuk mengontrol efek guncangan pada bintang

        // Event listener untuk memicu efek kecepatan bintang saat roket mulai bergerak
        // Ini adalah pendekatan simulasi, karena tidak ada akses langsung ke CSS animation state
        setTimeout(() => {
            currentRocketSpeed = 1; // Mulai mempercepat bintang setelah roket mulai takeoff
            // Juga tambahkan guncangan pada bintang saat roket mulai bergetar (sekitar 5 detik)
            setTimeout(() => {
                rocketIsShaking = true;
                setTimeout(() => {
                    rocketIsShaking = false;
                }, 1000); // Guncangan berlangsung sekitar 1 detik
            }, 5000); // Mulai efek guncangan pada bintang saat roket mulai bergetar
        }, 5000); // Dimulai 5 detik setelah DOMContentLoaded (sesuai timing roketTakeoff)


        function drawStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ctx.fillStyle = 'white'; // Warnai bintang, atau gunakan gradient untuk efek blur
            
            stars.forEach(star => {
                const scale = 500 / (500 + star.z); // Skala berdasarkan kedalaman
                let sx = star.x;
                let sy = star.y;
                let starSize = star.size * scale;

                // Efek kecepatan vertikal
                star.y -= (star.initialSpeedY + currentRocketSpeed) * scale;
                star.x += star.speedBoostX; // Terapkan guncangan horizontal

                // Reset bintang jika keluar layar
                if (star.y < 0) {
                    star.y = canvas.height;
                    star.x = Math.random() * canvas.width;
                    star.z = 1000; // Reset depth
                }

                // Guncangan pada bintang (saat roket bergetar)
                if (rocketIsShaking) {
                    star.speedBoostX = (Math.random() - 0.5) * 5; // Guncangan acak
                } else {
                    star.speedBoostX = 0; // Hentikan guncangan
                }

                // Gambar bintang sebagai garis pendek untuk efek kecepatan
                if (currentRocketSpeed > 0.5) { // Hanya jika roket sudah bergerak cepat
                    const trailLength = starSize * (currentRocketSpeed / 2); // Panjang jejak berdasarkan kecepatan
                    
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`; // Sedikit transparansi
                    ctx.lineWidth = starSize / 2;
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(star.x, star.y + trailLength); // Gambar garis vertikal
                    ctx.stroke();
                } else {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(star.x, star.y, starSize, starSize); // Gambar sebagai kotak kecil
                }
            });
        }

        function animate() {
            drawStars();
            requestAnimationFrame(animate);
        }

        initStars();
        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars(); // Re-initialize stars on resize
        });
    }
    setupStarCanvas('main-bg-canvas');
});
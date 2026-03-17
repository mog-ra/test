// =============================================
// ヒーロー画像フェード処理
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    var img1 = document.getElementById('hero-img-1');
    var img2 = document.getElementById('hero-img-2');
    if (!img1 || !img2) return;
    img1.style.transition = 'opacity 1.5s ease-in-out';
    img1.style.opacity    = '0.52';
    img2.style.transition = 'opacity 1.5s ease-in-out';
    img2.style.opacity    = '0';
    var current  = 1;
    var INTERVAL = 15000;
    setInterval(function() {
        if (current === 1) {
            img1.style.opacity = '0';
            img2.style.opacity = '0.52';
            current = 2;
        } else {
            img2.style.opacity = '0';
            img1.style.opacity = '0.52';
            current = 1;
        }
    }, INTERVAL);
});

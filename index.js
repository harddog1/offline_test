let btn = document.querySelector('.btn');
btn.addEventListener('click', function() {
    btn.textContent = Number(btn.textContent) + 1;
});
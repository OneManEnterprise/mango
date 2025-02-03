document.getElementById('images-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const url = document.getElementById('url').value;
    const http = document.getElementById('http').checked ? 'http://' : '';
    const https = document.getElementById('https').checked ? 'https://' : '';
    const protocol = http + https
    const www = document.getElementById('www').checked ? 'www.' : '';
    const website = protocol + www + url;
    const proxy = 'https://corsproxy.io/?'
    const proxiedWebsite = proxy + encodeURIComponent(website);
    fetch(proxiedWebsite)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const images = Array.from(doc.querySelectorAll('img')).map(img => img.src);
            displayImages(images);
        })
        .catch(error => console.error('Error fetching images:', error));
    });

function displayImages(images) {
    let currentImageIndex = 0;

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        document.getElementById('displayedImage').src = images[currentImageIndex];
    }

    if (images.length > 0) {
        let displayedImage = document.getElementById('displayedImage');
        if (!displayedImage) {
            displayedImage = document.createElement('img');
            displayedImage.id = 'displayedImage';
            displayedImage.style.width = '100%';
            displayedImage.style.height = '100vh';
            document.body.appendChild(displayedImage);
        }
        displayedImage.src = images[0];
        document.body.onclick = nextImage;
    }
}

let startX;
document.body.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
});
document.body.addEventListener('touchmove', function(e) {
    let touch = e.touches[0];
    let change = startX - touch.clientX;

    if (change > 50) { // Swipe left
        document.getElementById('images-form').classList.add('hidden');
    } else if (change < -50) { // Swipe right
        document.getElementById('images-form').classList.remove('hidden');
    }
});

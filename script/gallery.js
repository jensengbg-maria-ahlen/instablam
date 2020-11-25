if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => {
            console.log('Service worker registred.');
        })
        .catch(error => {
            console.log('Service worker registration error: ', error.message)
        })
}

window.addEventListener('load', () => {
    if ('geolocation' in navigator) {
        locationSettings();
    }

    gallerySettings();
});

function gallerySettings() {
    const downloadLink = document.querySelector('.downloadLink')
    const nextButton = document.querySelector('#next-button');
    const deleteButton = document.querySelector('#delete-button');
    const galleryImg = document.querySelector('.gallery-Images');
    let imgIndex = 0;
    const images = ['forest.jpg', 'ocean.jpg', 'turtle.jpg'];

    nextButton.addEventListener('click', () => {
        imgIndex = (imgIndex + 1) % images.length;
        galleryImg.src = 'img/' + images[imgIndex];
        downloadLink.href = galleryImg.src;
        downloadLink.download = downloadLink.href;
    });
}


function locationSettings() {
    const position = document.querySelector('.location')
    try {
        const geo = navigator.geolocation;
        geo.getCurrentPosition(pos => {
            let lat = pos.coords.latitude;
            let lng = pos.coords.longitude;
            getAdressFromPosition(lat, lng, position)
        }, error => {
            position.innerHTML = 'Please <em>allow</em> position and I will tell the location fo the pictures.'
            console.log(error);
        });
    } catch (e) {
        position.innerHTML = 'This device does not have access to the Geolocation API.';
    }
}


async function getAdressFromPosition(lat, lng, position) {
    try {
        const response = await fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
        const data = await response.json();

        if (data.error) {
            position.innerHTML = 'Could not get location information this time. Try again later.';
        } else {
            const city = data.city;
            const country = data.country;
            position.innerHTML = `Picture was taken at ${city}, ${country}.`;
        }

    } catch (e) {
        position.innerHTML += `Could not find your city. Errormessage ${error}`;
    }
}


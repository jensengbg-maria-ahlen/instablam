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
    if ('mediaDevices' in navigator) {
        cameraSettings();
    }

    if ('geolocation' in navigator) {
        locationSettings();
    }

    notificationSettings();
});


function cameraSettings() {
    const cameraOnButton = document.querySelector('.camera-on');
    const cameraOffButton = document.querySelector('.camera-off')
    const takePictureButton = document.querySelector('#take-picture');
    const changeCameraButton = document.querySelector('.change-camera')
    const errorMessage = document.querySelector('.error-message');
    const video = document.querySelector('video');
    const pictureTaken = document.querySelector('.picture-taken');
    const yesButton = document.querySelector('.yesButton');
    const noButton = document.querySelector('.noButton');

    let stream;
    let facingMode = 'environment';

    cameraOnButton.addEventListener('click', async () => {
        errorMessage.innerHTML = '';
        try {
            const md = navigator.mediaDevices;
            stream = await md.getUserMedia({
                video: { width: 320, height: 320, facingMode: facingMode }
            })
            video.srcObject = stream;
            takePictureButton.disabled = false;
            changeCameraButton.classList.remove('hidden');
            cameraOnButton.classList.add('hidden');
            cameraOffButton.classList.remove('hidden');
        } catch (e) {
            errorMessage.innerHTML = 'Please allow the app to access camera'
        }
    })

    cameraOffButton.addEventListener('click', async () => {
        errorMessage.innerHTML = '';
        if (!stream) {
            errorMessage.innerHTML = 'No video to stop.';
            return;
        }
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        takePictureButton.disabled = true;
        changeCameraButton.classList.add('hidden');
        cameraOnButton.classList.remove('hidden');
        cameraOffButton.classList.add('hidden');
    })

    takePictureButton.addEventListener('click', async () => {
        errorMessage.innerHTML = '';
        if (!stream) {
            errorMessage.innerHTML = 'No video to take photo from.';
            return;
        }
        let tracks = stream.getTracks();
        let videoTrack = tracks[0];
        
        let capture = new ImageCapture(videoTrack);
        let blob = await capture.takePhoto();
        
        let imgUrl = URL.createObjectURL(blob);
        pictureTaken.src = imgUrl;
        
        let divElem = document.querySelector('.picture');
        divElem.classList.remove('hidden');

        notificationSettings(pictureTaken);
    })

    changeCameraButton.addEventListener('click', () => {
        if (facingMode == 'environment') {
            facingMode = 'user';
        } else {
            facingMode = 'environment';
        }
        cameraOffButton.click();
        cameraOnButton.click();
    })
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
            console.log(error);
        });
    } catch (e) {
        console.log('This device does not have access to the Geolocation API.');
    }
}


async function getAdressFromPosition(lat, lng, position) {
    try {
        const response = await fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
        const data = await response.json();
        console.log(data)

    } catch (e) {
        console.log(e)
    }
}

async function notificationSettings(image) {
    let notificationPermission = false;
    const errorMessage = document.querySelector('.error-message')
    const answer = await Notification.requestPermission();
    
    if (answer == 'granted') {
        notificationPermission = true;
        const options = {
            body: "This is your image",
            icon: image.src
        }

        let notif = new Notification('show', options);
        navigator.serviceWorker.ready.then(reg => 
            reg.showNotification('Image', options))

    } else if (answer == 'denied') {
        console.log('Notificaton: User denied notification');
    } else {
        console.log('Notification: user declined to answer');
    }

    if (!notificationPermission) {
        errorMessage.innerHTML = 'We do not have permission to show notification';
        return;
    }

}
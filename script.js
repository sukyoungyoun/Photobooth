const video = document.getElementById('video');
const photo1 = document.getElementById('photo1');
const photo2 = document.getElementById('photo2');
const photo3 = document.getElementById('photo3');
const quoteInput = document.getElementById('quote');
const captureButton = document.getElementById('capture');
const downloadButton = document.getElementById('download');
const photos = [photo1, photo2, photo3];
const quotes = []; // Array to store individual quotes
let currentPhotoIndex = 0;

// Access the user's webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing webcam: ", err);
    });

// Capture a photo and draw it to the canvas
function capturePhoto() {
    if (currentPhotoIndex < photos.length) {
        const canvas = photos[currentPhotoIndex];
        const context = canvas.getContext('2d');
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Set canvas size to match video dimensions
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        // Draw the background color
        context.fillStyle = '#D32300';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Add the quote to the canvas
        const quote = quoteInput.value;
        quotes[currentPhotoIndex] = quote; // Store the current quote

        if (quote) {
            context.font = '24px Italiana';
            context.fillStyle = '#fff';
            context.textAlign = 'center';
            context.fillText(quote, canvas.width / 2, canvas.height - 30);
        }

        currentPhotoIndex++;
    }
}

// Handle capture button click
captureButton.addEventListener('click', () => {
    capturePhoto();
    if (currentPhotoIndex >= photos.length) {
        captureButton.disabled = true;
    }
});

// Handle download button click
downloadButton.addEventListener('click', () => {
    const combinedCanvas = document.createElement('canvas');
    const combinedContext = combinedCanvas.getContext('2d');
    
    // Dimensions for the photostrip and border
    const photoWidth = photos[0].width;
    const photoHeight = photos[0].height;
    const borderSize = 30; // Border size in pixels
    const textMargin = 30; // Margin for the text from the top

    // Set the combined canvas size with extra space for the border
    combinedCanvas.width = photoWidth * photos.length + (borderSize * 2);
    combinedCanvas.height = photoHeight + (borderSize * 2) + textMargin; // Added space for text margin

    // Fill the entire canvas with the red background
    combinedContext.fillStyle = '#D32300';
    combinedContext.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

    // Draw each photo onto the combined canvas, leaving space for the border
    photos.forEach((canvas, index) => {
        combinedContext.drawImage(canvas, borderSize + index * photoWidth, borderSize + textMargin);
    });

    // Add "Photobooth" text with margin
    combinedContext.font = '36px Italiana'; // Adjust font size as needed
    combinedContext.fillStyle = '#fff'; // Text color
    combinedContext.textAlign = 'left'; // Align text to the left
    combinedContext.textBaseline = 'top'; // Align text to the top
    combinedContext.fillText('Photobooth', borderSize + -10, borderSize + -10); // Add text with margin

    // Convert combined canvas to PNG and download
    const link = document.createElement('a');
    link.href = combinedCanvas.toDataURL('image/png');
    link.download = 'photostrip.png';
    link.click();
});
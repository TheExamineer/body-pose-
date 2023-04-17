navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then((stream) => {
    let mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.ondataavailable = function(event) {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = function() {
      let videoBlob = new Blob(chunks, { type: 'video/mp4' });
      let formData = new FormData();
      formData.append('video', videoBlob);

      fetch('https://https://body-pose-backend.onrender.com/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        console.log('Video sent successfully!');
      })
      .catch(error => {
        console.error('Error sending video:', error);
      });
    };

    mediaRecorder.start();
  })
  .catch((err) => {
    console.log("Error:", err);
  });

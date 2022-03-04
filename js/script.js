

var width = 640
var height = 480 


const canvas = document.getElementById('canvas');
canvas.width = width
canvas.height = height
var ctx = canvas.getContext("2d")

ctx.fillStyle = "#aaa";
ctx.fillRect(0, 0, width, height)

//
loadAndBlur();

//
async function loadAndBlur() {

  //
  var webcam_stream = await navigator.mediaDevices.getUserMedia({video: true});
  var webcam = document.querySelector("#video");
  webcam.srcObject = webcam_stream;
  webcam.addEventListener("loadeddata", updateFrames)
  webcam.play()
  


  // ------------------------------------
  // (1) webcam on can
  // ------------------------------------
  async function updateFrames() {


    // ------------------------------------
    // (2) model event
    // ------------------------------------
    const net = await bodyPix.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2
    });

    //
    updateFrames2()

    function updateFrames2() {
      
      net.segmentPerson(webcam, {

        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.7

      }).then((segmentation) => {

        //
        updateFrames1(segmentation);

      })
        


      //
      function updateFrames1(segmentation) {

        //
        requestAnimationFrame(updateFrames2);
        ctx.drawImage(webcam, 0, 0);
  
        //
        const coloredPartImage = bodyPix.toMask(segmentation);
        const opacity = 1; // background blur 
        const flipHorizontal = false;
        const maskBlurAmount = 3; // edge blur
        var options = [coloredPartImage, opacity, maskBlurAmount, flipHorizontal]; 

        //
        bodyPix.drawMask(canvas, webcam, ...options); 

      }

    }
    //
    

  } 
  

  
  //
  // var imgdata = ctx.getImageData(0, 0, width, height);
  // var dataa = imgdata.data

  // var dataa1 = new Uint8ClampedArray(segmentation.data.buffer)
   
  // for (let i = 0; i < dataa1.length; i++) {
  //   dataa[i] = dataa1[i]
  //   dataa[i+1] = dataa1[i+1]
  //   dataa[i+2] = dataa1[i+2]
  //   dataa[i+3] = dataa1[i+3]
  // }
  
  // ctx.putImageData(imgdata, 0, 0)

 



}

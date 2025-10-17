const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');
const fs = require('fs');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });


class FaceService {
    constructor(modelPath) {
        this.modelPath = modelPath || path.join(__dirname, '../../models');
        this.modelsLoaded = false;
        (async() => await this.loadModels())();
    }

    async loadModels() {
        if(this.modelsLoaded) return;
        const model = path.resolve(this.modelPath)
        if(!fs.existsSync(model)) throw new Error(`Model folder not found: ${model}`);
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(model);
        await faceapi.nets.tinyFaceDetector.loadFromDisk(model);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(model);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(model);


        this.modelsLoaded = true;
        console.log('Face api models loaded');
    }

    async getDescriptor(imageArg) {
        try {
     
            const image = await canvas.loadImage(imageArg);
            const detect = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor(); 
            return detect.descriptor;
        } catch (error) {
            throw new Error(`Problem of detect image: ${error.message}`);
        }
    }
    async compareFaces(imagePath1, imagePath2) {

        const firstDesc = await this.getDescriptor(imagePath1);
        const secondDesc = await this.getDescriptor(imagePath2);
        if(!firstDesc || !secondDesc) throw new Error(`Face not detecred: ${error.message}`);
        
        const distance = faceapi.euclideanDistance(firstDesc, secondDesc);
        return distance;
    }
}

module.exports = new FaceService();
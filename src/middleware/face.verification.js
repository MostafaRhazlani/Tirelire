    const path = require('path');
    const faceService = require('../utils/face.service');
    const User = require('../models/user.model');
    const verfyFace = async (req, res, next) => {
        try {
            
            if(!req.file) {
                return res.status(400).json({ error: 'You must upload a selfie image for verification' });
            }

            const user = await User.findById(req.user.id);
            if(!user || !user.nationalIdImage) {
                return res.status(400).json({ error: 'National id image not found' });
            }

            const selfieImage = req.file.path;
            const nationalImagePath = path.join(__dirname, `../../public/images`, user.nationalIdImage);
            
            const distance = await faceService.compareFaces(selfieImage, nationalImagePath);
            console.log(distance);
            
            if(distance > 0.5) {
                return res.status(403).json({ error: 'The face does not match the national card photo' });
            }

            console.log('✅ Face verified successfully');
            next();

        } catch (error) {
            res.status(500).json({ error: 'Face verification failed: ' + error.message });
        }
    }

    module.exports = verfyFace;

import cloudinary from 'cloudinary';
import { env } from './env.js';
import { CLOUDINARY, TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import path from 'node:path';
import fs from 'node:fs/promises';


class FileService {
    constructor() {
        cloudinary.v2.config({
            secure: true,
            cloud_name: env(CLOUDINARY.CLOUD_NAME),
            api_key: env(CLOUDINARY.API_KEY),
            api_secret: env(CLOUDINARY.API_SECRET),
        });
    }

    async saveFileToCloudinary(file) {
        const response = await cloudinary.v2.uploader.upload(file.path);
        return response.secure_url;
    }

    async saveFileToUploadDir(file) {
        await fs.rename(
            path.join(TEMP_UPLOAD_DIR, file.filename),
            path.join(UPLOAD_DIR, file.filename),
        );

        return `${env('APP_DOMAIN')}/uploads/${file.filename}`;
    }
}

export default new FileService();

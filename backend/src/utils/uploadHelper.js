const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
    console.log(`UploadHelper: Attempting to delete file at path: ${filePath}`);
    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.warn(`UploadHelper: File not found, skipping deletion: ${filePath}`);
            } else {
                console.error(`UploadHelper: Error deleting file ${filePath}:`, err);
            }
        } else {
            console.log(`UploadHelper: File deleted successfully: ${filePath}`);
        }
    });
};

module.exports = {
    deleteFile,
};

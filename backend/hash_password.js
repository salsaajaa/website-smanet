// hash_password.js 
const bcrypt = require('bcrypt');

// GANTI DENGAN PASSWORD PLAIN UNTUK ADMIN ANDA
const plainPassword = 'user123node hash_password.js';

const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error generating hash:', err);
    } else {
        console.log('Generated hash:');
        console.log(hash); // Ini adalah string hash yang Anda butuhkan
    }
});
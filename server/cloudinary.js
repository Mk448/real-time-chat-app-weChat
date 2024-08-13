const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dtd93nbbn', 
    api_key: '377724421832753', 
    api_secret: 'Y_ZtwaTwkmsVlKmN7yf0QUJQyZ0'
  });

  module.exports = cloudinary;
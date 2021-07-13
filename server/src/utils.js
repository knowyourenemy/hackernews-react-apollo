const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-aw3some';

function getTokenPayload(token) {
    return jwt.verify(token, APP_SECRET);
    
}

function getUserId(token) {
    
    if (token) {
        console.log("GETUSERID WAS CALLED1")
        
            const token_refracted = token.replace('Bearer ', '');
            const { userId } = getTokenPayload(token_refracted);
            return userId;
        }

    throw new Error('No Token');
}

module.exports = {
    APP_SECRET,
    getUserId
};
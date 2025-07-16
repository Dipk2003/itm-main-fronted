const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Paste your JWT token: ', (token) => {
    try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        
        console.log('\n🔐 JWT Token Payload:');
        console.log('  Subject:', payload.sub);
        console.log('  Role:', payload.role);
        console.log('  User ID:', payload.userId);
        console.log('  Issued At:', new Date(payload.iat * 1000));
        console.log('  Expires At:', new Date(payload.exp * 1000));
        console.log('  Is Expired:', Date.now() > payload.exp * 1000);
        
        if (!payload.userId) {
            console.log('\n❌ PROBLEM FOUND: userId is missing from token!');
            console.log('This is why you get "Unauthorized" error.');
            console.log('The backend needs to be updated to include userId in JWT tokens.');
        } else {
            console.log('\n✅ userId is present in token');
        }
        
    } catch (error) {
        console.log('❌ Error decoding token:', error);
    }
    
    rl.close();
});

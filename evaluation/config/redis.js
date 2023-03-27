const redis = require("redis");

const redisClient = redis.createClient({url:`redis://default:QSZQPukazfU9e1FcI7ln6oPjGROv2NxI@redis-17569.c74.us-east-1-4.ec2.cloud.redislabs.com:17569`});

redisClient.on('error', (err) => { console.log(err.message) });
(async () => await redisClient.connect())();

module.exports= {
    redisClient
};

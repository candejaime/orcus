exports.connection = function() {
    const { Client } = require("pg");
    return client = new Client({
        user: "qlkamqbrksjdyd",
        host: "ec2-54-227-248-71.compute-1.amazonaws.com",
        database: "d7ksukehbpjbjt",
        password: "e02b301eaa88f361aed23dc2b1f0778f22cddc1fa173173615a8f6cd259a938f",
        port: 5432,
        ssl: {
            rejectUnauthorized: false,
        },
    });
}
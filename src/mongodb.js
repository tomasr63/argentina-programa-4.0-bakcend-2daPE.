import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
const URI = process.env.MONGODB_URLSTRING;

const client = new MongoClient(URI);

const connectToMongoDB = async () => {
    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        return client;
    } catch (error) {
        console.error("Error al conectar a Mongo", error);
        return null;
    }
}

const disconnectFromMongoDB = async () => {
    try {
        await client.close();
        console.log("Desconectado de MongoDB");
    } catch (error) {
        console.error("Error al desconectar de Mongo", error);
    }
}

export { connectToMongoDB, disconnectFromMongoDB };
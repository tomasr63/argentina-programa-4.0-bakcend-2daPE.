import express from 'express';
import { connectToMongoDB, disconnectFromMongoDB } from '../src/mongodb.js';

const computacionRute = express.Router();
const db_nombre = process.env.DB_NAME;
const collection_nombre = process.env.COLLECTION_NAME;

// Obtener todos los documentos R
computacionRute.get("/", async (req, res) => {
    try {
        const client = await connectToMongoDB();

        if (!client) {
            res.status(500).send("Error al conectarse a MongoDB");
            return;
        }

        const db = client.db(db_nombre);
        const coleccion = await db.collection(collection_nombre).find().toArray();

        res.send(coleccion);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los docs de la base de datos");

    } finally {
        await disconnectFromMongoDB();
    }
});

// Obtener un doc por id R
computacionRute.get("/codigo/:codigo", async (req, res) => {
    const codigo = parseInt(req.params.codigo);

    if (!codigo) {
        return res.status(400).send('Error en el formato de los datos.');
    }

    try {
        const client = await connectToMongoDB();

        if (!client) {
            res.send('Error al conectase a MongoDB.');
            return;
        }

        const db = client.db(db_nombre);
        const coleccion = await db.collection(collection_nombre).find().toArray();

        const resultado = coleccion.find(producto => producto.codigo === codigo);

        resultado ? res.send(resultado) : res.status(404).send(`Producto codigo: ${codigo} no encontrado.`);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al conseguir los docs de la base de datos.');

    } finally {
        await disconnectFromMongoDB();
    }

});

// Obtener uno o mas doc por su nombre R
computacionRute.get("/nombre/:nombre", async (req, res) => {
    const nombre = req.params.nombre.toLocaleLowerCase().trim().replace(/ /g, '');

    try {
        const client = await connectToMongoDB()

        if (!client) {
            res.send('Error al conectarse a Mongo DB.');
        }

        const db = client.db(db_nombre);
        const coleccion = await db.collection(collection_nombre).find().toArray();

        let resultados = coleccion.filter(producto => producto.nombre.trim().toLocaleLowerCase().replace(/ /g, '').includes(nombre));

        resultados.length > 0 ? res.send(resultados) : res.status(404).send(`No se encontraron coincidencias para ${nombre}.`);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al conseguir los docs de la base de datos.');

    } finally {
        await disconnectFromMongoDB();
    }
});

// Obtener docs por categoria R
computacionRute.get("/categoria/:categoria", async (req, res) => {
    const categoria = req.params.categoria.toLowerCase().trim();

    try {
        const client = await connectToMongoDB();

        if (!client) {
            res.send('Error al conectarse a Mongo DB.');
            return;
        }

        const db = client.db(db_nombre);
        const coleccion = await db.collection(collection_nombre).find().toArray();

        let resultados = coleccion.filter(producto => producto.categoria.toLocaleLowerCase().replace(/ /g, '') === categoria.replace(/ /g, ''));

        resultados.length > 0 ? res.send(resultados) : res.status(404).send('No se encontraron coincidencias.');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al conseguir los docs de la base de datos.');

    } finally {
        await disconnectFromMongoDB();
    }
});

// Crear un nuevo doc C
computacionRute.post("/", async (req, res) => {
    const nuevo = req.body;

    if (!nuevo) {
        return res.status(400).send('Error en el formato de los datos.');
    }

    try {
        const client = await connectToMongoDB();

        if (!client) {
            res.send('Error al conectase a MongoDB.');
            return;
        }

        const db = client.db(db_nombre);
        const coleccion = db.collection(collection_nombre);

        await coleccion.insertOne(nuevo);

        console.log('Nuevo documento creado.');
        res.status(201).send(nuevo);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al conseguir los docs de la base de datos.');

    } finally {
        await disconnectFromMongoDB();
    }

});

// Modificar precio de un doc U
computacionRute.put("/codigo/:codigo", async (req, res) => {
    const codigo = parseInt(req.params.codigo);
    const { precio } = req.body;
    const precioNuevo = parseFloat(precio.toFixed(2));

    if (!codigo || !precio) {
        return res.status(400).send('Error en el formato de los datos.');
    }

    try {
        const client = await connectToMongoDB();

        if (!client) {
            res.send('Error al conectarse a Mongo DB.');
        }

        const coleccion = client.db(db_nombre).collection(collection_nombre);

        const resultado = await coleccion.updateOne({ "codigo": codigo }, { $set: { "precio": precioNuevo } });

        if (resultado.modifiedCount === 1) {
            console.log('Documento modificado.');
            res.status(200).send(`codigo: ${codigo}, nuevo precio: ${precioNuevo}`);
        } else {
            console.log('No se encontró el documento o no se realizó ninguna modificación.');
            res.status(404).send('No se encontró el documento o no se realizó ninguna modificación.');
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al conseguir los docs de la base de datos.');

    } finally {
        await disconnectFromMongoDB();
    }
});

// Eliminar un doc D
computacionRute.delete("/codigo/:codigo", async (req, res) => {
    const codigo = parseInt(req.params.codigo);

    if (!codigo) {
        return res.status(400).send('Error en el formato de los datos.');
    }

    try {
        const client = await connectToMongoDB();

        if (!client) {
            res.send('Error al conectarse a Mongo DB.');
        }

        const coleccion = client.db(db_nombre).collection(collection_nombre);

        const resultado = await coleccion.deleteOne({ "codigo": codigo });

        if (resultado.deletedCount === 0) {
            res.status(404).send(`No se encontraron coincidencias para el codigo: ${codigo}`);
        } else {
            console.log('Documento eliminado.');
            res.status(204).send();
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al conseguir los docs de la base de datos.');

    } finally {
        await disconnectFromMongoDB();
    }

});

export default computacionRute;
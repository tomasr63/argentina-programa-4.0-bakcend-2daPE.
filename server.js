import express from "express";
import computacionRute from "./routes/computacion.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para admitir req.body en formato json
app.use(express.json());

// Ruta de computacion
app.use("/computacion", computacionRute);

// Middleware setear res header
app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});

// Middleware para manejar rutas inexistentes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
    next();
});

// Ruta principal/raiz
app.get("/", (req, res) => {
    res.send({ Message: "Bienvenidos a la API!!!" });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
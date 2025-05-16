// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database'); // Asegúrate de que apunte bien

require('./models'); // Importa modelos para que sequelize.sync() los reconozca

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express!');
});

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a la base de datos');

    await sequelize.sync({ alter: true }); // Usamos alter para actualizar sin borrar datos
    console.log('✅ Tablas sincronizadas correctamente');

    // Mostrar tablas existentes después de sync
    const [resultados] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    console.log("📦 Tablas en la base de datos:");
    resultados.forEach(t => console.log(`- ${t.name}`));

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
}

iniciarServidor();

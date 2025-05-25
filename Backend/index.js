// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const monedaRoutes = require('./routes/moneda.route');
const anuncioRoutes = require('./routes/anuncio.route');
const billeteraRoutes = require('./routes/billetera.route');

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

    //await sequelize.sync({ alter: true }); // Usamos alter para actualizar sin borrar dato
    console.log('✅ Tablas sincronizadas correctamente');

    // Mostrar tablas existentes después de sync
    const [resultados] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    console.log("📦 Tablas en la base de datos:");
    resultados.forEach(t => console.log(`- ${t.name}`));
    //await asignarAdmin('oscar@email.com');
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
}
iniciarServidor();

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/monedas', monedaRoutes);
app.use('/api/anuncios', anuncioRoutes);
app.use('/api/billeteras', billeteraRoutes);







const { Usuario } = require('./models');
async function asignarAdmin(email) {
  const usuario = await Usuario.findOne({ where: { email } });

  if (usuario) {
    if (usuario.rol !== 1) {
      usuario.rol = 1;
      await usuario.save();
      console.log(`✅ El usuario ${usuario.username} ahora es admin (rol 1)`);
    } else {
      console.log(`ℹ️ El usuario ${usuario.username} ya es admin`);
    }
  } else {
    console.log('❌ No se encontró el usuario para hacer admin');
  }
}
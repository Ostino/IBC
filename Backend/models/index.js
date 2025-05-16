const Usuario = require('./usuario.model');
const Moneda = require('./moneda.model');
const Billetera = require('./billetera.model');
const Anuncio = require('./anuncio.model');
const Transaccion = require('./transaccion.model');

// Relaciones

// User ↔ Wallet
Billetera.belongsTo(Usuario);
Usuario.hasMany(Billetera);

// Wallet ↔ Moneda
Billetera.belongsTo(Moneda);
Moneda.hasMany(Billetera);

// User ↔ Announcement
Anuncio.belongsTo(Usuario);
Usuario.hasMany(Anuncio);

// Moneda ↔ Announcement
Anuncio.belongsTo(Moneda);
Moneda.hasMany(Anuncio);

// Transaction ↔ User (buyer / seller)
Transaccion.belongsTo(Usuario, { as: 'comprador', foreignKey: 'compradorId' });
Usuario.hasMany(Transaccion, { foreignKey: 'compradorId', as: 'compras' });

Transaccion.belongsTo(Usuario, { as: 'vendedor', foreignKey: 'vendedorId' });
Usuario.hasMany(Transaccion, { foreignKey: 'vendedorId', as: 'ventas' });

// Transaction ↔ Wallet (from / to)
Transaccion.belongsTo(Billetera, { as: 'deBilletera', foreignKey: 'deBilleteraId' });
Billetera.hasMany(Transaccion, { foreignKey: 'deBilleteraId', as: 'deTransferencia' });

Transaccion.belongsTo(Billetera, { as: 'haciaBilletera', foreignKey: 'haciaBilleteraId' });
Billetera.hasMany(Transaccion, { foreignKey: 'haciaBilleteraId', as: 'haciaTransferencia' });

// Transaction ↔ Announcement
Transaccion.belongsTo(Anuncio);
Anuncio.hasMany(Transaccion);

module.exports = {
  Usuario,
  Moneda,
  Billetera,
  Anuncio,
  Transaccion
};

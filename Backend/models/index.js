const Usuario = require('./usuario.model');
const Moneda = require('./moneda.model');
const Billetera = require('./billetera.model');
const Anuncio = require('./anuncio.model');
const Transaccion = require('./transaccion.model');
const Token = require('./token.model')
// Relaciones

// Usuario ↔ Billetera
Billetera.belongsTo(Usuario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Usuario.hasMany(Billetera, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });

// Moneda ↔ Billetera
Billetera.belongsTo(Moneda, { foreignKey: 'monedaId', onDelete: 'CASCADE' });
Moneda.hasMany(Billetera, { foreignKey: 'monedaId', onDelete: 'CASCADE' });

// Usuario ↔ Anuncio
Anuncio.belongsTo(Usuario, { onDelete: 'CASCADE' });
Usuario.hasMany(Anuncio, { onDelete: 'CASCADE' });

// Moneda ↔ Anuncio
Anuncio.belongsTo(Moneda, { onDelete: 'CASCADE' });
Moneda.hasMany(Anuncio, { onDelete: 'CASCADE' });

// Usuario (comprador / vendedor) ↔ Transacción
Transaccion.belongsTo(Usuario, { as: 'comprador', foreignKey: 'compradorId', onDelete: 'CASCADE' });
Usuario.hasMany(Transaccion, { foreignKey: 'compradorId', as: 'compras', onDelete: 'CASCADE' });

Transaccion.belongsTo(Usuario, { as: 'vendedor', foreignKey: 'vendedorId', onDelete: 'CASCADE' });
Usuario.hasMany(Transaccion, { foreignKey: 'vendedorId', as: 'ventas', onDelete: 'CASCADE' });

// Billetera (de / hacia) ↔ Transacción
Transaccion.belongsTo(Billetera, { as: 'deBilletera', foreignKey: 'deBilleteraId', onDelete: 'CASCADE' });
Billetera.hasMany(Transaccion, { foreignKey: 'deBilleteraId', as: 'deTransferencia', onDelete: 'CASCADE' });

Transaccion.belongsTo(Billetera, { as: 'haciaBilletera', foreignKey: 'haciaBilleteraId', onDelete: 'CASCADE' });
Billetera.hasMany(Transaccion, { foreignKey: 'haciaBilleteraId', as: 'haciaTransferencia', onDelete: 'CASCADE' });

// Anuncio ↔ Transacción
Transaccion.belongsTo(Anuncio, { onDelete: 'CASCADE' });
Anuncio.hasMany(Transaccion, { onDelete: 'CASCADE' });

Token.belongsTo(Usuario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Usuario.hasMany(Token, { foreignKey: 'usuarioId' });

module.exports = {
  Usuario,
  Moneda,
  Billetera,
  Anuncio,
  Transaccion,
  Token
};

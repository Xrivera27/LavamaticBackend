var DataTypes = require("sequelize").DataTypes;
var _Users = require("./Users");
var _audit_log_entries = require("./audit_log_entries");
var _buckets = require("./buckets");
var _equipos = require("./equipos");
var _estados = require("./estados");
var _flow_state = require("./flow_state");
var _historial_estados = require("./historial_estados");
var _horarios = require("./horarios");
var _identities = require("./identities");
var _instances = require("./instances");
var _key = require("./key");
var _mantenimiento_equipos = require("./mantenimiento_equipos");
var _messages = require("./messages");
var _mfa_amr_claims = require("./mfa_amr_claims");
var _mfa_challenges = require("./mfa_challenges");
var _mfa_factors = require("./mfa_factors");
var _migrations = require("./migrations");
var _objects = require("./objects");
var _one_time_tokens = require("./one_time_tokens");
var _pagos = require("./pagos");
var _pedidos = require("./pedidos");
var _pedidos_equipos = require("./pedidos_equipos");
var _pedidos_servicios = require("./pedidos_servicios");
var _refresh_tokens = require("./refresh_tokens");
var _repartidores = require("./repartidores");
var _reservas_equipos = require("./reservas_equipos");
var _roles = require("./roles");
var _roles_permisos = require("./roles_permisos");
var _s3_multipart_uploads = require("./s3_multipart_uploads");
var _s3_multipart_uploads_parts = require("./s3_multipart_uploads_parts");
var _saml_providers = require("./saml_providers");
var _saml_relay_states = require("./saml_relay_states");
var _schema_migrations = require("./schema_migrations");
var _schema_migrations = require("./schema_migrations");
var _secrets = require("./secrets");
var _servicios = require("./servicios");
var _sessions = require("./sessions");
var _sso_domains = require("./sso_domains");
var _sso_providers = require("./sso_providers");
var _subscription = require("./subscription");
var _users = require("./users");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var Users = _Users(sequelize, DataTypes);
  var audit_log_entries = _audit_log_entries(sequelize, DataTypes);
  var buckets = _buckets(sequelize, DataTypes);
  var equipos = _equipos(sequelize, DataTypes);
  var estados = _estados(sequelize, DataTypes);
  var flow_state = _flow_state(sequelize, DataTypes);
  var historial_estados = _historial_estados(sequelize, DataTypes);
  var horarios = _horarios(sequelize, DataTypes);
  var identities = _identities(sequelize, DataTypes);
  var instances = _instances(sequelize, DataTypes);
  var key = _key(sequelize, DataTypes);
  var mantenimiento_equipos = _mantenimiento_equipos(sequelize, DataTypes);
  var messages = _messages(sequelize, DataTypes);
  var mfa_amr_claims = _mfa_amr_claims(sequelize, DataTypes);
  var mfa_challenges = _mfa_challenges(sequelize, DataTypes);
  var mfa_factors = _mfa_factors(sequelize, DataTypes);
  var migrations = _migrations(sequelize, DataTypes);
  var objects = _objects(sequelize, DataTypes);
  var one_time_tokens = _one_time_tokens(sequelize, DataTypes);
  var pagos = _pagos(sequelize, DataTypes);
  var pedidos = _pedidos(sequelize, DataTypes);
  var pedidos_equipos = _pedidos_equipos(sequelize, DataTypes);
  var pedidos_servicios = _pedidos_servicios(sequelize, DataTypes);
  var refresh_tokens = _refresh_tokens(sequelize, DataTypes);
  var repartidores = _repartidores(sequelize, DataTypes);
  var reservas_equipos = _reservas_equipos(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var roles_permisos = _roles_permisos(sequelize, DataTypes);
  var s3_multipart_uploads = _s3_multipart_uploads(sequelize, DataTypes);
  var s3_multipart_uploads_parts = _s3_multipart_uploads_parts(sequelize, DataTypes);
  var saml_providers = _saml_providers(sequelize, DataTypes);
  var saml_relay_states = _saml_relay_states(sequelize, DataTypes);
  var schema_migrations = _schema_migrations(sequelize, DataTypes);
  var schema_migrations = _schema_migrations(sequelize, DataTypes);
  var secrets = _secrets(sequelize, DataTypes);
  var servicios = _servicios(sequelize, DataTypes);
  var sessions = _sessions(sequelize, DataTypes);
  var sso_domains = _sso_domains(sequelize, DataTypes);
  var sso_providers = _sso_providers(sequelize, DataTypes);
  var subscription = _subscription(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  saml_relay_states.belongsTo(flow_state, { as: "flow_state", foreignKey: "flow_state_id"});
  flow_state.hasMany(saml_relay_states, { as: "saml_relay_states", foreignKey: "flow_state_id"});
  mfa_challenges.belongsTo(mfa_factors, { as: "factor", foreignKey: "factor_id"});
  mfa_factors.hasMany(mfa_challenges, { as: "mfa_challenges", foreignKey: "factor_id"});
  mfa_amr_claims.belongsTo(sessions, { as: "session", foreignKey: "session_id"});
  sessions.hasMany(mfa_amr_claims, { as: "mfa_amr_claims", foreignKey: "session_id"});
  refresh_tokens.belongsTo(sessions, { as: "session", foreignKey: "session_id"});
  sessions.hasMany(refresh_tokens, { as: "refresh_tokens", foreignKey: "session_id"});
  saml_providers.belongsTo(sso_providers, { as: "sso_provider", foreignKey: "sso_provider_id"});
  sso_providers.hasMany(saml_providers, { as: "saml_providers", foreignKey: "sso_provider_id"});
  saml_relay_states.belongsTo(sso_providers, { as: "sso_provider", foreignKey: "sso_provider_id"});
  sso_providers.hasMany(saml_relay_states, { as: "saml_relay_states", foreignKey: "sso_provider_id"});
  sso_domains.belongsTo(sso_providers, { as: "sso_provider", foreignKey: "sso_provider_id"});
  sso_providers.hasMany(sso_domains, { as: "sso_domains", foreignKey: "sso_provider_id"});
  identities.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(identities, { as: "identities", foreignKey: "user_id"});
  mfa_factors.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(mfa_factors, { as: "mfa_factors", foreignKey: "user_id"});
  one_time_tokens.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(one_time_tokens, { as: "one_time_tokens", foreignKey: "user_id"});
  sessions.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(sessions, { as: "sessions", foreignKey: "user_id"});
  mantenimiento_equipos.belongsTo(equipos, { as: "id_equipo_equipo", foreignKey: "id_equipo"});
  equipos.hasMany(mantenimiento_equipos, { as: "mantenimiento_equipos", foreignKey: "id_equipo"});
  pedidos_equipos.belongsTo(equipos, { as: "id_equipo_equipo", foreignKey: "id_equipo"});
  equipos.hasMany(pedidos_equipos, { as: "pedidos_equipos", foreignKey: "id_equipo"});
  reservas_equipos.belongsTo(equipos, { as: "id_equipo_equipo", foreignKey: "id_equipo"});
  equipos.hasMany(reservas_equipos, { as: "reservas_equipos", foreignKey: "id_equipo"});
  historial_estados.belongsTo(estados, { as: "id_estado_estado", foreignKey: "id_estado"});
  estados.hasMany(historial_estados, { as: "historial_estados", foreignKey: "id_estado"});
  pedidos.belongsTo(estados, { as: "id_estado_estado", foreignKey: "id_estado"});
  estados.hasMany(pedidos, { as: "pedidos", foreignKey: "id_estado"});
  reservas_equipos.belongsTo(horarios, { as: "id_horario_horario", foreignKey: "id_horario"});
  horarios.hasMany(reservas_equipos, { as: "reservas_equipos", foreignKey: "id_horario"});
  historial_estados.belongsTo(pedidos, { as: "id_pedido_pedido", foreignKey: "id_pedido"});
  pedidos.hasMany(historial_estados, { as: "historial_estados", foreignKey: "id_pedido"});
  pagos.belongsTo(pedidos, { as: "id_pedido_pedido", foreignKey: "id_pedido"});
  pedidos.hasMany(pagos, { as: "pagos", foreignKey: "id_pedido"});
  pedidos_equipos.belongsTo(pedidos, { as: "id_pedido_pedido", foreignKey: "id_pedido"});
  pedidos.hasMany(pedidos_equipos, { as: "pedidos_equipos", foreignKey: "id_pedido"});
  pedidos_servicios.belongsTo(pedidos, { as: "id_pedido_pedido", foreignKey: "id_pedido"});
  pedidos.hasMany(pedidos_servicios, { as: "pedidos_servicios", foreignKey: "id_pedido"});
  reservas_equipos.belongsTo(pedidos, { as: "id_pedido_pedido", foreignKey: "id_pedido"});
  pedidos.hasMany(reservas_equipos, { as: "reservas_equipos", foreignKey: "id_pedido"});
  pedidos.belongsTo(repartidores, { as: "id_repartidor_repartidore", foreignKey: "id_repartidor"});
  repartidores.hasMany(pedidos, { as: "pedidos", foreignKey: "id_repartidor"});
  roles_permisos.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol"});
  roles.hasOne(roles_permisos, { as: "roles_permiso", foreignKey: "id_rol"});
  usuarios.belongsTo(roles, { as: "id_rol_role", foreignKey: "id_rol"});
  roles.hasMany(usuarios, { as: "usuarios", foreignKey: "id_rol"});
  pedidos_servicios.belongsTo(servicios, { as: "id_servicio_servicio", foreignKey: "id_servicio"});
  servicios.hasMany(pedidos_servicios, { as: "pedidos_servicios", foreignKey: "id_servicio"});
  pedidos.belongsTo(usuarios, { as: "id_cliente_usuario", foreignKey: "id_cliente"});
  usuarios.hasMany(pedidos, { as: "pedidos", foreignKey: "id_cliente"});
  repartidores.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuarios.hasOne(repartidores, { as: "repartidore", foreignKey: "id_usuario"});
  objects.belongsTo(buckets, { as: "bucket", foreignKey: "bucket_id"});
  buckets.hasMany(objects, { as: "objects", foreignKey: "bucket_id"});
  s3_multipart_uploads.belongsTo(buckets, { as: "bucket", foreignKey: "bucket_id"});
  buckets.hasMany(s3_multipart_uploads, { as: "s3_multipart_uploads", foreignKey: "bucket_id"});
  s3_multipart_uploads_parts.belongsTo(buckets, { as: "bucket", foreignKey: "bucket_id"});
  buckets.hasMany(s3_multipart_uploads_parts, { as: "s3_multipart_uploads_parts", foreignKey: "bucket_id"});
  s3_multipart_uploads_parts.belongsTo(s3_multipart_uploads, { as: "upload", foreignKey: "upload_id"});
  s3_multipart_uploads.hasMany(s3_multipart_uploads_parts, { as: "s3_multipart_uploads_parts", foreignKey: "upload_id"});

  return {
    Users,
    audit_log_entries,
    buckets,
    equipos,
    estados,
    flow_state,
    historial_estados,
    horarios,
    identities,
    instances,
    key,
    mantenimiento_equipos,
    messages,
    mfa_amr_claims,
    mfa_challenges,
    mfa_factors,
    migrations,
    objects,
    one_time_tokens,
    pagos,
    pedidos,
    pedidos_equipos,
    pedidos_servicios,
    refresh_tokens,
    repartidores,
    reservas_equipos,
    roles,
    roles_permisos,
    s3_multipart_uploads,
    s3_multipart_uploads_parts,
    saml_providers,
    saml_relay_states,
    schema_migrations,
    schema_migrations,
    secrets,
    servicios,
    sessions,
    sso_domains,
    sso_providers,
    subscription,
    users,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

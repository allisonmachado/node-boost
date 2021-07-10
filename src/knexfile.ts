import { Environment as Env } from './lib/Environment';

const envConnection = {
  client: 'mysql',
  connection: {
    host: Env.getMysqlHost(),
    port: Env.getMysqlPort(),
    ssl: Env.getMysqlSSLConnection(),
    user: Env.getMysqlUser(),
    password: Env.getMysqlPassword(),
    database: Env.getMysqlSchema(),
    socketPath: Env.getMysqlSocketPath(),
  },
  acquireConnectionTimeout: 10000,
};

/**
 * This export is used by knex-cli on execution of migrations
 * and shall NOT be used in application code, instead use the
 * class Connection defined in the data layer
 */
export const development = envConnection;
export const staging = envConnection;
export const production = envConnection;

export default envConnection;

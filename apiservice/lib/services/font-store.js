import redis from 'redis';
import { logger, config } from 'alerter-common';
import cache from './variables';

const client = redis.createClient(config.REDIS_URL);

client.on('error', (err) => {
  logger.error('REDIS Error while loading configurations:');
  console.error(err);
});

const load = async () => new Promise((resolve, reject) => {
  logger.info('Loading configuration from redis');
  client.lrange('configurations', 0, -1, (err, data) => {
    if (err) {
      logger.error(err);
      return reject(err);
    }

    const json = data.map(d => JSON.parse(d));
    resolve(json);
  });
});

const remove = async (key) => {
  // TODO: optimize
  const configs = await load();
  const toDelete = configs.find(c => c.key === key);
  if (toDelete) {
    client.lrem('configurations', 1, JSON.stringify(toDelete));
  }
};

const save = async (rule) => {
  const configs = await load();
  const index = configs.findIndex(c => c.key === rule.key);
  if (index > -1) {
    client.lset('configurations', index, JSON.stringify(rule));
  } else {
    client.rpush('configurations', JSON.stringify(rule));
  }

  return cache.updateCache(await load());
};

const loadEmailConfig = async () => new Promise((resolve, reject) => {
  client.get('emailConfig', (err, data) => {
    if (err) {
      return reject(err);
    }

    resolve(JSON.parse(data));
  });
});

const saveEmailConfig = async data => new Promise((resolve) => {
  client.set('emailConfig', JSON.stringify(data), (err) => {
    if (err) {
      return resolve(false);
    }

    resolve(true);
  });
});

export default {
  load,
  loadEmailConfig,
  saveEmailConfig,
  save,
  remove,
};

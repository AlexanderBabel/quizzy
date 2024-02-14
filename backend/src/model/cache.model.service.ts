import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RedisStore, redisStore } from 'cache-manager-redis-yet';
import { readFileSync } from 'fs';

@Injectable()
export class CacheModelService implements OnModuleInit {
  private scriptShas = new Map<string, string>();
  private redis: RedisStore;

  async connectRedis() {
    const redis = await redisStore({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      ttl: 0, //Set data to not expire
    });

    this.redis = redis;
  }

  async set(key: string, data: any): Promise<void> {
    return this.redis.set(key, data);
  }

  async get(key: string): Promise<any> {
    return this.redis.get(key);
  }

  private loadScriptFromFile(filepath: string): string {
    const file = readFileSync(filepath, 'utf8');

    return file;
  }

  private async loadScript(name: string, filepath: string): Promise<void> {
    const script = this.loadScriptFromFile(filepath);

    try {
      const scriptSha = await this.redis.client.scriptLoad(script);
      this.scriptShas.set(name, scriptSha);
    } catch (error) {
      console.error('Failed to load scripts! ' + error);
      throw new InternalServerErrorException();
    }
  }

  async runScriptByName(
    scriptName: string,
    keys: string[],
    args: string[],
  ): Promise<any> {
    const scriptSha = this.scriptShas.get(scriptName);

    if (!scriptSha) {
      throw new NotFoundException('Requested script not loaded!');
    }

    const EvalOptions = {
      keys: keys,
      arguments: args,
    };

    try {
      const result = await this.redis.client.evalSha(scriptSha, EvalOptions);
      return result;
    } catch (error) {
      console.error('Error running lua script: ' + error);
      throw new InternalServerErrorException();
    }
  }

  async onModuleInit() {
    //A bit hacky to initialize the redis client like this - but documentation is sparse
    await this.connectRedis(); //Perhaps this can be streamlined further in the future?

    await this.loadScript('joinLobby', 'luaScripts/joinLobby.lua');

    await this.loadScript('kickPlayer', 'luaScripts/kickPlayer.lua');
  }
}

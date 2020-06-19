import { ipcMain as ipc } from 'electron-better-ipc'
import {
  CHECK_BITCOIND,
  GET_BALANCE,
  GET_CONFIG,
} from '../../common/constants/IPC'
import { BalanceAnswer } from '../../common/models/ipc/BalanceAnswer'
import { BitcoinDConfig } from '../../common/models/ipc/BitcoinDConfig'
import { ConfigAnswer } from '../../common/models/ipc/ConfigAnswer'
import { GeneralAnswer } from '../../common/models/ipc/GeneralAnswer'
import { IPCEvents } from '../../common/models/ipc/IPCEvents'
import { isSuccessful } from '../../common/utils/failable'
import BitcoinDClient from '../api/bitcoind'
import { IPCError } from '../../common/models/ipc/IPCError'
import ConfigRepository from '../config/ConfigRepository'

export type BitcoinDConfigCallback = (
  config: BitcoinDConfig,
  client: BitcoinDClient
) => void

export class BitcoinDEvents implements IPCEvents {
  private _client = new BitcoinDClient()
  private _storage: ConfigRepository
  private _config: BitcoinDConfig | null = null
  private _configCallback: BitcoinDConfigCallback

  constructor(
    storage: ConfigRepository,
    configCallback: BitcoinDConfigCallback
  ) {
    this._storage = storage
    this._configCallback = configCallback
  }

  public async initialize(): Promise<void> {
    const result = await this._storage.ReadBitcoinDConfig()
    if (!isSuccessful(result)) {
      // No config
      return
    }

    this._config = result.value
    await this._client.configure(this._config)
    console.log('CALLING CONFIG CALLBACK')
    this._configCallback(this._config, this._client)
  }

  public registerReplies(): void {
    ipc.answerRenderer(CHECK_BITCOIND, async data => {
      const config = data as BitcoinDConfig
      try {
        await this._client.configure(config)
        await this._storage.WriteBitcoinDConfig(config)
        this._config = config
        this._configCallback(config, this._client)
        return new GeneralAnswer(true)
      } catch (e) {
        return new GeneralAnswer(false, e)
      }
    })

    ipc.answerRenderer(GET_BALANCE, async () => {
      try {
        const balance = await this._client.getBalance()
        return new BalanceAnswer(true, balance)
      } catch (e) {
        return new BalanceAnswer(false, 0, e)
      }
    })

    ipc.answerRenderer(GET_CONFIG, () => {
      if (this._config) {
        return new ConfigAnswer(true, this._config)
      } else {
        return new ConfigAnswer(
          false,
          null,
          new IPCError('general', -1, 'No valid config found', 'NoValidConfig')
        )
      }
    })
  }
}

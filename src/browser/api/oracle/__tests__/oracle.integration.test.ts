/**
 * @jest-environment node
 */

import { DateTime, Duration } from 'luxon'
import { isSuccessful } from '../../../../common/utils/failable'
import OracleClient from '../oracleClient'

describe('Oracle Client integration', () => {
  const testAssetID = 'btcusd'
  let client: OracleClient
  beforeEach(() => {
    client = new OracleClient({ baseUrl: 'http://3.115.1.105:443' })
  })

  test('Get Oracle public key', async () => {
    // act
    const result = await client.getOraclePublicKey()

    // assert
    expect(isSuccessful(result)).toBeTruthy()
    if (isSuccessful(result)) {
      const actual = result.value
      expect(actual).toHaveLength(66)
    }
  })

  test('Get asset list', async () => {
    // act
    const result = await client.getAssets()

    // assert
    expect(isSuccessful(result)).toBeTruthy()
    if (isSuccessful(result)) {
      const actual = result.value
      expect(actual.length).toBeGreaterThan(0)
    }
  })

  test('Get oracle config', async () => {
    // act
    const result = await client.getOracleConfig(testAssetID)

    // assert
    expect(isSuccessful(result)).toBeTruthy()
    if (isSuccessful(result)) {
      const actual = result.value
      expect(actual.frequency).toBeDefined()
      expect(actual.range).toBeDefined()
    }
  })

  test('Get asset rvalue', async () => {
    // arrange
    const paramDate = DateTime.utc()

    // act
    const result = await client.getRvalue(testAssetID, paramDate)

    // assert
    expect(isSuccessful(result)).toBeTruthy()
    if (isSuccessful(result)) {
      const actual = result.value
      expect(actual.assetID).toEqual(testAssetID)
      expect(actual.oraclePublicKey).toBeDefined()
      expect(actual.publishDate).toBeDefined()
      expect(actual.rvalue).toBeDefined()
    }
  })

  test('Get asset signature', async () => {
    // arrange
    const paramDate = DateTime.utc().minus(Duration.fromISO('P1DT'))

    // act
    const result = await client.getSignature(testAssetID, paramDate)

    // assert
    expect(isSuccessful(result)).toBeTruthy()
    if (isSuccessful(result)) {
      const actual = result.value
      expect(actual.assetID).toEqual(testAssetID)
      expect(actual.oraclePublicKey).toBeDefined()
      expect(actual.publishDate).toBeDefined()
      expect(actual.rvalue).toBeDefined()
      expect(actual.signature).toBeDefined()
      expect(actual.value).toBeDefined()
    }
  })
})

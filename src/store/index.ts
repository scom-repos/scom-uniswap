import {ITokenObject } from '../global/index';
import { getChainId, getChainNativeToken, isWalletConnected } from './utils';
import { tokenStore, WETHByChainId, assets as tokenAssets } from '@scom/scom-token-list';

export const nullAddress = "0x0000000000000000000000000000000000000000";

export const getWETH = (chainId: number): ITokenObject => {
  let wrappedToken = WETHByChainId[chainId];
  return wrappedToken;
};

export const getTokenIcon = (address: string) => {
  if (!address) return '';
  const tokenMap = tokenStore.tokenMap;
  let ChainNativeToken;
  let tokenObject;
  if (isWalletConnected()){
    ChainNativeToken = getChainNativeToken(getChainId());
    tokenObject = address == ChainNativeToken.symbol ? ChainNativeToken : tokenMap[address.toLowerCase()];
  } else {
    tokenObject = tokenMap[address.toLowerCase()];
  }
  return tokenAssets.tokenPath(tokenObject, getChainId());
}

export * from './utils';

export const getSupportedTokens = (tokens: ITokenObject[], chainId: number) => {
  return tokens.filter(token => token.chainId === chainId) || []
}

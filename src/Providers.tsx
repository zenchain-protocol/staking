// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BalancesProvider } from 'contexts/Balances';
import { BondedProvider } from 'contexts/Bonded';
import { FastUnstakeProvider } from 'contexts/FastUnstake';
import { FiltersProvider } from 'contexts/Filters';
import { HelpProvider } from 'contexts/Help';
import { MenuProvider } from 'contexts/Menu';
import { MigrateProvider } from 'contexts/Migrate';
import { PromptProvider } from 'contexts/Prompt';
import { PluginsProvider } from 'contexts/Plugins';
import { SetupProvider } from 'contexts/Setup';
import { StakingProvider } from 'contexts/Staking';
import { TooltipProvider } from 'contexts/Tooltip';
import { TransferOptionsProvider } from 'contexts/TransferOptions';
import { TxMetaProvider } from 'contexts/TxMeta';
import { UIProvider } from 'contexts/UI';
import { ValidatorsProvider } from 'contexts/Validators/ValidatorEntries';
import { FavoriteValidatorsProvider } from 'contexts/Validators/FavoriteValidators';
import { PayoutsProvider } from 'contexts/Payouts';
import { useNetwork } from 'contexts/Network';
import { APIProvider } from 'contexts/Api';
import { ThemedRouter } from 'Themes';
import type { Provider } from 'hooks/withProviders';
import { withProviders } from 'hooks/withProviders';
import { CommunityProvider } from 'contexts/Community';
import { OverlayProvider } from 'kits/Overlay/Provider';
import { EthereumProvider } from './contexts/Ethereum';

export const Providers = () => {
  const { network } = useNetwork();

  // !! Provider order matters.
  const providers: Provider[] = [
    UIProvider,
    [APIProvider, { network }],
    EthereumProvider,
    HelpProvider,
    PluginsProvider,
    BondedProvider,
    BalancesProvider,
    StakingProvider,
    TransferOptionsProvider,
    ValidatorsProvider,
    FavoriteValidatorsProvider,
    FastUnstakeProvider,
    PayoutsProvider,
    SetupProvider,
    MenuProvider,
    TooltipProvider,
    TxMetaProvider,
    OverlayProvider,
    PromptProvider,
    MigrateProvider,
    FiltersProvider,
    CommunityProvider,
  ];

  return withProviders(providers, ThemedRouter);
};

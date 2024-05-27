// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FC, FunctionComponent, ReactNode, SVGProps } from 'react';
import type { Theme } from 'contexts/Themes/types';
import type BigNumber from 'bignumber.js';
import type { NotificationItem } from 'controllers/NotificationsController/types';
import type { ActiveBalance } from 'contexts/Balances/types';
import type { PayoutType } from 'controllers/SubscanController/types';
import type {
  APIActiveEra,
  APINetworkMetrics,
  APIStakingMetrics,
} from 'contexts/Api/types';
import type { SyncEvent } from 'controllers/SyncController/types';
import type { CSSProperties } from 'styled-components';
import type { APIEventDetail } from 'model/Api/types';
import type { OnlineStatusEvent } from 'controllers/OnlineStatusController/types';

declare global {
  interface Window {
    walletExtension?: AnyJson;
    opera?: boolean;
  }
  interface DocumentEventMap {
    notification: CustomEvent<NotificationItem>;
    'api-status': CustomEvent<APIEventDetail>;
    'online-status': CustomEvent<OnlineStatusEvent>;
    'new-block-number': CustomEvent<{ blockNumber: string }>;
    'new-network-metrics': CustomEvent<{
      networkMetrics: APINetworkMetrics;
    }>;
    'new-active-era': CustomEvent<{ activeEra: APIActiveEra }>;
    'new-staking-metrics': CustomEvent<{
      stakingMetrics: APIStakingMetrics;
    }>;
    'new-sync-status': CustomEvent<SyncEvent>;
    'new-external-account': CustomEvent<{ address: string }>;
    'new-account-balance': CustomEvent<ActiveBalance & { address: string }>;
    'subscan-data-updated': CustomEvent<{ keys: PayoutType[] }>;
  }
}

export type NetworkName = 'polkadot' | 'zenchain_testnet';

export type Networks = Record<string, Network>;

type NetworkColor =
  | 'primary'
  | 'secondary'
  | 'stroke'
  | 'transparent'
  | 'pending';
export interface Network {
  name: NetworkName;
  chainId: number;
  endpoints: {
    lightClient: string;
    defaultRpcEndpoint: string;
    wsRpcEndpoints: Record<string, string>;
    jsonRpcEndpoints: Record<string, string>;
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colors: Record<NetworkColor, { [key in Theme]: string }>;
  unit: string;
  units: number;
  ss58: number;
  brand: {
    icon: FunctionComponent<
      SVGProps<SVGSVGElement> & { title?: string | undefined }
    >;
    token: FunctionComponent<
      SVGProps<SVGSVGElement> & { title?: string | undefined }
    >;
    logo: {
      svg: FunctionComponent<
        SVGProps<SVGSVGElement> & { title?: string | undefined }
      >;
      width: string;
    };
    inline: {
      svg: FunctionComponent<
        SVGProps<SVGSVGElement> & { title?: string | undefined }
      >;
      size: string;
    };
  };
  api: {
    unit: string;
    priceTicker: string;
  };
  defaultFeeReserve: number;
  maxExposurePageSize: BigNumber;
}

export interface PageCategory {
  id: number;
  key: string;
}

export type PageCategoryItems = PageCategory[];

export interface PageItem {
  category: number;
  key: string;
  uri: string;
  hash: string;
  Entry: FC<PageProps>;
  lottie: AnyJson;
  action?: {
    type: string;
    status: string;
    text?: string | undefined;
  };
}

export type PagesConfigItems = PageItem[];

export interface PageProps {
  page: PageProp;
}

interface PageProp {
  key: string;
}

export type MaybeAddress = `0x${string}` | string | null | undefined;

export type MaybeString = string | null;

// track the status of a syncing / fetching process.
export type Sync = 'unsynced' | 'syncing' | 'synced';

// track whether bonding should be for nominator or nomination pool.
export type BondFor = 'nominator';

// which medium components are being displayed on.
export type DisplayFor = 'default' | 'modal' | 'canvas' | 'card';

// generic function with no args or return type.
export type Fn = () => void;

// any types to compress compiler warnings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyApi = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyJson = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyMetaBatch = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySubscan = any;

// A generic type to handle React components. We assume the component may have
// children and styling applied to it.
export interface ComponentBase {
  // passing react children.
  children?: ReactNode;
  // passing custom styling.
  style?: CSSProperties;
}

export type ComponentBaseWithClassName = ComponentBase & {
  // passing a className string.
  className?: string;
};

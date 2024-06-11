// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Validator } from 'contexts/Validators/types';
import type { AnyJson } from 'types';
import type { ListFormat } from '../List/types';

export interface ManageNominationsInterface {
  addToSelected: (item: AnyJson) => void;
  removeFromSelected: (item: AnyJson) => void;
  setListFormat: (format: ListFormat) => void;
  setSelectActive: (active: boolean) => void;
  resetSelected: () => void;
  selected: Validator[];
  listFormat: ListFormat;
  selectActive: boolean;
  selectTogglable: boolean;
}

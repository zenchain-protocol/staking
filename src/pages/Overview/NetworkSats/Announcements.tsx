// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter, planckToUnit, sortWithNull } from '@w3ux/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Announcement as AnnouncementLoader } from 'library/Loader/Announcement';
import { useNetwork } from 'contexts/Network';
import { useApi } from 'contexts/Api';
import { Item } from 'library/Announcements/Wrappers';

export const Announcements = () => {
  const { t } = useTranslation('pages');
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const {
    stakingMetrics: { totalStaked },
  } = useApi();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const listItem = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
    },
  };

  const announcements = [];

  // total staked on the network
  if (!totalStaked.isZero()) {
    announcements.push({
      class: 'neutral',
      title: t('overview.networkCurrentlyStaked', {
        total: planckToUnit(totalStaked, units).integerValue().toFormat(),
        unit,
        network: capitalizeFirstLetter(network),
      }),
      subtitle: t('overview.networkCurrentlyStakedSubtitle', {
        unit,
      }),
    });
  } else {
    announcements.push(null);
  }

  announcements.sort(sortWithNull(true));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ width: '100%' }}
    >
      {announcements.map((item, index) =>
        item === null ? (
          <AnnouncementLoader key={`announcement_${index}`} />
        ) : (
          <Item key={`announcement_${index}`} variants={listItem}>
            <h4 className={item.class}>
              <FontAwesomeIcon
                icon={faBack}
                style={{ marginRight: '0.6rem' }}
              />
              {item.title}
            </h4>
            <p>{item.subtitle}</p>
          </Item>
        )
      )}
    </motion.div>
  );
};

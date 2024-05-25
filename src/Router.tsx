// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Prompt } from 'library/Prompt';
import { PagesConfig } from 'config/pages';
import { useUi } from 'contexts/UI';
import { ErrorFallbackApp, ErrorFallbackRoutes } from 'library/ErrorBoundary';
import { Headers } from 'library/Headers';
import { Help } from 'library/Help';
import { Menu } from 'library/Menu';
import { NetworkBar } from 'library/NetworkBar';
import { SideMenu } from 'library/SideMenu';
import { Tooltip } from 'library/Tooltip';
import { Overlays } from 'overlay';
import { useNetwork } from 'contexts/Network';
import { Notifications } from 'library/Notifications';
import { NotificationsController } from 'controllers/NotificationsController';
import { Page } from 'Page';
import { Body } from 'kits/Structure/Body';
import { Main } from 'kits/Structure/Main';
import { Offline } from 'library/Offline';
import { useAccount } from 'wagmi';

const RouterInner = () => {
  const { t } = useTranslation();
  const { network } = useNetwork();
  const { pathname } = useLocation();
  const { setContainerRefs } = useUi();
  const activeAccount = useAccount();

  // References to outer container.
  const mainInterfaceRef = useRef<HTMLDivElement>(null);

  // Scroll to top of the window on every page change or network change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, network]);

  // Set container references to UI context and make available throughout app.
  useEffect(() => {
    setContainerRefs({
      mainInterface: mainInterfaceRef,
    });
  }, []);

  useEffect(() => {
    if (activeAccount.isConnected && activeAccount.address) {
      NotificationsController.emit({
        title: t('accountConnected', { ns: 'library' }),
        subtitle: `${t('connectedTo', { ns: 'library' })} ${activeAccount.address}.`,
      });
    }
  }, [activeAccount.isConnected, activeAccount.address]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackApp}>
      {/* Notification popups */}
      <Notifications />

      <Body>
        {/* Help: closed by default */}
        <Help />

        {/* Overlays: modal and canvas. Closed by default */}
        <Overlays />

        {/* Menu: closed by default */}
        <Menu />

        {/* Tooltip: invisible by default */}
        <Tooltip />

        {/* Prompt: closed by default */}
        <Prompt />

        {/* Left side menu */}
        <SideMenu />

        {/* Main content window */}
        <Main ref={mainInterfaceRef}>
          {/* Fixed headers */}
          <Headers />

          {/* Isolate route errors to `Main` container */}
          <ErrorBoundary FallbackComponent={ErrorFallbackRoutes}>
            <Routes>
              {/* App page routes */}
              {PagesConfig.map((page, i) => (
                <Route
                  key={`main_interface_page_${i}`}
                  path={page.hash}
                  element={<Page page={page} />}
                />
              ))}

              {/* Default route to overview */}
              <Route
                key="main_interface_navigate"
                path="*"
                element={<Navigate to="/overview" />}
              />
            </Routes>
          </ErrorBoundary>
        </Main>
      </Body>

      {/* Network status and network details */}
      <NetworkBar />

      {/* Offline status label */}
      <Offline />
    </ErrorBoundary>
  );
};

export const Router = () => (
  <HashRouter basename="/">
    <RouterInner />
  </HashRouter>
);

import React from 'react';
import { render } from 'react-dom';

import {
  FieldExtensionSDK,
  init,
  locations,
} from '@contentful/app-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import '@contentful/forma-36-tokens/dist/css/index.css';
import './index.css';

import Field from './components/Field';
import FilteredReferencesDialog from "./components/FilteredReferencesDialog";

// @ts-ignore
function renderDialog(sdk) {
  const { invocation: otherProps } = sdk.parameters;
  const container = document.createElement('div');
  const CONTAINER_ID = 'category-selector-dialog';

  container.id = CONTAINER_ID;
  document.body.appendChild(container);

  render(
    <FilteredReferencesDialog
      sdk={sdk}
      onSave={(data: any) => sdk.close(data)}
      onClose={() => sdk.close()}
      {...otherProps}
    />,
    document.getElementById(CONTAINER_ID)
  );
}

init((sdk) => {
  const root = document.getElementById('root');

  // All possible locations for the app
  const ComponentLocationSettings = [
    {
      location: locations.LOCATION_ENTRY_FIELD,
      component: <Field sdk={sdk as FieldExtensionSDK} />,
    }
  ];

  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    renderDialog(sdk)
  } else {
    // Select a component depending on a location in which the app is rendered.
    ComponentLocationSettings.forEach((componentLocationSetting) => {
      if (sdk.location.is(componentLocationSetting.location)) {
        render(componentLocationSetting.component, root);
      }
    });
  }
});

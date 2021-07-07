import React from 'react';
import '@contentful/forma-36-react-components/dist/styles.css';
import { MultipleEntryReferenceEditor, CombinedLinkActions } from '@contentful/field-editor-reference';

async function openDialog(sdk) {
  return await sdk.dialogs.openCurrentApp({
    isShown: false,
    position: 'center',
    title: 'Select one or more categories',
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    width: 800,
    minHeight: '80vh',
    allowHeightOverflow: false
  });
}

const FilteredMultipleEntryReferenceEditor = ({sdk}) => {
  return (
    <MultipleEntryReferenceEditor
      viewType="link"
      sdk={sdk}
      isInitiallyDisabled={false}
      hasCardEditActions={true}
      renderCustomActions={props => {
        return (
          <CombinedLinkActions
            {...props}
            onLinkExisting={index => {
              openDialog(sdk)
                .then((result) => {
                  return props.onLinkedExisting(result || [], index);
                })
            }}
          />
        )
      }}
      parameters={{
        instance: {
          showCreateEntityAction: true,
          showLinkEntityAction: true
        }
      }}
    />
  );
}

const Field = (props) => {
  React.useEffect(() => {
    props.sdk.window.startAutoResizer();
  }, [props.sdk.window])

  return <FilteredMultipleEntryReferenceEditor sdk={props.sdk} />
};

export default Field;

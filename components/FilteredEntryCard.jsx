import React from 'react'
import { EntryCard } from '@contentful/forma-36-react-components'
import { entityHelpers } from '@contentful/field-editor-shared'

const { getEntryTitle, getEntityDescription, getEntryStatus } = entityHelpers;

const FilteredEntryCard = ({ entry, onClick, isVisible, ...props }) => {
  const [selected, setSelected] = React.useState(false)
  const contentType = props.sdk.space
    .getCachedContentTypes()
    .find((contentType) => contentType.sys.id === entry.sys.contentType.sys.id);

  const status = getEntryStatus(entry.sys);
  const title = getEntryTitle({
    entry: entry,
    contentType,
    localeCode: props.localeCode,
    defaultLocaleCode: props.defaultLocaleCode,
    defaultTitle: 'Untitled',
  });
  const description = getEntityDescription({
    entity: entry,
    contentType,
    localeCode: props.localeCode,
    defaultLocaleCode: props.defaultLocaleCode,
  });

  const myOnClick = () => {
    const toggled = !selected
    setSelected(toggled)
    onClick(entry, toggled)
  }

  if (!isVisible) {
    return null
  }

  return (
    <EntryCard className='entry-card'
               title={title}
               contentType={contentType.name}
               description={description}
               status={status}
               size='auto'
               selected={selected}
               onClick={myOnClick}
    />
  )
}

export default FilteredEntryCard

import React from 'react'
import { Button, Modal, TextInput, Paragraph } from '@contentful/forma-36-react-components'
import FilteredEntryCard from './FilteredEntryCard'

async function getFilteredPageEntries (sdk) {
  const results = await sdk.space.getEntries({
    content_type: 'page',
    order: 'fields.title',
    limit: 1000,
    'fields.content.sys.contentType.sys.id': 'category',
    'fields.content.fields.internalTitle[exists]': true,
  })
  return results.items
}

const FilteredReferencesDialog = (props) => {
  const [items, setItems] = React.useState([])
  const [selectedItems, setSelectedItems] = React.useState({})
  const [searchTerm, setSearchTerm] = React.useState('')
  const { sdk } = props

  React.useEffect(() => {
    sdk.window.startAutoResizer()

    getFilteredPageEntries(sdk).then(savedData => {
      setItems(savedData)
    })
  }, [sdk, sdk.window])


  const onClick = (entry, selected) => {
    if (selected) {
      setSelectedItems({
        ...selectedItems,
        [entry.sys.id]: entry
      })
    } else {
      setSelectedItems({
        ...selectedItems,
        [entry.sys.id]: null
      })
    }
  }

  const handleSearch = (event) => {
    const candidateSearchTerm = event.target.value.toLowerCase()
    setSearchTerm(candidateSearchTerm.length > 2 ? candidateSearchTerm : '')
  }

  const isVisible = (item) => {
    const title = item.fields?.title?.['en-US'] || ''
    return title.toLowerCase().includes(searchTerm)
  }

  const transformSelectedItems = () => {
    return Object.values(selectedItems).filter(value => value)
  }

  const entriesCount = transformSelectedItems().length

  return (
    <React.Fragment>
      <Modal.Content className='filteredModalContent'>
        <Paragraph className='f36-margin-top--s'>Search for an entry:</Paragraph>
        <TextInput
          name='searchFilter'
          placeholder='Type to search for entries'
          className='f36-margin-bottom--m'
          value={searchTerm}
          onChange={(event) => handleSearch(event)}
        />
          {items.map(item => {
            return <FilteredEntryCard
              key={item.sys.id}
              entry={item}
              onClick={onClick}
              isVisible={isVisible(item)}
              {...props }
            />
          })}
      </Modal.Content>
      <Modal.Controls>
        <Button
          buttonType="positive"
          disabled={entriesCount === 0}
          onClick={() => {props.onSave(transformSelectedItems())}}>
          {`Select ${entriesCount === 0 ? '': entriesCount} entr${entriesCount === 1 ? 'y': 'ies'}`}
        </Button>
        <Button buttonType="muted" onClick={() => {props.onClose()}}>
          Cancel
        </Button>
      </Modal.Controls>
    </React.Fragment>
  )
}

export default FilteredReferencesDialog

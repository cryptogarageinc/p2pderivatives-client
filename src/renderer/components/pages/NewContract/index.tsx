import React, { FC, useState, useEffect } from 'react'

import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
  useDispatch,
} from 'react-redux'

import NewContractTemplate from '../../templates/NewContractTemplate'
import { ApplicationState } from '../../../store'
import { userListRequest } from '../../../store/user/actions'
import FileIPC from '../../../ipc/FileIPC'
import { Outcome } from '../../../../common/models/dlc/Outcome'
import { merge } from '../../../util/outcome-merger'
import { push } from 'connected-react-router'
import { offerRequest } from '../../../store/dlc/actions'
import { Contract } from '../../../../common/models/dlc/Contract'

const { dialog } = window.require('electron').remote

const useSelector: TypedUseSelectorHook<ApplicationState> = useReduxSelector

const NewContractPage: FC = () => {
  const dispatch = useDispatch()

  const [tab, setTab] = useState(0)
  const userList = useSelector(state => state.user.userList)
  const selectedContract = useSelector(state => state.dlc.selectedContract)
  const [actualOutcomes, setActualOutcomes] = useState<Outcome[]>(
    selectedContract ? [...selectedContract.outcomes] : []
  )
  const [outcomesList, setOutcomesList] = useState<Outcome[]>(
    selectedContract ? merge([...selectedContract.outcomes]) : []
  )

  const handleCSVImport = (): void => {
    dialog.showOpenDialog({ properties: ['openFile'] }).then(async files => {
      if (files !== undefined) {
        const filepath = files.filePaths[0]
        const parsedOutcomes = await new FileIPC().parseOutcomes(filepath)
        const outcomes = merge(parsedOutcomes)
        setActualOutcomes(parsedOutcomes)
        setOutcomesList(outcomes)
        setTab(1)
      }
    })
  }

  const handlePublish = (contract: Contract): void => {
    const contractWithActualOutcomes = {
      ...contract,
      outcomes: actualOutcomes,
    }
    dispatch(offerRequest(contractWithActualOutcomes))
    dispatch(push('/main'))
  }

  const handleCancel = (): void => {
    dispatch(push('/main'))
  }

  useEffect(() => {
    dispatch(userListRequest())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
      <NewContractTemplate
        onCSVImport={handleCSVImport}
        data={outcomesList}
        users={userList}
        tab={tab}
        onTabChange={(index): void => setTab(index)}
        onPublish={handlePublish}
        onCancel={handleCancel}
        contract={selectedContract}
      />
    </div>
  )
}

export default NewContractPage

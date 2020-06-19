import React, { FC, useEffect } from 'react'
import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
  useDispatch,
} from 'react-redux'
import { ApplicationState } from '../../../store'

import ContractDetailTemplate from '../../templates/ContractDetailTemplate'
import { push } from 'connected-react-router'
import { RouteChildrenProps } from 'react-router'
import { ContractState } from '../../../../common/models/dlc/ContractState'
import { acceptRequest, rejectRequest } from '../../../store/dlc/actions'

const useSelector: TypedUseSelectorHook<ApplicationState> = useReduxSelector

const ContractDetailPage: FC<RouteChildrenProps<{ id: string }>> = (
  props: RouteChildrenProps<{ id: string }>
) => {
  const dispatch = useDispatch()
  const contract = useSelector(state => state.dlc.selectedContract)
  // const username = useSelector(state => state.login.username)

  useEffect(() => {
    if (!contract) {
      dispatch(push('/main'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract])

  const handleAccept = (): void => {
    if (contract) dispatch(acceptRequest(contract.id!))
    dispatch(push('/main'))
  }

  const handleReject = (): void => {
    if (contract) dispatch(rejectRequest(contract.id!))
    dispatch(push('/main'))
  }

  const handleCancel = (): void => {
    dispatch(push('/main'))
  }

  return (
    <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
      {contract !== undefined && (
        <ContractDetailTemplate
          data={contract}
          isProposal={
            contract.state === ContractState.Offered && !contract.isLocalParty
          }
          acceptContract={handleAccept}
          rejectContract={handleReject}
          cancel={handleCancel}
        />
      )}
    </div>
  )
}

export default ContractDetailPage

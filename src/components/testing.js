import React from 'react'

// import { test, test2 } from '~/actions'

export default class Testing extends React.Component {
	handleClick = () => {
		// test()
	}
  test2Click = () => {
    // test2()
  }
	render() {
		return <div>
			<button onClick={this.handleClick}>4444</button>
      <button onClick={this.test2Click}>Test2</button>
		</div>
	}
}
/*
export function doSwitchActiveTab(tabId) {
  return async (dispatch, getState, {api}) => {
	  dispatch({
		  action: 'WHICH_REDUCER_SHOULD_THIS_ACTION_GO_TO',
		  payload: 'What payload or data should the store need to change'
	  })

	  var someData = getState().what_data_do_you_need_to_do_the_next_action


	  dispatch({
		  action: 'SECOND_REDUCER_THAT_NEEDS_TO_BE_INVOKED',
		  data: someData
	  })


	  ///...continue this pattern.  do not call other actions, it is ^OK^ to duplicate dispatches here.

	  /*


    try {
      dispatch(switchActiveTab(tabId));
      const stateNavigation = getState().pageLoadData.navigation;
      const globalStart = getState().pageLoadData.globalStartDate;
      const globalEnd = getState().pageLoadData.globalEndDate;
      // Loop through the current states navigation and check to see if the global date has changed
      for (let i = 0; i < stateNavigation.length; i++) {
        if (stateNavigation[i].active) {
          if (stateNavigation[i].startDate !== globalStart || stateNavigation[i].endDate !== globalEnd) {
            dispatch(markNavLoadingAction(true));
            const storedFilters = stateNavigation[i].activeFilters;
            const currentReport = getState().pageLoadData.activeReport;
            const storedDates = {
              startDate: globalStart,
              endDate: globalEnd,
            };
            const selectedFilterData = await api.getSelectedFilterData(storedFilters, currentReport, storedDates);
            const updatedData = {
              data: selectedFilterData,
              date: storedDates,
            };
            dispatch(updateSwitchedTabData(updatedData));
            dispatch(markNavLoadingAction(false));
          }
        }
      }
    } catch (error) {
      dispatch(errorAction(error.message));
    }


  };
}

store: {
	stuff: {
		foo: {
			area1: 'we need to change this'
		},
	}
	blah: {
		area2: 'also change this when area1 changes'
	}
}


'NAME_THIS_ACTION_WHATEVER':
	var state = clone(state)
	var area1 = state.foo.area1
	state.blah.area2 = area1
	return state;


*/
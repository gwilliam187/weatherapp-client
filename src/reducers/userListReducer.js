import { INITIALISE_USERS } from '../actions/actionTypes';

export default(state=[], action) => {
	if	(action.type===INITIALISE_USERS)
		return action.payload;

	return state;
};
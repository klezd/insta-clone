const initialState = { value: 0 };

function reducer(state = initialState, action) {
	const { type } = action;

	switch (type) {
		case 'ANy':
		default:
			return {
				...state
			};
	}
}

export default reducer;

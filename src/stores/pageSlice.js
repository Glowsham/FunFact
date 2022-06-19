import { createSlice } from '@reduxjs/toolkit';

import toast from 'react-hot-toast';

export const pageSlice = createSlice({
	name: 'menu',
	initialState: {},
	reducers: {
		loading: (state, action) => {
			state.status = state.items ? 1 : 0;
			state.type =
				action.payload[1] !== ''
					? action.payload[1] + 'Details'
					: 'home';
			state.selected = null;
			state.learner = [];
			if (!state.items || state.items.length !== 0) {
				state.element = {};
				state.items = [];
			}
		},
		loaded: (state, action) => {
			if (state.type === 'notionDetails') {
				const colors = [
					'#ff99c8',
					'#fcf6bd',
					'#d0f4de',
					'#a9def9',
					'#e4c1f9'
				];
				action.payload.items.forEach((el, index) => {
					action.payload.items[index].color =
						colors[
							Math.floor(
								Math.random() *
									colors.length
							)
						];
					action.payload.items[
						index
					].full = false;
				});
			}
			return {
				status: 2,
				type: state.type,
				learner: state.learner,
				...action.payload
			};
		},
		newElement: (state, action) => {
			state.status = 1;
			state.element = action.payload;
			state.items = [];
		},
		organizeStart: (state) => {
			state.status = 3;
		},
		itemsMove: (state, action) => {
			var item = state.items[action.payload.oldIndex];
			state.items.splice(action.payload.oldIndex, 1);
			state.items.splice(action.payload.newIndex, 0, item);
		},
		organizeEnd: (state) => {
			state.status = 2;
		},
		cardToggle: (state, action) => {
			state.items[
				state.items.findIndex(
					(el) => el.id === action.payload.id
				)
			].full = !action.payload.full;
		},
		menuOpen: (state, action) => {
			state.selected = action.payload;
		},
		menuClose: (state) => {
			state.selected = null;
		},
		learnChange: (state) => {
			state.status = state.status === 2 ? 4 : 2;
		},
		addLearnerCard: (state, action) => {
			// here: do something to add new card
			for (var i = 0; i < action.payload; i++) {
				state.learner.push(
					state.items[
						Math.floor(
							Math.random() *
								state.items
									.length
						)
					]
				);
			}
		},
		newItem: (state, action) => {
			if (state.type === 'notionDetails') {
				const colors = [
					'#ff99c8',
					'#fcf6bd',
					'#d0f4de',
					'#a9def9',
					'#e4c1f9'
				];
				action.payload.color =
					colors[
						Math.floor(
							Math.random() *
								colors.length
						)
					];
			}
			state.items.unshift(action.payload);
		},
		itemUpdate: (state, action) => {
			state.items = state.items.map((i) =>
				i.id === action.payload.id
					? { ...i, ...action.payload }
					: i
			);
		},
		itemRemove: (state, action) => {
			state.items.splice(
				state.items.findIndex(
					(i) => i.id === action.payload
				),
				1
			);
			if (state.items.length === 0) state.status = 2;
		}
	}
});

export const {
	loading,
	loaded,
	newElement,
	organizeStart,
	itemsMove,
	organizeEnd,
	cardToggle,
	menuOpen,
	menuClose,
	learnChange,
	addLearnerCard,
	newItem,
	itemUpdate,
	itemRemove
} = pageSlice.actions;
export default pageSlice.reducer;

function apiRequest({ page, pageType, params, method, body }) {
	return new Promise(async (resolve) => {
		if (!localStorage.getItem('token')) {
			var token;
			var retry = false;

			while (!token) {
				var password = prompt(
					retry
						? `Incorrect password! Please retry:`
						: `Welcome to the Fun Fact app! Please enter the password to continue:`
				);

				var res = await fetch(
					'https://funfact-api.herokuapp.com/api/login',
					{
						method: 'POST',
						headers: {
							'Content-Type':
								'application/json'
						},
						body: JSON.stringify({
							password
						})
					}
				);

				if (res.status === 200) {
					var resBody = await res.text();
					token = JSON.parse(resBody).token;
				} else {
					retry = true;
				}
			}

			localStorage.setItem('token', token);
		}

		const options = body
			? {
					method,
					headers: {
						'Content-Type':
							'application/json',
						Authorization: localStorage.getItem(
							'token'
						)
					},
					body: JSON.stringify(body)
			  }
			: {
					method,
					headers: {
						Authorization: localStorage.getItem(
							'token'
						)
					}
			  };

		fetch(
			'https://funfact-api.herokuapp.com/api/' +
				page +
				'/' +
				pageType +
				(params ? '/' + params : ''),
			options
		).then((res) => {
			res.text().then((body) => {
				var { message, ...bodyData } = JSON.parse(body);
				if (message)
					toast(
						(res.status === 200
							? '✨ '
							: '❌ ') + message
					);
				// console.log(message);
				resolve(bodyData);
			});
		});
	});
}

export function pageOpen(pageRequest) {
	return async (dispatch) => {
		dispatch(loading(pageRequest));

		apiRequest({
			page: 'fetch',
			pageType:
				pageRequest[1] !== ''
					? pageRequest[1] + 'Details'
					: 'home',
			params: pageRequest[2],
			method: 'GET'
		}).then((body) => {
			dispatch(loaded(body));
		});

		// var response = await fakeRequest(pageRequest);
		// dispatch(loaded(response));
	};
}

export function pageAppend(element, history) {
	return async (dispatch, getState) => {
		history.push(
			getState().page.type === 'home'
				? '/subj/' + element.id
				: '/notion/' + element.id
		);
		dispatch(newElement(element));
	};
}

export function createNewItem() {
	return async (dispatch, getState) => {
		var body;
		if (getState().page.type !== 'notionDetails') {
			var title = prompt('Give a title to the new item:');
			body = { title };
		} else {
			var short = prompt('Give a short title to the note:');
			var full = prompt('And now a full one:');
			body = {
				short: '# ' + short + '\n(short content)',
				full: '# ' + full + '\n(full content)'
			};
		}
		if (!title && !short && !full) return;

		apiRequest({
			page: 'create',
			pageType: getState().page.type,
			params: getState().page.element
				? getState().page.element.id
				: null,
			method: 'POST',
			body
		}).then((body) => dispatch(newItem(body.item)));
	};
}

export function editItem(body) {
	return async (dispatch, getState) => {
		if (!body) {
			var title = prompt(
				'Give a new title to the folder:',
				getState().page.selected.title
			);
			if (!title) return;
			body = { title };
		}

		apiRequest({
			page: 'edit',
			pageType: getState().page.type,
			params: getState().page.selected.id,
			method: 'PUT',
			body
		}).then((resbody) => {
			if (!body) dispatch(menuOpen(resbody.item));
			dispatch(itemUpdate(resbody.item));
		});
	};
}

export function moveItem() {
	return async (dispatch, getState) => {
		var title = prompt(
			'Enter the name of the collection you want the item to be in:'
		);
		if (!title) return;

		apiRequest({
			page: 'move',
			pageType: getState().page.type,
			params: getState().page.selected.id,
			method: 'PATCH',
			body: { newElement: title }
		}).then((body) => {
			if (body.item) dispatch(itemRemove(body.item.id));
		});
	};
}

export function organizeItem(id, newPosition) {
	return async (dispatch, getState) => {
		apiRequest({
			page: 'organize',
			pageType: getState().page.type,
			params: id,
			method: 'PATCH',
			body: { newPosition }
		});
		dispatch(
			itemsMove({
				oldIndex: getState().page.items.findIndex(
					(el) => el.id === id
				),
				newIndex: newPosition
			})
		);
	};
}

export function deleteItem() {
	return async (dispatch, getState) => {
		if (
			window.confirm(
				'Are you sure you want to delete this item?'
			)
		) {
			apiRequest({
				page: 'delete',
				pageType: getState().page.type,
				params: getState().page.selected.id,
				method: 'DELETE'
			}).then(() => {
				dispatch(
					itemRemove(getState().page.selected.id)
				);
				dispatch(menuClose());
			});
		}
	};
}

export function learnToggle() {
	return async (dispatch, getState) => {
		if (getState().page.learner.length === 0) {
			dispatch(addLearnerCard(3));
		}
		dispatch(learnChange());
	};
}

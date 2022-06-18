import { useDispatch } from 'react-redux';
import { editItem, moveItem, deleteItem } from '../../stores/pageSlice';

import FolderItem from '../items/FolderItem';
import EditIcon from '@material-ui/icons/EditOutlined';
import SwapIcon from '@material-ui/icons/SwapHorizOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import '../../styles/FolderEditor.css';

function FolderEditor({ item }) {
	const dispatch = useDispatch();

	return (
		<>
			<FolderItem item={item} />
			<div
				className="menuAction mt-3 px-3"
				onClick={() => dispatch(editItem())}
			>
				<EditIcon className="ms-1 me-3" />
				<span>Rename</span>
			</div>
			<div
				className="menuAction px-3"
				onClick={() => dispatch(moveItem())}
			>
				<SwapIcon className="ms-1 me-3" />
				<span>Move</span>
			</div>
			<div
				className="menuAction px-3"
				onClick={() => dispatch(deleteItem())}
			>
				<DeleteIcon className="ms-1 me-3" />
				<span>Delete</span>
			</div>
		</>
	);
}

export default FolderEditor;

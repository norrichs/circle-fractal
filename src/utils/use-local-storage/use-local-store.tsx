import { useState } from "react";
import { uuid } from "uuidv4";
import styled from "styled-components";

export const useLocalStore = () => {

  const getKeyArray = () => {
    return Object.keys(window.localStorage).map((key) => {
			const itemString = window.localStorage.getItem(key);
			const itemJSON = JSON.parse(itemString || "");
			return itemJSON?.name
				? { name: itemJSON.name, id: key }
				: { name: "", id: key };
		})
  }

  let defaultKeyArray;
  try {
    defaultKeyArray = getKeyArray();
  } catch {
    defaultKeyArray = [{id: "", name: "" }]
  }


	const [keyArray, setKeyArray] = useState<{ id: string; name: string }[]>(defaultKeyArray);

  const refreshKeyArray = () => setKeyArray(getKeyArray())

	const pushItem = (newValue: Object, name?: string) => {
		console.debug("pushing", newValue);
		// const uniqueId = uuid();
		const uniqueId = Math.floor(Math.random() * 1000000000000).toString();
		console.debug(uniqueId);
		const newValueString = JSON.stringify({
			name: name || "untitled",
			data: newValue,
		});
		window.localStorage.setItem(uniqueId, newValueString);
		console.debug("currentKeys", Object.keys(window.localStorage));
		refreshKeyArray();
	};

	const removeItem = (id: string) => {};

	const clearStore = () => {
		window.localStorage.clear();
		refreshKeyArray();
		console.debug("cleared");
	};

	const renameItem = (id: string, name: string) => {
		const prevState = JSON.parse(window.localStorage.getItem(id)!);
    console.debug("rename Item prevState", prevState)
		window.localStorage.setItem(id, JSON.stringify({ ...prevState, name: name }));
    refreshKeyArray()
	};

	const getItem = (id: string) => {
		console.debug("retrieving", id);
		const item = window.localStorage.getItem(id);
		return item ? JSON.parse(item) : "nothing in storage";
	};

	return { keyArray, pushItem, removeItem, getItem, clearStore, renameItem };
};

const StyledRenamer = styled.div<{show: boolean}>`
  display: ${({show}) => show ? "flex" : "none"};
  flex-direction: column;
`

export const Renamer = ({
	editingId,
	onSubmit,
}: { editingId: string | null; onSubmit: (name: string) => void }) => {
	const [name, setName] = useState<string>("");
	return (
		<StyledRenamer show={!!editingId}>
			<header>Rename</header>
			<input type="text" placeholder="Name this..." value={name} onChange={(e) => setName(e.target.value)}/>
      <button type="button" onClick={() => onSubmit(name)}>Ok</button>
		</StyledRenamer>
	);
};

import React, { useState, Dispatch } from "react";
import styled from "styled-components";
import { useLocalStorageMulti } from "../../../../utils/use-local-storage/use-local-storage-multi";
import { CircleFractalConfig, defaultConfig } from "../../lib/generate-circles";
import { CFAction } from "../../lib/use-circle-fractal";
import { CompoundControl, CompoundControlAction } from "../circle-fractal-control/compound-control";
import { useLocalStore, Renamer } from "../../../../utils/use-local-storage/use-local-store";

const StorageSection = styled.section<{show: boolean}>`
  display: ${({show}) => show ? "flex" : "none"};
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
`

const ShowButton = styled.button<{ show: boolean }>`
  display: ${({show}) => show ? "block" : "none"};
  position: absolute;
  top: 0;
  right: 0;
`
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;

`

export const StoredConfigs = ({
	currentCircleConfig,
  circleDispatch,
	currentCompoundConfig,
  compoundDispatch,
}: {
	circleDispatch: Dispatch<CFAction>;
  compoundDispatch: Dispatch<CompoundControlAction>
	currentCircleConfig: CircleFractalConfig;
	currentCompoundConfig: CompoundControl[];
}) => {
  const defaultCompoundConfig: CompoundControl[] = []
	const [storedValue, storedValueKeys, setValue] = useLocalStorageMulti(
		"storedConfig", { circleConfig: defaultConfig, compoundConfig: defaultCompoundConfig },
	);
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showStorage, setShowStorage] = useState(false)
  const localStore = useLocalStore();



  return (
    <>
      <ShowButton show={!showStorage } type="button" onClick={() => setShowStorage(true)}>Stored</ShowButton>
      <StorageSection show={showStorage}>
        <ButtonGroup>
          <button
            type="button" 
            onClick={() => localStore.pushItem({ circleConfig: currentCircleConfig, compoundConfig: currentCompoundConfig })}
          >
            Store
          </button>
          <button type="button" onClick={localStore.clearStore}>Clear</button>
          <button type="button" onClick={() => setShowStorage(false) }>Hide</button>

        </ButtonGroup>
      <Renamer editingId={editingId} onSubmit={(name: string) => {
          console.debug("renaming", editingId, name)
          localStore.renameItem(editingId!, name)
          setEditingId(null)
        }}
      />
      <ul>
        {localStore.keyArray.map((storageKey) => (
          <li key={storageKey.id}>
            <span>{storageKey.name}</span>
            <button type="button" onClick={() => {
                const storedConfigs = localStore.getItem(storageKey.id)
                circleDispatch({ type: "config", payload: storedConfigs.data.circleConfig })
                compoundDispatch({ type: "config", newConfig: storedConfigs.data.compoundConfig})
              }}
            >
              Get
            </button>
            <button type="button" onClick={() => setEditingId(storageKey.id)}>Rename</button>
          </li>
        ))}
      </ul>
      
    </StorageSection>
    </>
  )
};

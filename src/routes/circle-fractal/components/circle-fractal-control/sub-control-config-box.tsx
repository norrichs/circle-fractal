import { Dispatch, useState } from "react"
import styled from "styled-components"
import { compoundableParamRanges, CompoundControlAction, CompoundConfig, compoundColors, CompoundableParams } from "./compound-control";
import { NumberRangeInput } from "./number-range-input";
import { Select } from "./circle-fractal-control";


export const ConfigBox = styled.div<{ show: boolean; controlId: number }>`
  position: absolute;
  top: 0;
  right: 0;
  display: ${({ show }) => (show ? "grid" : "none")};
  gap: 5px;
  padding: 0;
  background-color: gray;
  border-radius: 3px;
  border: none;
  box-shadow: 0 0 10px 0px black;

  & header {
    position: relative;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: ${({ controlId }) =>
			controlId >= 0
				? compoundColors[controlId % compoundColors.length].background
				: "none"};
  }
  & header > button {
    padding: 4px 8px;
    margin: 0;
    background-color: transparent;
    color: black;
  }

  & > div {
    padding: 10px;
  }
`;

export const SubControlConfigBox = ({
	controlId,
  controlIds,
  paramKey,
  getSubControlConfig,
  subControlConfig,
	subControlDispatch,
  close,
}: {
	controlId: number;
  controlIds: number[];
  paramKey: CompoundableParams;
  getSubControlConfig: (compoundControlId: number, paramKey: CompoundableParams) => CompoundConfig | null;
  subControlConfig: CompoundConfig | null;
	subControlDispatch: Dispatch<CompoundControlAction>;
  close: () => void;
}) => {
  const [showSelect, setShowSelect] = useState(false)

	return (
    <>
      <header>
        <button type="button" onClick={() => setShowSelect(!showSelect)}>{controlId}</button>

        <button type="button" onClick={() => {
          setShowSelect(false)
          close()
          }}
        >
          X
        </button>
        <Select show={showSelect}>
          {controlIds.length > 1 && controlIds.map(destControlId => (
            <button key={destControlId} type="button" onClick={() => {
              setShowSelect(false)
              close()
              subControlDispatch({
                type: "moveSubControl", 
                payload: {currentControlId: controlId, newControlId: destControlId, currentSubControlId: subControlConfig?.id!}
              })}}
            >
              {destControlId}
            </button>
          ))}
          <button type="button" onClick={() => {
            setShowSelect(false)
            close()            
            subControlDispatch({
              type: "moveSubControlToNew", 
              payload: {currentControlId: controlId, currentSubControlId: subControlConfig?.id!}
            })}}
          >
            New
          </button>
          <button type="button" onClick={() => subControlDispatch({type: "remove", payload: {controlId, subControlId: subControlConfig?.id} })}>Delete</button>
        </Select>
      </header>
      {subControlConfig && (
        <div>
          <NumberRangeInput
            label="min"
            inputMin={compoundableParamRanges[subControlConfig.key].min}
            inputMax={compoundableParamRanges[subControlConfig.key].max}
            inputStep={1}
            inputValue={subControlConfig.min}
            onChangeFn={(e) =>
              {
                console.debug("dispatching configSubControl", controlId, subControlConfig.id, e.target.value)
                subControlDispatch({
                type: "configSubControl",
                payload: { controlId, subControlId: subControlConfig.id, min: Number(e.target.value) },
              })}
            }
          />
          <NumberRangeInput
            label="max"
            inputMin={compoundableParamRanges[subControlConfig.key].min}
            inputMax={compoundableParamRanges[subControlConfig.key].max}
            inputStep={1}
            inputValue={subControlConfig.max}
            onChangeFn={(e) =>
              subControlDispatch({
                type: "configSubControl",
                payload: { controlId, subControlId: subControlConfig.id, max: Number(e.target.value) },
              })
            }
          />
          <NumberRangeInput
            label="ratio"
            inputMin={compoundableParamRanges[subControlConfig.key].ratioMin}
            inputMax={compoundableParamRanges[subControlConfig.key].ratioMax}
            inputStep={0.1}
            inputValue={subControlConfig.ratio}
            onChangeFn={(e) =>
              subControlDispatch({
                type: "configSubControl",
                payload: { controlId, subControlId: subControlConfig.id, ratio: Number(e.target.value) },
              })
            }
          />
        </div>
      )}
    </>
    )
}

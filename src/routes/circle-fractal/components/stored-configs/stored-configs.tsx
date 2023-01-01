import React, { Dispatch } from "react";
import styled from "styled-components";
import { useLocalStorage } from "../../../../utils/use-local-storage/use-local-storage";
import { CircleFractalConfig, defaultConfig } from "../../lib/generate-circles";
import { CFAction } from "../../lib/use-circle-fractal";
import { CompoundControl, CompoundControlAction } from "../circle-fractal-control/compound-control";

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
	const [storedValue, setValue] = useLocalStorage(
		"storedConfig", { circleConfig: defaultConfig, compoundConfig: defaultCompoundConfig },
	);
	const handleStoreConfig = () => {
		console.debug("store", currentCircleConfig);
		setValue({ circleConfig: currentCircleConfig, compoundConfig: currentCompoundConfig })
	};

	const handleRetrieveConfig = () => {
		console.debug("retrieve", storedValue.compoundConfig);
		circleDispatch({ type: "config", payload: { ...storedValue.circleConfig } });
    compoundDispatch({type: "config", newConfig: [...storedValue.compoundConfig]});
	};

  return (
    <div>
				<button
					type="button"
					onClick={handleStoreConfig}
				>
					Store config
				</button>
				<button
					type="button"
					onClick={handleRetrieveConfig}
				>
					Retrieve config
				</button>
			</div>
  )
};

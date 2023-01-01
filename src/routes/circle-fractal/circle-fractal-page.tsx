import React, { Reducer, ReducerAction, useEffect, useReducer } from "react";
import styled from "styled-components";
import { useLocalStorage } from "../../utils/use-local-storage/use-local-storage";
import { CircleFractal } from "./components/circle-fractal";
import { CircleFractalControls } from "./components/circle-fractal-control/circle-fractal-control";
import {
	CircleFractalConfig,
	Alignment,
	defaultConfig,
	defaultLevelParam,
	RGBA,
} from "./lib/generate-circles";
import { useCircleFractal } from "./lib/use-circle-fractal";

const Container = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
	width: 100%;
`;

export const CircleFractalPage = () => {
	const { config, configDispatch } = useCircleFractal();
	const [ storedValue, setValue ] = useLocalStorage("storedConfig", defaultConfig );

	const handleStoreConfig = () => {
		console.debug("store", config)
		setValue(config)
	}

	const handleRetrieveConfig = () => {
		console.debug("retrieve", storedValue)
		configDispatch({type: "config", payload: {...storedValue}})
	}

	return (
		<Container>
			{config && <CircleFractal config={config} />}
			<CircleFractalControls circleConfig={config} dispatch={configDispatch} />
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

		</Container>
	);
};

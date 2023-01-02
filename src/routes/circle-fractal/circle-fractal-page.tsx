import React, { Reducer, ReducerAction, useEffect, useReducer } from "react";
import styled from "styled-components";
import { useLocalStorage } from "../../utils/use-local-storage/use-local-storage";
import { CircleFractal } from "./components/circle-fractal";
import { CircleFractalControls } from "./components/circle-fractal-control/circle-fractal-control";
import { StoredConfigs } from "./components/stored-configs/stored-configs";
import {
	CircleFractalConfig,
	Alignment,
	defaultConfig,
	defaultLevelParam,
	RGBA,
} from "./lib/generate-circles";
import { useCircleFractal } from "./lib/use-circle-fractal";
import { useCompoundControl } from "./components/circle-fractal-control/compound-control";

const Container = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
	width: 100%;
`;

export const CircleFractalPage = () => {
	const { config, configDispatch } = useCircleFractal();
	const { compoundControls, compoundConfigDispatch } = useCompoundControl();

	return (
		<Container>
			{config && <CircleFractal config={config} />}
			<CircleFractalControls 
				circleConfig={config} 
				circleDispatch={configDispatch}
				compoundControls={compoundControls}
				compoundConfigDispatch={compoundConfigDispatch}
			/>
			<StoredConfigs 
				circleDispatch={configDispatch} 
				compoundDispatch={compoundConfigDispatch}
				currentCircleConfig={config} 
				currentCompoundConfig={compoundControls} 
			/>
		</Container>
	);
};

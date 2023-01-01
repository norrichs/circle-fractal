import React, { Reducer, ReducerAction, useEffect, useReducer } from "react";
import styled from "styled-components";
import { CircleFractal } from "../components/circle-fractal";
import { CircleFractalControls } from "../components/circle-fractal-control/circle-fractal-control";
import { CircleFractalConfig, Alignment, defaultConfig, defaultLevelParam, RGBA, DrawMode } from "./generate-circles";

export type CFAction =
  | { type: "config"; payload: CircleFractalConfig}
	| { type: "r0"; payload: number }
	| { type: "alignment"; payload: {parent: Alignment; child: Alignment} }
  | { type: "drawMode"; payload: DrawMode }
  | { type: "removeLevel"; payload: number }
  | { type: "addLevel"; payload: number }
  | { type: "symmetry"; payload: { level: number; symmetry: number} }
  | { type: "width"; payload: { level: number; width: number}}
  | { type: "outerFill"; payload: { level: number; rgba: RGBA}}
  | { type: "innerFill"; payload: { level: number; rgba: RGBA }}
  | { type: "angle"; payload: { level: number; angle: number }}
  | { type: "visible"; payload: { level: number; visible: boolean }}

  const configReducer = (
  prevState: CircleFractalConfig,
  action: CFAction,
): CircleFractalConfig => {
  switch (action.type) {
    case "config":
      return { ...prevState, ...action.payload }
    case "r0":
      return { ...prevState, r0: action.payload };
    case "alignment":
      return { ...prevState, alignment: action.payload}
    case "drawMode":
      return { ...prevState, drawMode: action.payload}
    case "symmetry":
      // newLevelParams.splice(action.payload.level, 1, {...newLevelParams[action.payload.level], symmetry: action.payload.symmetry})
      return {...prevState, levelParams: [
        ...prevState.levelParams.slice(0,action.payload.level),
        {...prevState.levelParams[action.payload.level], symmetry: action.payload.symmetry},
        ...prevState.levelParams.slice(action.payload.level + 1)
      ]}
    case "removeLevel":
      return {...prevState, levelParams: [...prevState.levelParams.slice(0,action.payload), ...prevState.levelParams.slice(action.payload + 1)]}
    case "addLevel":
      return {...prevState, levelParams: [...prevState.levelParams.slice(0,action.payload), defaultLevelParam, ...prevState.levelParams.slice(action.payload)]}
    case "width":
      return {...prevState, levelParams: [
        ...prevState.levelParams.slice(0, action.payload.level),
        {...prevState.levelParams[action.payload.level], width: action.payload.width},
        ...prevState.levelParams.slice(action.payload.level + 1)
      ]}
    case "outerFill":
      return {...prevState, levelParams: [
        ...prevState.levelParams.slice(0, action.payload.level),
        { ...prevState.levelParams[action.payload.level], outerFill: action.payload.rgba },
        ...prevState.levelParams.slice(action.payload.level + 1)
      ]}
      case "innerFill":
        return {...prevState, levelParams: [
          ...prevState.levelParams.slice(0, action.payload.level),
          { ...prevState.levelParams[action.payload.level], innerFill: action.payload.rgba },
          ...prevState.levelParams.slice(action.payload.level + 1)
        ]}
    case "visible":
      return {...prevState, levelParams: [
        ...prevState.levelParams.slice(0, action.payload.level),
        {...prevState.levelParams[action.payload.level], visible: action.payload.visible},
        ...prevState.levelParams.slice(action.payload.level + 1)
      ]}
      case "angle":
        return {...prevState, levelParams: [
          ...prevState.levelParams.slice(0, action.payload.level),
          {...prevState.levelParams[action.payload.level], angle: action.payload.angle},
          ...prevState.levelParams.slice(action.payload.level + 1)
        ]}
    default:
      return prevState
  }
};

export const useCircleFractal = () => {
	const [config, configDispatch] = useReducer(
		configReducer,
		defaultConfig,
	);

  return {config, configDispatch}
}


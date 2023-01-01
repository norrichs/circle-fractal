// Pure function that takes a config and outputs an array of circle parameters

export interface CircleFractalConfig {
  r0: number;
  alignment: {
			parent: Alignment;
			child: Alignment;
		};
  drawMode: DrawMode;
  getWidth: (width: number, level?: number) => number;
  getColor: (fill: RGBA, level?: number) => RGBA;
  levelParams: LevelParam[];
}


export type DrawMode = "path" | "circle";
export type Alignment = "outer" | "inner" | "center";

export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
}


export interface LevelParam {
  symmetry: number;
  width: number;
  outerFill: RGBA;
  innerFill?: RGBA;
  angle: number;
  visible: boolean;
}

export interface Fill {
  outer: RGBA;
  inner?: RGBA;
}

export interface Circle {
  x: number;
  y: number;
  r: number,
  l: number,
  w: number,
  if?: RGBA,
  of: RGBA,
  a: number,
  v: boolean,
  children?: Circle[] | null;
}
export const defaultLevelParam: LevelParam =
  { symmetry: 2, width: 4, outerFill: {r: 0, g: 0, b: 0, a: 1},  angle: 0, visible: true, }

export const defaultConfig: CircleFractalConfig = {
  r0: 1000,
  alignment: {parent: "center", child: "center"},
  drawMode: "circle",
  getWidth: (width) => width,
  getColor: (fill) => fill,
  levelParams: [
    { symmetry: 1, width: 4, outerFill: {r: 0, g: 0, b: 0, a: 1}, angle: 0, visible: true, },
    { symmetry: 2, width: 4, outerFill: {r: 255, g: 0, b: 0, a: 1}, angle: 0, visible: true, },
    { symmetry: 3, width: 2, outerFill: {r: 0, g: 255, b: 0, a: 1}, angle: 0, visible: true, },
    { symmetry: 4, width: 2, outerFill: {r: 0, g: 0, b: 255, a: 1}, angle: 0, visible: true, },
  ],
};

export const generateCircles = (config: CircleFractalConfig) => {
  // console.log("generateCircles config", config)
  const {r0, levelParams, getWidth, getColor} = config;
  const levels = levelParams.length;
  
  // Init first circle
  const circles: Circle[] = [{
    x: 0,
    y: 0,
    r: r0,
    l: 0,
    w: getWidth(levelParams[0].width, 0),
    of: getColor(levelParams[0].outerFill, 0),
    if: levelParams[0].innerFill ? getColor(levelParams[0].innerFill) : undefined,
    a: levelParams[0].angle * Math.PI / 180,
    children: [],
    v: true,
  }]

  // generate nested circles object
  circles[0] = getCirclesRecursively({...circles[0]}, levels, config)

  // flatten object to array and return
  const flatCircles = flattened(circles[0])
  return flatCircles.filter(circle => circle.v).sort((a: Circle, b: Circle) => a.l - b.l)
  // return flatCircles
}

const defaultCircle: Circle = {x: 0, y: 0, r: 0, w: 1, l: 0, of: {r: 0, g: 0, b: 0, a: 1}, a: 0, v: true}

export const getRGBA = (color: RGBA) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`}

const getAlignment = (rawRadius: number,  level: number, config: CircleFractalConfig) => {
  const childAlignment = config.alignment.child
  const parentAlignment = config.alignment.parent
  const parent = config.levelParams[level - 1]
  const child = config.levelParams[level]

  let adjustedRadius = rawRadius
  if (childAlignment === "inner" && parentAlignment === "inner") {
    adjustedRadius = (rawRadius * 2 - parent.width / 2 + child.width / 2) / 2;
  } else if (childAlignment === "outer" && parentAlignment === "inner") {
    adjustedRadius = (rawRadius * 2 - parent.width / 2 - child.width / 2) / 2;
  }
  return adjustedRadius
}

const getCirclesRecursively = (parent: Circle, levels: number, config: CircleFractalConfig) => {
  const {getWidth, getColor, levelParams} = config;
  if (levels > 1) {
    const level = parent.l + 1;
    
    const angle = (2 * Math.PI) / levelParams[level].symmetry ;
    const rawRadius = parent.r / 2;
    const ringWidth = getWidth(levelParams[level].width, level)
        
    parent.children = new Array(levelParams[level].symmetry);
    parent.children.fill(defaultCircle);
    parent.children = parent.children.map((c, i) => {
      const adjustedRadius = getAlignment(rawRadius, level, config) 
      let childCircle: Circle = {
        x: parent.x + adjustedRadius * Math.sin(angle * i + parent.a + levelParams[level].angle * Math.PI / 180),
        y: parent.y + adjustedRadius * Math.cos(angle * i + parent.a + levelParams[level].angle * Math.PI / 180),
        r: adjustedRadius,
        l: level,
        w: ringWidth,
        of: getColor(levelParams[level].outerFill, level),
        if: levelParams[level].innerFill === undefined ? undefined : getColor(levelParams[level].innerFill!, level),
        a: angle * i + parent.a + levelParams[level].angle * Math.PI / 180,
        v: config.levelParams[level].visible,
        children: null,
      };
      // circles.push({ ...childParams });
      childCircle = getCirclesRecursively(childCircle, levels - 1, config);
      return childCircle;
    });
  }
  return parent;
}


const flattened = (obj: Circle): Circle[] => {
  let {children, ...rest} = obj
  const parent = {...rest}
  if (children && children.length > 0) {
    children = children.flatMap((child: Circle) => flattened(child))
    return [parent, ...children].flat()
  }
  return [parent]
}

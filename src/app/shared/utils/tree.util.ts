import { FrameworkLevelModel } from "../models/framework-level.model";
import { IndicatorModel } from "../models/indicator.model";

export function getTree(
  levels: FrameworkLevelModel[],
  indicators: IndicatorModel[]
): FrameworkLevelModel[] {
  const tree = [],
    mappedArr = {};
  let arrElem, mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for (let i = 0; i < levels.length; i++) {
    arrElem = levels[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]["children"] = [];
    mappedArr[arrElem.id]["indicators"] = [];
  }

  for (const id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      const filteredIndicators: IndicatorModel[] = indicators.filter(
        (i: IndicatorModel) => i.levelId === id
      );
      if (filteredIndicators) {
        mappedElem.indicators.push(...filteredIndicators);
      }
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.parentId) {
        mappedArr[mappedElem["parentId"]]["children"].push(mappedElem);
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
}

export function getProgress(frameworkLevel: FrameworkLevelModel): number {
  if(!frameworkLevel.children || !frameworkLevel.children.length) {
    return getLevelProgress(frameworkLevel);
  }
  let result: number = 0;
  frameworkLevel.children.forEach((child: FrameworkLevelModel) => {
    result += getProgress(child)/frameworkLevel.children.length;
  });
  return result;
}

export function getLevelProgress(frameworkLevel: FrameworkLevelModel): number {
  return frameworkLevel.indicators ? frameworkLevel.indicators.reduce((res, indicator) => {
    res += indicator.progress/frameworkLevel.indicators.length;
    return res;
  }, 0) : 0;
}

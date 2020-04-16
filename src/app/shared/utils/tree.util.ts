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
  }

  for (const id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      const indicator: IndicatorModel = indicators.find(
        (i: IndicatorModel) => i.levelId === id
      );
      if (indicator) {
        if (!mappedElem.indicators) {
          mappedElem.indicators = [];
        }
        mappedElem.indicators.push(indicator);
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

import { FrameworkLevelModel } from "../models/framework-level.model";

export function getTree(data: FrameworkLevelModel[]): FrameworkLevelModel[] {
  const tree = [],
    mappedArr = {};
  let arrElem, mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for (let i = 0; i < data.length; i++) {
    arrElem = data[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]["children"] = [];
  }

  for (const id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
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

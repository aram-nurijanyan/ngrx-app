import {IndicatorModel} from "./indicator.model";

export interface FrameworkLevelModel {
  id: string,
  name: string,
  level: number,
  description?: string
  children?: FrameworkLevelModel[],
  indicators?: IndicatorModel[],
  parentId?: string
}

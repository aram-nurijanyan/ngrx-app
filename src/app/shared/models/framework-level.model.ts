export interface FrameworkLevelModel {
  id: string,
  name: string,
  level: number,
  description?: string
  children?: FrameworkLevelModel[],
  parentId?: string
}

import { ICommonAttr } from './_common';

export interface IGroupMainAttr {
  name: string;
  note: string;
  groupLeaderId: number;
  groupFloorNumber: number;
}

export interface IGroupAttr extends IGroupMainAttr, ICommonAttr {}

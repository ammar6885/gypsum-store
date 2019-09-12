import { ISchema } from "validall/schema";

export interface IUpdateOptions {
  $set?: {[key: string]: any};
  $inc?: {[key: string]: string | number };
  $mul?: {[key: string]: string | number };
  $push?: {[key: string]: any};
  $unshift?: {[key: string]: any};
  $pop?: {[key: string]: number | string };
  $shift?: {[key: string]: number | string };
  $pull?: {[key: string]: string | number | boolean | ISchema};
  $splice?: {[key: string]: [number | string, number | string, any?] };
  $concat?: {[key: string]: string[] };
  $delete?: {[key: string]: any};
  $log?: {[key: string]: 0 | 1};
}
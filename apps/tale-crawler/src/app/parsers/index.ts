import { ParsedData } from "../crawlers/Common.crawler";

export interface IContentParser<T> {
  parse(data: string): ParsedData<T>;
}
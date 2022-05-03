export interface SearchOption<T> {
  select?: (keyof T)[];
  order?: { target: string; type: 'ASC' | 'DESC' };
  relations?: {
    target: string;
    select?: string[];
    order?: { target: string; type: 'ASC' | 'DESC' };
  }[];
  deepRelations?: {
    target: string;
    select?: string[];
    order?: { target: string; type: 'ASC' | 'DESC' };
  }[];
}

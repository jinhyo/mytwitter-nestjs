import { SearchOption } from 'src/commonTypes/findOption.interface';
import { UserRelation } from 'src/entities/userRelation.entity';

export interface UserRelationSearchOption extends SearchOption<UserRelation> {}

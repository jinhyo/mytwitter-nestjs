import { SearchOption } from 'src/commonTypes/findOption.interface';
import { User } from 'src/entities/user.entity';

export interface UserSearchOption extends SearchOption<User> {}

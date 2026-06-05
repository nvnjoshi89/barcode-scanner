import { SetMetadata } from '@nestjs/common';

export const TRANSACTIONAL_KEY = 'IS_TRANSACTIONAL';

export const Transactional = () => SetMetadata(TRANSACTIONAL_KEY, true);

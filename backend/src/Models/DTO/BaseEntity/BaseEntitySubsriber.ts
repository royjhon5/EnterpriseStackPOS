import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class BaseEntitySubscriber implements EntitySubscriberInterface<BaseEntity> {
  beforeInsert(event: InsertEvent<BaseEntity>) {
    const now = new Date();
    event.entity.dateCreated = now;
    event.entity.lastModifiedDate = now;
  }

  beforeUpdate(event: UpdateEvent<BaseEntity>) {
    if (event.entity) {
      event.entity.lastModifiedDate = new Date();
    }
  }
}

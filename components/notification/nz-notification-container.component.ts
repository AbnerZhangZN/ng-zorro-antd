import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';

import { NzMessageContainerComponent } from '../message/nz-message-container.component';
import { NzNotificationConfig, NZ_NOTIFICATION_CONFIG, NZ_NOTIFICATION_DEFAULT_CONFIG } from './nz-notification-config';
import { NzNotificationDataFilled, NzNotificationDataOptions } from './nz-notification.definitions';

@Component({
  changeDetection    : ChangeDetectionStrategy.OnPush,
  encapsulation      : ViewEncapsulation.None,
  selector           : 'nz-notification-container',
  preserveWhitespaces: false,
  templateUrl        : './nz-notification-container.component.html'
})
export class NzNotificationContainerComponent extends NzMessageContainerComponent {
  constructor(
    cdr: ChangeDetectorRef,
    @Optional() @Inject(NZ_NOTIFICATION_DEFAULT_CONFIG) defaultConfig: NzNotificationConfig,
    @Optional() @Inject(NZ_NOTIFICATION_CONFIG) config: NzNotificationConfig
  ) {
    super(cdr, defaultConfig, config);
  }

  /**
   * A list of notifications displayed on the screen.
   * @override
   */
  messages: Array<Required<NzNotificationDataFilled>> = [];

  /**
   * Create a new notification.
   * If there's a notification whose `nzKey` is same with `nzKey` in `NzNotificationDataFilled`, replace its content instead of create a new one.
   * @override
   * @param notification
   */
  createMessage(notification: NzNotificationDataFilled): void {
    notification.options = this._mergeMessageOptions(notification.options);
    notification.onClose = new Subject<boolean>();
    const key = notification.options.nzKey;
    const notificationWithSameKey = this.messages.find(
      msg => msg.options.nzKey === (notification.options as Required<NzNotificationDataOptions>).nzKey
    );

    if (key && notificationWithSameKey) {
      this.replaceNotification(notificationWithSameKey, notification);
    } else {
      if (this.messages.length >= this.config.nzMaxStack) {
        this.messages.splice(0, 1);
      }
      this.messages.push(notification as Required<NzNotificationDataFilled>);
    }
    this.cdr.detectChanges();
  }

  private replaceNotification(old: NzNotificationDataFilled, _new: NzNotificationDataFilled): void {
    old.title = _new.title;
    old.content = _new.content;
    old.template = _new.template;
    old.type = _new.type;
  }
}

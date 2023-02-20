import { notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";

export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}
const openNotificationWithIcon = (
  type: NotificationType,
  message: string,
  description: string,
  placement: NotificationPlacement = "topRight"
) => {
  notification[type]({
    message,
    description,
    placement,
  });
};

export default openNotificationWithIcon;

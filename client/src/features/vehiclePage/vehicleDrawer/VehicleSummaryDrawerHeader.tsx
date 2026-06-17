import { CarOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

interface VehicleSummaryDrawerHeaderProps {
  title: string;
}

export function VehicleSummaryDrawerHeader({
  title,
}: VehicleSummaryDrawerHeaderProps): React.ReactElement {
  return (
    <div className={styles.drawerTitle}>
      <CarOutlined className={styles.drawerTitleIcon} />
      <span>{title}</span>
    </div>
  );
}

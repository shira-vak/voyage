import { Tag } from "antd";
import styles from "./styles.module.css";

interface Props {
  licensePlate: string;
}

export function VehicleTag({ licensePlate }: Props): React.ReactElement {
  return (
    <div className={styles.plateWrapper}>
      <Tag color="green" className={styles.plate}>
        {licensePlate}
      </Tag>
    </div>
  );
}

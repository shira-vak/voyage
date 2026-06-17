import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import PageHeader from "../appLayout/common/PageHeader";

interface VehicleHeaderProps {
  setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const VehicleHeader: React.FC<VehicleHeaderProps> = ({
  setCreateOpen,
}) => {
  const { t } = useTranslation();

  return (
    <PageHeader
      title={t("vehicles.title")}
      action={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
        >
          {t("vehicles.addVehicle")}
        </Button>
      }
    />
  );
};

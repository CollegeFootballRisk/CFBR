import { Modal } from "@/shared/components/Modal";

interface VersionInformationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function VersionInformationModal({ open, onClose }: VersionInformationModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Version Information">
      <div className="text-left">
        <p>
          <span className="font-semibold">App Version:</span> {__APP_VERSION__}-{__GIT_BRANCH__}-
          {__GIT_COMMIT__}
        </p>

        <p>
          <span className="font-semibold">Browser Version:</span> {navigator.userAgent}
        </p>
      </div>
    </Modal>
  );
}

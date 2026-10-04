import { Modal } from "@/shared/components/Modal";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Login">
      <div className="space-y-4 text-center">
        <p>
          Howdy partner,
          <br />
          <br />
          In order to enjoy all of the functionality of CollegeFootballRisk and make your own moves,
          you'll need to log in.
        </p>

        <div className="flex flex-col gap-3">{/* Login buttons will go here */}</div>
      </div>
    </Modal>
  );
}

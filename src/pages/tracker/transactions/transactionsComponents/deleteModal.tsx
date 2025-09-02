import React from "react";
import { Modal, Button } from "semantic-ui-react";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>Delete Transaction</Modal.Header>
      <Modal.Content>
        <p>
          Are you sure you want to delete this transaction? This action cannot
          be undone.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="red" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteModal;

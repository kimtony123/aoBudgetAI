import React from "react";
import { Modal, Button } from "semantic-ui-react";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName?: string; // Make it optional if it might not always be provided
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  categoryName = "this category", // Default value if not provided
}) => {
  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>Delete Category</Modal.Header>
      <Modal.Content>
        <p>
          Are you sure you want to delete {categoryName}? This action cannot be
          undone.
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

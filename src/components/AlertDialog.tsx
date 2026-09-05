import { Fragment, MouseEventHandler, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Scripture } from "../types/scripture";

interface AlertDialogProps {
  scripture: Scripture;
  onDelete: (id: string) => void;
}

export default function AlertDialog({ scripture, onDelete }: AlertDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  const handleClose: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    setOpen(false);
  };

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    onDelete(scripture.id);
  };

  return (
    <Fragment>
      <button
        type="button"
        className="scripture-card-delete"
        aria-label={`Удалить: ${scripture.title}`}
        onClick={handleClickOpen}
      >
        <DeleteIcon fontSize="small" />
      </button>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
        onClick={(event) => event.stopPropagation()}
      >
        <DialogTitle id="alert-dialog-title">точно-точно?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            нееет не надо
          </Button>
          <Button onClick={handleDelete}>даа давай ураа</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

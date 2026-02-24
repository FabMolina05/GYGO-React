import { useState } from "react";
import "../styles/InviteModal.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
/**
 * InviteModal Component - Modal for inviting new users
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Callback to close modal
 * @param {Function} onInvite - Callback when invite is sent
 * @param {boolean} loading - Loading state for invite action
 */
const InviteModal = ({ isOpen, onClose, onInvite, loading }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("El correo electronico es obligatorio.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa una dirección de correo electrónico válida.");
      return;
    }
    
    onInvite(email);
     setEmail("");
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDTypography variant="h5">Invitar usuario al grupo</MDTypography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </MDBox>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <MDBox mb={2}>
            <TextField
              label="Correo Electronico"
              name="correoelectronico"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(error)}
              disabled={loading}
            />
            {error && (
              <MDTypography variant="caption" color="error">
                {error}
              </MDTypography>
            )}
          </MDBox>
        </form>
      </DialogContent>

      <DialogActions>
        <MDButton
          variant="outlined"
          color="error"
          onClick={handleClose}
          disabled={loading}
        >
          Cancelar
        </MDButton>
        <MDButton
          variant="gradient"
          color="success"
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar invitación"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default InviteModal;

//  <div className="modal-overlay" onClick={handleClose}>
//     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//       <div className="modal-header">
//         <h2>Invite User to Group</h2>
//         <button className="close-button" onClick={handleClose}>
//           ×
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="modal-body">
//         <div className="form-group">
//           <label htmlFor="email">Email Address</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter user's email address"
//             disabled={loading}
//             className={error ? "error" : ""}
//           />
//           {error && <span className="error-message">{error}</span>}
//         </div>

//         <div className="modal-footer">
//           <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>
//             Cancel
//           </button>
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? "Sending..." : "Send Invite"}
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>

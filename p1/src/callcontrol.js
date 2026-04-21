import { FiPhone, FiVideo } from "react-icons/fi";

function CallControls() {
  return (
    <div style={styles.container}>
      {/* Audio Call */}
      <div style={styles.button}>
        <FiPhone size={28} color="white" />
      </div>

      {/* Video Call */}
      <div style={styles.button}>
        <FiVideo size={28} color="white" />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#000"
  },

  button: {
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",

    // 🔥 Gradient like your image
    background: "linear-gradient(135deg, #6aa9ff, #7b6dff)",

    // smooth UI feel
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    transition: "0.3s"
  }
};

export default CallControls;
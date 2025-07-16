# Blockchain Authentication API Project

This README provides an overview of the project timeline, key milestones, and current status.

---

## Phase 1: Project Kickoff & Environment Setup

1. **Tech Stack Decision**

   * Chosen: Node.js, Express.js, MongoDB (Atlas free tier), ethers.js, Render for deployment.
2. **Project Initialization**

   * Initialized project with `npm init` and installed dependencies (`express`, `mongoose`, `ethers`, `dotenv`, `nodemon`).
   * Configured `server.js` for ES modules and MongoDB connection.

---

## Phase 2: Core Authentication Flow

3. **User Model & Registration**

   * Created `/models/User.js` (fields: `nickname`, `userAddress`).
   * Built `/controllers/userController.js` → `POST /api/auth/register`.
4. **Nonce Generation**

   * Created `/models/Nonce.js`.
   * Built `/controllers/authController.js` → `POST /api/auth/generate-nonce`.
   * Nonces are 32‑byte hex strings, expire in 3 minutes.
5. **Nonce Verification**

   * Extended `authController.js` → `POST /api/auth/verify-nonce`.
   * Used `ethers.verifyMessage()` to validate signatures.
   * Logged both successes and failures.

---

## Phase 3: Deployment & Client-Side Signing

6. **Render Deployment**

   * Fixed dynamic `PORT` handling for Render.
   * Ensured `Content-Type: application/json` for API requests.
7. **Client Wallet Automation**

   * Developed `signMessage.js` (Node script) and browser snippet using Web3 provider.
   * Automated flow: request nonce → sign with private key → verify via API.

---

## Phase 4: Nickname-Based Authentication (Optional Phase)

8. **Privacy Enhancement**

   * Updated endpoints to accept `nickname` instead of exposing `userAddress`.
   * Mapped `nickname ↔ public key` in the database.
   * Adjusted request/response flows accordingly.

---

## Phase 5: Blockchain‑Style Ledger Integration

9. **Ledger Schema**

   * Created `/models/Ledger.js` with fields: `userAddress`, `signature`, `status`, `ipAddress`, `isVPN`, `realIpAddress`, `timestamp`, and integrity `hash`.
   * Pre-save hook to generate SHA‑256 hash across all fields.
10. **Ledger Controller**

    * Built `/controllers/ledgerController.js` with:

      * `logAuthenticationAttempt()`
      * `getUserLoginHistory()`
      * `getAuthenticationLogs()`
      * `detectTampering()`
11. **Auth Controller Hook-Ins**

    * Modified `verifyNonce` to call `logAuthenticationAttempt()` on every attempt, passing IP/VPN data.
12. **Ledger Routes**

    * Added `/api/auth/auth-logs` to fetch all logs.

---

## Phase 6: Security Enhancements (In Progress)

13. **Tamper Detection**

    * Implemented `detectTampering()` to recompute and compare hashes.
    * Next: integrate admin-alert mechanism on detection.
14. **VPN & IP Verification**

    * Planned:

      * Capture `req.ip`, detect VPN via WebRTC or external API.
      * If VPN detected: run local script for real IP, then log it.
    * Schema support is in place; implementation pending.

---

## Current Status

* **Completed:** Core authentication flow, deployment, client signing, nickname mapping, ledger integration, hashing, log retrieval.
* **In Progress:** Tamper-detection alerts, VPN detection & real‑IP retrieval, admin notification.

---

*For detailed code examples and API documentation, refer to the `/docs` folder.*

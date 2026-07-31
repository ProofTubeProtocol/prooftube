;; ProofTube ($PROOF) Utility Token Contract
;; Implements SIP-010 Fungible Token Standard with 8 Decimal Precision (Proof-Sats)

(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token proof-token u100000000000000000) ;; 1,000,000,000 token supply with 8 decimals

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))

;; Token Info
(define-read-only (get-name)
  (ok "ProofTube Protocol Token"))

(define-read-only (get-symbol)
  (ok "PROOF"))

(define-read-only (get-decimals)
  (ok u8))

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance proof-token account)))

(define-read-only (get-total-supply)
  (ok (ft-get-supply proof-token)))

;; Transfer Execution
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR_UNAUTHORIZED)
    (ft-transfer? proof-token amount sender recipient)))

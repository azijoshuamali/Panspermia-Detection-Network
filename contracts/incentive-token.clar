;; Incentive Token

(define-fungible-token panspermia-token)

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INSUFFICIENT_BALANCE (err u101))

;; Public functions
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ft-mint? panspermia-token amount recipient)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR_NOT_AUTHORIZED)
    (ft-transfer? panspermia-token amount sender recipient)
  )
)

(define-public (burn (amount uint) (owner principal))
  (begin
    (asserts! (is-eq tx-sender owner) ERR_NOT_AUTHORIZED)
    (ft-burn? panspermia-token amount owner)
  )
)

;; Read-only functions
(define-read-only (get-balance (account principal))
  (ft-get-balance panspermia-token account)
)

(define-read-only (get-total-supply)
  (ft-get-supply panspermia-token)
)


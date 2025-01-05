;; Biosignature NFT

(define-non-fungible-token biosignature uint)

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INVALID_DATA (err u101))

;; Data structures
(define-map biosignature-data
  { id: uint }
  {
    name: (string-ascii 64),
    description: (string-ascii 256),
    discoverer: principal,
    timestamp: uint
  }
)

(define-data-var next-biosignature-id uint u0)

;; Public functions
(define-public (mint-biosignature (name (string-ascii 64)) (description (string-ascii 256)))
  (let
    (
      (biosignature-id (var-get next-biosignature-id))
    )
    (try! (nft-mint? biosignature biosignature-id tx-sender))
    (map-set biosignature-data
      { id: biosignature-id }
      {
        name: name,
        description: description,
        discoverer: tx-sender,
        timestamp: block-height
      }
    )
    (var-set next-biosignature-id (+ biosignature-id u1))
    (ok biosignature-id)
  )
)

(define-public (transfer-biosignature (id uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (unwrap! (nft-get-owner? biosignature id) ERR_NOT_AUTHORIZED)) ERR_NOT_AUTHORIZED)
    (try! (nft-transfer? biosignature id tx-sender recipient))
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-biosignature-data (id uint))
  (map-get? biosignature-data {id: id})
)

(define-read-only (get-biosignature-owner (id uint))
  (nft-get-owner? biosignature id)
)


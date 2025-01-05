;; Space Telescope Integration

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INVALID_DATA (err u101))

;; Data structures
(define-map telescopes
  { id: uint }
  {
    name: (string-ascii 64),
    location: (string-ascii 128),
    status: (string-ascii 20)
  }
)

(define-map telescope-data
  { telescope-id: uint, timestamp: uint }
  {
    data: (string-ascii 1024)
  }
)

(define-data-var next-telescope-id uint u0)

;; Public functions
(define-public (register-telescope (name (string-ascii 64)) (location (string-ascii 128)))
  (let
    (
      (telescope-id (var-get next-telescope-id))
    )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (map-set telescopes
      { id: telescope-id }
      {
        name: name,
        location: location,
        status: "active"
      }
    )
    (var-set next-telescope-id (+ telescope-id u1))
    (ok telescope-id)
  )
)

(define-public (submit-telescope-data (telescope-id uint) (data (string-ascii 1024)))
  (let
    (
      (telescope (unwrap! (map-get? telescopes {id: telescope-id}) ERR_INVALID_DATA))
    )
    (asserts! (is-eq (get status telescope) "active") ERR_INVALID_DATA)
    (ok (map-set telescope-data
      { telescope-id: telescope-id, timestamp: block-height }
      { data: data }
    ))
  )
)

(define-public (update-telescope-status (telescope-id uint) (new-status (string-ascii 20)))
  (let
    (
      (telescope (unwrap! (map-get? telescopes {id: telescope-id}) ERR_INVALID_DATA))
    )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-set telescopes
      { id: telescope-id }
      (merge telescope { status: new-status })
    ))
  )
)

;; Read-only functions
(define-read-only (get-telescope (id uint))
  (map-get? telescopes {id: id})
)

(define-read-only (get-telescope-data (telescope-id uint) (timestamp uint))
  (map-get? telescope-data {telescope-id: telescope-id, timestamp: timestamp})
)


;; Observation Data Management

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INVALID_DATA (err u101))

;; Data structures
(define-map observations
  { id: uint }
  {
    observer: principal,
    timestamp: uint,
    data: (string-ascii 256),
    status: (string-ascii 20)
  }
)

(define-map analysis-tasks
  { id: uint }
  {
    analyst: principal,
    observation-id: uint,
    status: (string-ascii 20)
  }
)

(define-data-var next-observation-id uint u0)
(define-data-var next-task-id uint u0)

;; Public functions
(define-public (submit-observation (data (string-ascii 256)))
  (let
    (
      (observation-id (var-get next-observation-id))
    )
    (map-set observations
      { id: observation-id }
      {
        observer: tx-sender,
        timestamp: block-height,
        data: data,
        status: "pending"
      }
    )
    (var-set next-observation-id (+ observation-id u1))
    (ok observation-id)
  )
)

(define-public (create-analysis-task (observation-id uint))
  (let
    (
      (task-id (var-get next-task-id))
    )
    (asserts! (is-some (map-get? observations {id: observation-id})) ERR_INVALID_DATA)
    (map-set analysis-tasks
      { id: task-id }
      {
        analyst: tx-sender,
        observation-id: observation-id,
        status: "assigned"
      }
    )
    (var-set next-task-id (+ task-id u1))
    (ok task-id)
  )
)

(define-public (update-observation-status (observation-id uint) (new-status (string-ascii 20)))
  (let
    (
      (observation (unwrap! (map-get? observations {id: observation-id}) ERR_INVALID_DATA))
    )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-set observations
      { id: observation-id }
      (merge observation { status: new-status })
    ))
  )
)

(define-public (update-task-status (task-id uint) (new-status (string-ascii 20)))
  (let
    (
      (task (unwrap! (map-get? analysis-tasks {id: task-id}) ERR_INVALID_DATA))
    )
    (asserts! (or (is-eq tx-sender (get analyst task)) (is-eq tx-sender CONTRACT_OWNER)) ERR_NOT_AUTHORIZED)
    (ok (map-set analysis-tasks
      { id: task-id }
      (merge task { status: new-status })
    ))
  )
)

;; Read-only functions
(define-read-only (get-observation (id uint))
  (map-get? observations {id: id})
)

(define-read-only (get-analysis-task (id uint))
  (map-get? analysis-tasks {id: id})
)


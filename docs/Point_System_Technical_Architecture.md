# Point System Technical Architecture

**Status:** Study draft 0.1  
**Purpose:** A technical model to be reviewed, challenged, redrawn, and rewritten before implementation.  
**Project:** Local Coordination Protocol / Point System  
**Authorial note:** This document proposes an architecture. It is not yet the protocol. The protocol begins when its assumptions and terms have been deliberately accepted.

---

## 1. The problem in ordinary language

The Point System is intended to let multiple local information networks operate independently while following a common protocol.

Inside each local network, Points collect information, interact, form relationships, and develop histories. The local network controls its own infrastructure and does not need a blockchain to perform ordinary work.

At selected moments, a local network may publish a representation of its work to the outside world. That publication must allow an outside system to determine:

1. which local system published it;
2. whether the publication has been altered;
3. which local contributions were included;
4. who authorized those contributions;
5. which permissions or license terms apply; and
6. who should be compensated if the resulting data package is sold.

The proposed architecture therefore separates **local operation** from **global publication and settlement**.

> The local system contains the life of the network. The global system contains selected, signed commitments made by that network.

---

## 2. Architectural thesis

The system is composed of independently operated local Point networks. Each network stores its detailed activity locally. A publisher selects permitted local events, packages them into a manifest, and commits a cryptographic representation of that package to a shared public blockchain registry.

The blockchain is not the Point database. It is the global registry through which disconnected systems can recognize publishers, verify package commitments, observe control changes, and settle economic transactions.

The smallest proposed technical stack is:

| Concern | Proposed mechanism |
|---|---|
| Local application | Cloudflare Workers |
| Structured local data | Cloudflare D1 |
| Media and package storage | Cloudflare R2 |
| Application language | TypeScript |
| Local identity and authorization | Public/private keys and digital signatures |
| Package integrity | Cryptographic hashes and Merkle roots |
| Global registry | A minimal Solidity contract on Base |
| Underlying settlement ecosystem | Ethereum |
| Initial indexing | The application's own Base event listener and D1 tables |
| Later shared indexing | The Graph, if external demand warrants it |
| Later payment | A stablecoin such as USDC on Base |

This architecture is deliberately hybrid. It uses conventional infrastructure for frequent, private, editable, and media-heavy activity. It uses blockchain only where unrelated systems require a shared, externally operated record.

---

## 3. Core concepts

### 3.1 Point

A Point is a unique information address within a Point network.

A Point may represent a place, person, object, event, organization, bot, monster, or abstract entity. The thing represented by a Point may move or change without changing the Point's identity.

A Point is not identical to:

- its QR code;
- its webpage;
- its database row;
- its physical referent;
- its current controller; or
- its blockchain representation.

Those are mechanisms or relationships surrounding the Point.

### 3.2 Local Point network

A local Point network is an independently operated system containing Points, events, relationships, interfaces, policies, and storage.

“Local” describes the system's operational boundary. It does not require one physical server or one geographic scale. A local network may run entirely on cloud infrastructure while remaining administratively and informationally independent.

### 3.3 Event

An event is a structured assertion that something occurred or was observed.

Examples:

- a Point was created;
- a log was added;
- an object changed location;
- two Points acknowledged a relationship;
- a participant contributed media;
- work was completed;
- a license was granted; or
- control was transferred.

An event is a claim, not automatically a truth. Its evidentiary weight depends on who signed it, what supporting material exists, and whether other participants or witnesses confirmed it.

### 3.4 Publisher

A publisher is an entity authorized to create a public representation of a local network's selected activity.

The publisher does not necessarily own every contribution. Its job is to validate, package, publish, and account for contributions under the applicable rules.

### 3.5 Manifest

A manifest is a structured description of a published batch or data package.

It states what the package claims to contain, which protocol version it follows, where the package can be retrieved, what its cryptographic root is, and what licensing or compensation rules apply.

### 3.6 Root Point

A Root Point is the globally registered public identity and entry point for a local Point network or publisher.

It functions as the public face of an underlying system. It does not contain the entire local network. It provides a stable reference through which outsiders can locate and verify published representations of that network.

### 3.7 Data package

A data package is a defined collection of permitted events, metadata, media, or derived information prepared for distribution, research, licensing, or sale.

### 3.8 Commitment

A commitment is a cryptographic fingerprint published now so that particular data can be proven later.

A commitment reveals little by itself. It allows someone possessing the underlying data to prove that the data existed in exactly that form when the commitment was published.

---

## 4. System boundaries

The architecture has three primary layers.

```text
LOCAL OPERATION
Points, events, relationships, media, permissions, private activity
        |
        | selected and authorized events
        v
PUBLICATION
Signed manifest, data package, Merkle root, contributor entitlements
        |
        | compact cryptographic commitment
        v
GLOBAL REGISTRY AND SETTLEMENT
Publisher identity, root history, control, package commitments, payments
```

### 4.1 What stays local

- Raw photographs, recordings, and documents
- Private or sensitive information
- Draft events
- Ordinary interface state
- Detailed Point histories not selected for publication
- Information requiring deletion or correction
- Local search indexes
- High-volume interactions

### 4.2 What may be publicly published off-chain

- Public manifests
- Public Point descriptions
- Selected signed events
- Public media
- Package documentation
- License text
- APIs and query interfaces

### 4.3 What belongs on-chain

- Root Point registration
- Publisher controller address
- Authorized publishing changes
- Package or batch Merkle roots
- Manifest hashes and retrieval references
- Publication sequence and previous-root links
- Contributor entitlement commitments
- Sale and settlement records when necessary

### 4.4 What should not go on-chain

- Personal identifying information
- Raw ethnographic records
- Photographs and audio
- Information that may require deletion
- Unverified accusations or observations
- Frequently changing descriptions
- Every individual local interaction

---

## 5. Identity, signatures, and authority

### 5.1 Key pairs

A cryptographic identity consists of:

- a **private key**, used to authorize or sign; and
- a **public key or address**, used by others to verify.

Possession of a private key demonstrates control of that cryptographic identity. It does not automatically demonstrate a legal name, physical identity, competence, truthfulness, or ownership of a real-world object.

### 5.2 Signed events

A signed local event conceptually contains:

```json
{
  "eventId": "event:...",
  "pointId": "point:...",
  "eventType": "observation.created",
  "payloadHash": "0x...",
  "creator": "actor:...",
  "createdAt": "2026-07-16T15:00:00Z",
  "licenseId": "license:...",
  "signature": "0x..."
}
```

Verification establishes that:

1. the event was signed by the corresponding key; and
2. the signed fields have not changed.

It does not establish that the event is true.

### 5.3 Publisher authorization

The Root Point registry associates a Root Point with a controller address. The contract accepts root publications only from the controller or an explicitly authorized publisher address.

Publisher authority must support:

- adding a publishing key;
- revoking a publishing key;
- transferring control;
- rotating compromised keys; and
- eventually recovering from lost keys.

For the first prototype, a single development wallet is sufficient. Before valuable packages or funds are involved, control should move to a recoverable smart account or multisignature arrangement.

---

## 6. Hashes and Merkle roots

### 6.1 Hash

A cryptographic hash converts data into a fixed-length fingerprint.

```text
data -> hash function -> fingerprint
```

Changing the data changes the fingerprint. A hash therefore supports integrity checking without placing the complete data on-chain.

### 6.2 Merkle tree

A Merkle tree combines the hashes of many events into one root hash.

```text
event A -> hash A --\
                      combined hash --\
event B -> hash B --/                  \
                                           Merkle root
event C -> hash C --\                  /
                      combined hash --/
event D -> hash D --/
```

The root commits to the complete set and arrangement of included events. An inclusion proof can demonstrate that one event belongs to the committed package without downloading every other event.

### 6.3 What a Merkle root proves

It can prove:

- that a particular event was included;
- that the event has not been altered; and
- that the package corresponds to the published root.

It cannot prove:

- that the event is true;
- that every local event was included;
- that omitted activity did not occur;
- that contributors consented, unless consent is separately represented; or
- that the package is valuable.

---

## 7. Publication lifecycle

### Step 1: Local creation

A Point creates or receives an event. The local application validates its schema, permissions, and required fields.

### Step 2: Origin authorization

The originating actor or Point signs the event, or the local system records the authenticated origin under a documented trust model.

### Step 3: Local storage

The event is stored in the local database. Associated media is stored separately and referenced by hash or identifier.

### Step 4: Selection

The publisher selects events eligible for public release or package inclusion. Selection applies privacy, consent, quality, and license rules.

### Step 5: Package construction

The selected events are normalized, deterministically ordered, and hashed. A Merkle tree produces a data root.

### Step 6: Entitlement construction

If compensation applies, the package calculates contributor entitlements. These records are hashed into a separate entitlement root.

### Step 7: Manifest creation

The publisher produces and signs a manifest describing the package.

### Step 8: Off-chain publication

The package and manifest are placed at public or access-controlled storage locations. The package may be replicated later, but replication is not required for the first build.

### Step 9: On-chain commitment

The publisher submits the manifest hash, data root, entitlement root, and retrieval reference to the Root Registry contract.

### Step 10: External verification

An outside system retrieves the manifest, verifies its hash against the chain, confirms publisher authorization, and verifies package events with Merkle proofs.

### Step 11: Sale and settlement

If the package is sold, payment is associated with the registered package. Revenue is distributed according to the entitlement rules.

---

## 8. Proposed local data model

The following is a conceptual starting model, not a final schema.

### Point

```text
id
name
type
description
creator_actor_id
controller_actor_id
status
created_at
updated_at
```

### Entrance

```text
id
marker_code
point_id
status
created_at
expires_at
```

An Entrance is a QR code, URL, NFC reference, or other route to a Point. Multiple Entrances may resolve to one Point.

### Actor

```text
id
display_name
public_key
identity_type
status
created_at
```

### Event

```text
id
point_id
event_type
payload_json
payload_hash
creator_actor_id
signature
license_id
visibility
created_at
```

### Relationship

```text
id
source_point_id
target_point_id
relationship_type
asserted_by_actor_id
status
created_at
```

### Publication

```text
id
root_point_id
sequence_number
previous_publication_id
manifest_uri
manifest_hash
data_root
entitlement_root
publisher_actor_id
chain_id
transaction_hash
published_at
```

### Package contribution

```text
package_id
event_id
contributor_actor_id
license_id
weight_or_share
contribution_hash
```

---

## 9. Manifest model

A manifest should be canonical: equivalent information must serialize identically before hashing. Otherwise harmless formatting differences will produce different hashes.

Conceptual example:

```json
{
  "protocol": "lcp-publication-1",
  "rootPointId": "root:eastside-lansing",
  "publisherAddress": "0x...",
  "sequence": 42,
  "previousRoot": "0x...",
  "dataRoot": "0x...",
  "entitlementRoot": "0x...",
  "eventCount": 813,
  "packageUri": "https://...",
  "licenseId": "license:lcp-research-1",
  "createdAt": "2026-07-16T15:00:00Z",
  "signature": "0x..."
}
```

The manifest should not claim more than the publication can prove. For example, it should say “813 events are included” rather than “this is everything that happened.”

---

## 10. Minimal on-chain registry

The first contract should be a registry, not a marketplace, token, DAO, or universal Point contract.

### Responsibilities

1. Register a Root Point and its controller.
2. Record sequential publication commitments.
3. Reject publications from unauthorized addresses.
4. Emit events that outside applications can index.
5. Allow controlled transfer or revocation.

### Conceptual contract interface

```solidity
interface IRootRegistry {
    event RootRegistered(
        bytes32 indexed rootPointId,
        address indexed controller
    );

    event RootPublished(
        bytes32 indexed rootPointId,
        uint256 indexed sequence,
        bytes32 dataRoot,
        bytes32 manifestHash,
        string manifestURI
    );

    event ControllerTransferred(
        bytes32 indexed rootPointId,
        address indexed oldController,
        address indexed newController
    );

    function registerRoot(bytes32 rootPointId) external;

    function publishRoot(
        bytes32 rootPointId,
        uint256 sequence,
        bytes32 dataRoot,
        bytes32 manifestHash,
        string calldata manifestURI
    ) external;

    function transferController(
        bytes32 rootPointId,
        address newController
    ) external;
}
```

This is illustrative. Security rules, upgrade strategy, recovery, URI design, replay protection, event ordering, and denial-of-service risks require separate review before deployment.

---

## 11. Ownership, licensing, and compensation

### 11.1 Do not assume facts are owned

The system should not casually claim ownership of an event in the abstract. A fact may not be property. The system can more precisely represent:

- authorship of submitted content;
- provenance of a signed record;
- permission to include a contribution in a dataset;
- contractual licensing rights;
- control of access to stored material; and
- entitlement to revenue.

These rights are partly technical and partly legal. Blockchain cannot create rights that the contributor never granted or that applicable law does not recognize.

### 11.2 Contributor authorization

Before an event enters a commercial package, the protocol should be able to answer:

1. Who contributed it?
2. What exactly did they authorize?
3. Can the authorization be revoked, and under what conditions?
4. Is commercial resale permitted?
5. Does the event contain information about other people?
6. How is compensation calculated?

### 11.3 Entitlement root

For a package with many contributors, individual payment records can be assembled off-chain and represented by one Merkle root.

Each entitlement leaf might contain:

```text
package ID
contributor address
share or amount
calculation version
```

The contract can later use proofs to permit claims. This avoids placing thousands of contributor records directly on-chain.

### 11.4 Separate registry from marketplace

The first Root Registry should prove publication. A later settlement contract may handle sale and compensation.

Separating them prevents unfinished economic assumptions from contaminating the foundational identity and publication system.

---

## 12. Why Base and Ethereum

### 12.1 Why use a public blockchain at all?

Without blockchain, the project would need to establish its own independent transparency logs, mirrors, monitors, witnesses, governance, and long-term operators. That is possible, but it creates a network-effect problem before the Point networks themselves exist.

A public blockchain supplies an existing external network capable of:

- verifying transaction authorization;
- ordering publications;
- replicating shared state;
- maintaining a public history;
- supporting independently operated indexers; and
- executing settlement rules.

### 12.2 Why not put everything on-chain?

Blockchain storage is public, permanent, constrained, and comparatively expensive. The local system requires privacy, deletion, correction, large media, fast interaction, and inexpensive experimentation.

Therefore, only compact commitments and consequential shared state belong on-chain.

### 12.3 Why Base?

Base is an Ethereum-compatible Layer 2 network. It preserves the Solidity/EVM development path while providing less expensive application transactions than direct Ethereum mainnet use.

This is an engineering choice, not a permanent metaphysical commitment. The protocol should identify chains explicitly and avoid defining a Point solely by one chain-specific address.

### 12.4 When Ethereum mainnet might be preferable

Direct Ethereum publication may be appropriate for infrequent, high-value, final package commitments where maximum neutrality is worth higher cost. It is unnecessary for every routine publication.

---

## 13. Indexing and discovery

Blockchain records are not automatically a usable knowledge graph.

The contract emits events. An indexer reads those events and builds a queryable representation.

The initial application can operate its own indexer:

```text
Base contract event
    -> Cloudflare listener
    -> D1 publisher/publication tables
    -> public API and directory
```

This is sufficient while there is one application and few publishers.

The Graph becomes useful when multiple external systems need a shared, independently accessible query layer. It should be introduced in response to actual interoperability demand, not merely because the project uses graph-shaped data.

Global discoverability therefore requires both:

1. an authoritative public registry; and
2. one or more indexes or directories that make registry entries searchable.

---

## 14. Trust and threat model

### 14.1 What the architecture can verify

- A particular key signed an event.
- A particular authorized publisher registered a root.
- Published data matches a committed hash.
- A particular event belongs to a committed package.
- A chain of package versions has not been silently rewritten.
- A contributor entitlement was included in a committed allocation.

### 14.2 What it cannot verify by itself

- That an observation is true.
- That a Point corresponds to a legitimate real-world claim.
- That a publication is complete.
- That omitted events did not exist.
- That consent was informed or legally valid.
- That a contributor's private key was not coerced or stolen.
- That a publisher's selection rules are fair.
- That the data package has economic value.

### 14.3 Principal threats

| Threat | Initial mitigation |
|---|---|
| Publisher forges local activity | Require origin signatures for consequential events |
| Publisher omits unfavorable activity | State selection rules; permit competing publishers or audits later |
| Stolen publisher key | Revocation and controller transfer; stronger account custody before value |
| Altered off-chain package | Manifest hash and data Merkle root |
| Package disappears | Replication and archival policy; blockchain hash alone does not preserve files |
| False real-world claim | Counter-signatures, evidence, witnesses, and dispute processes |
| Contributor not compensated | Committed entitlement records and auditable settlement |
| Private information exposed | Publication review, minimization, access controls, and off-chain storage |
| Duplicate or squatted identities | Namespaces, issuer authority, and explicit claim semantics |

---

## 15. Alternatives considered

### Conventional public database

Simplest operationally. Appropriate if all publishers trust one organization. It does not provide a neutral record when control, packages, or payments cross independent systems.

### Signed manifests without blockchain

Provides authorship and integrity. It does not independently establish publication time, availability, global ordering, or durable discovery.

### Public transparency logs

Can provide append-only publication and Merkle proofs. To obtain independence comparable to a public blockchain, the project must recruit logs, mirrors, witnesses, and monitors.

### Git repositories with signed commits

Useful for development and human-readable histories. They are not designed as a global economic settlement or application registry.

### One on-chain record per local Point

Provides direct global registration but adds cost, wallet dependence, spam, and permanent abandoned records to the most frequent operation. It is not necessary for locally functioning Points.

### Tokenizing every event

Confuses provenance, licensing, and compensation with transferable token ownership. It adds market and smart-contract complexity before the underlying rights have been defined.

---

## 16. Minimal build sequence

The architecture should be implemented from inside outward.

### Build 1 — Create a local Point

Enter a Point name and description, save it to D1, and display it.

**Understanding gained:** A Point can exist and function without blockchain.

### Build 2 — Create a local event

Attach one structured event to a Point and display the Point's history.

**Understanding gained:** Local history is a collection of assertions.

### Build 3 — Hash and sign an event

Canonicalize an event, calculate its hash, sign it, and verify the signature.

**Understanding gained:** Authorship and integrity are separate from truth.

### Build 4 — Create a manifest

Select several events, construct a deterministic package, and write a signed manifest.

**Understanding gained:** Publication is a deliberate transformation from local activity into an external claim.

### Build 5 — Construct a Merkle root

Build a Merkle tree and verify one event with an inclusion proof.

**Understanding gained:** One compact root can commit to a large package.

### Build 6 — Build the Root Registry locally

Write and test the minimal Solidity contract with Foundry.

**Understanding gained:** The contract governs authority and sequencing, not raw data.

### Build 7 — Publish on Base Sepolia

Deploy the registry to a test network and publish one manifest commitment.

**Understanding gained:** A disconnected outside system can verify the publisher and package commitment.

### Build 8 — Index the registry

Read contract events into D1 and present a public publisher/package directory.

**Understanding gained:** A blockchain record still requires an interface and index to become discoverable.

### Build 9 — Model contribution rights

Define one explicit license and one entitlement calculation for a sample package.

**Understanding gained:** Authorship, licensing, and compensation are different relationships.

### Build 10 — Test one package sale

Use test assets to simulate payment and contributor distribution.

**Understanding gained:** Settlement is a later economic layer built on verified publication.

---

## 17. Decisions intentionally deferred

The following should not be decided until the preceding machinery is understood:

- Whether individual Points can register globally
- Whether Root Points are transferable assets
- Whether a token is needed
- Whether a DAO controls any component
- The final compensation formula
- The legal form of data licenses
- Whether packages are sold, subscribed to, or queried under usage metering
- Whether storage should be replicated through IPFS, Arweave, Filecoin, or conventional archives
- Whether The Graph is necessary
- Whether publishers must stake value or build reputation
- How disputes and corrections operate
- How anonymous contributors are handled
- How key recovery works at scale
- How multiple chains would be supported

Deferral is not avoidance. It protects the foundational protocol from decisions that currently lack evidence.

---

## 18. Study questions

These questions are intended to convert this draft into an architecture you own.

1. What exactly makes a Point unique: its generated identifier, its creator, its controller, or its referent?
2. Can two networks create Points referring to the same physical thing? If so, how are those claims related?
3. Which events require an origin signature, and which may be recorded by the local system alone?
4. What does the publisher promise when it publishes a package?
5. Is a publication meant to be complete, representative, curated, or merely validly assembled?
6. Who decides whether an event may be commercialized?
7. What is being sold: files, access, a license, a query service, or a derived analysis?
8. What contribution deserves compensation: observation, verification, curation, storage, interpretation, or all of them?
9. What should happen when a contributor withdraws consent after a root has been published?
10. What must remain meaningful if Cloudflare, Base, the publisher, or the original application disappears?
11. Which claims require local witnesses, and what qualifies someone to witness them?
12. Can competing publishers produce different packages from the same local network?
13. What would make an outside buyer trust the methodology rather than merely verify the hashes?
14. At what moment does blockchain remove more complexity than it adds?

---

## 19. Compact glossary

| Term | Meaning in this architecture |
|---|---|
| Point | A unique information address |
| Entrance | A QR code, URL, or marker resolving to a Point |
| Actor | A person, system, organization, or Point performing an action |
| Event | A structured assertion that something occurred |
| Signature | Proof that a key authorized exact data |
| Hash | A cryptographic fingerprint of data |
| Merkle root | One hash committing to a collection of items |
| Inclusion proof | Evidence that one item belongs to a Merkle root |
| Local network | An independently operated Point system |
| Publisher | An entity authorized to package and publish selected work |
| Manifest | A signed description of a publication or package |
| Root Point | The globally registered public face of a local system |
| Registry | The on-chain record of Root Points and publications |
| Indexer | A system that converts chain events into searchable data |
| Provenance | The traceable origin and history of information |
| License | Permission governing use of a contribution or package |
| Entitlement | A contributor's recorded claim to compensation |
| Settlement | Execution and recording of payment obligations |

---

## 20. Current architectural statement

> The Point System is a protocol for independently operated local information networks. Each network creates Points, records local events, and maintains its detailed history using ordinary application infrastructure. A publisher may select authorized events and assemble them into signed manifests and data packages. The packages remain off-chain, while cryptographic roots, publisher authority, version history, contributor entitlements, and later economic settlement are recorded through a minimal public registry on Base. This allows disconnected Point systems to remain locally autonomous while making selected work globally discoverable, verifiable, and economically accountable.

---

## 21. Recommended reading order

Do not attempt to memorize the document. Review it in this order:

1. Sections 1–4: reconstruct the machine in your own drawing.
2. Sections 5–7: understand signatures, hashes, roots, and publication.
3. Sections 11 and 14: challenge what “ownership,” “truth,” and “verification” mean.
4. Section 16: connect each concept to one future build.
5. Section 18: answer the study questions in your own words.
6. Only then review the data model and contract interface in Sections 8–10.

The document becomes yours when you can remove a component, explain what breaks, and defend whether that break matters.

---

## 22. Primary technical references

- Ethereum Layer 2 overview: https://ethereum.org/layer-2/
- Base developer entry point: https://docs.base.org/
- Solidity documentation: https://docs.soliditylang.org/
- Foundry documentation: https://getfoundry.sh/
- The Graph documentation: https://thegraph.com/docs/
- Cloudflare Workers documentation: https://developers.cloudflare.com/workers/
- Cloudflare D1 documentation: https://developers.cloudflare.com/d1/
- Cloudflare R2 documentation: https://developers.cloudflare.com/r2/


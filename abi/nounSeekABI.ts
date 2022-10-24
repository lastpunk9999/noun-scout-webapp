const abi = [
  {
    inputs: [
      {
        internalType: "contract INounsTokenLike",
        name: "_nouns",
        type: "address",
      },
      {
        internalType: "contract INounsAuctionHouseLike",
        name: "_auctionHouse",
        type: "address",
      },
      {
        internalType: "contract IWETH",
        name: "_weth",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InactiveDonee",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
    ],
    name: "MatchFound",
    type: "error",
  },
  {
    inputs: [],
    name: "NoMatch",
    type: "error",
  },
  {
    inputs: [],
    name: "TooLate",
    type: "error",
  },
  {
    inputs: [],
    name: "ValueTooLow",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256[]",
        name: "donations",
        type: "uint256[]",
      },
    ],
    name: "Donated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "doneeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    name: "DoneeActiveStatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "doneeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "DoneeAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "traitId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "newNonce",
        type: "uint16",
      },
    ],
    name: "Matched",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newMinValue",
        type: "uint256",
      },
    ],
    name: "MinValueChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "matcher",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Reimbursed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newReimbursementBPS",
        type: "uint256",
      },
    ],
    name: "ReimbursementBPSChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        indexed: true,
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "traitId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "doneeId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "nonce",
        type: "uint16",
      },
    ],
    name: "RequestAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        indexed: true,
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "traitId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "doneeId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amounts",
        type: "uint256",
      },
    ],
    name: "RequestRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "ANY_ID",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "AUCTION_END_LIMIT",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_REIMBURSEMENT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_REIMBURSEMENT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "_donees",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "accessoryCount",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "traitId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "doneeId",
        type: "uint16",
      },
    ],
    name: "add",
    outputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "addDonee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "traitId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "doneeId",
        type: "uint16",
      },
    ],
    name: "amountForDoneeByTrait",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    name: "amounts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "auctionHouse",
    outputs: [
      {
        internalType: "contract INounsAuctionHouseLike",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "backgroundCount",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bodyCount",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "donationsAndReimbursementForPreviousNoun",
    outputs: [
      {
        internalType: "uint16",
        name: "auctionedNounId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "nonAuctionedNounId",
        type: "uint16",
      },
      {
        internalType: "uint256[][5]",
        name: "auctionedNounDonations",
        type: "uint256[][5]",
      },
      {
        internalType: "uint256[][5]",
        name: "nonAuctionedNounDonations",
        type: "uint256[][5]",
      },
      {
        internalType: "uint256[5]",
        name: "totalDonationsPerTrait",
        type: "uint256[5]",
      },
      {
        internalType: "uint256[5]",
        name: "reimbursementPerTrait",
        type: "uint256[5]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
    ],
    name: "donationsAndReimbursementForPreviousNounByTrait",
    outputs: [
      {
        internalType: "uint16",
        name: "auctionedNounId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "nonAuctionedNounId",
        type: "uint16",
      },
      {
        internalType: "uint256[]",
        name: "auctionedNounDonations",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "nonAuctionedNounDonations",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "totalDonations",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reimbursement",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "donationsForCurrentNoun",
    outputs: [
      {
        internalType: "uint16",
        name: "currentAuctionedId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "prevNonAuctionedId",
        type: "uint16",
      },
      {
        internalType: "uint256[][5]",
        name: "currentAuctionDonations",
        type: "uint256[][5]",
      },
      {
        internalType: "uint256[][5]",
        name: "prevNonAuctionDonations",
        type: "uint256[][5]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
    ],
    name: "donationsForCurrentNounByTrait",
    outputs: [
      {
        internalType: "uint16",
        name: "currentAuctionedId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "prevNonAuctionedId",
        type: "uint16",
      },
      {
        internalType: "uint256[]",
        name: "currentAuctionDonations",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "prevNonAuctionDonations",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "donationsForNextNoun",
    outputs: [
      {
        internalType: "uint16",
        name: "nextAuctionedId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "nextNonAuctionedId",
        type: "uint16",
      },
      {
        internalType: "uint256[][][5]",
        name: "nextAuctionDonations",
        type: "uint256[][][5]",
      },
      {
        internalType: "uint256[][][5]",
        name: "nextNonAuctionDonations",
        type: "uint256[][][5]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
    ],
    name: "donationsForNextNounByTrait",
    outputs: [
      {
        internalType: "uint16",
        name: "nextAuctionedId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "nextNonAuctionedId",
        type: "uint16",
      },
      {
        internalType: "uint256[][]",
        name: "nextAuctionDonations",
        type: "uint256[][]",
      },
      {
        internalType: "uint256[][]",
        name: "nextNonAuctionDonations",
        type: "uint256[][]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
    ],
    name: "donationsForNounId",
    outputs: [
      {
        internalType: "uint256[][][5]",
        name: "donations",
        type: "uint256[][][5]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
    ],
    name: "donationsForNounIdByTrait",
    outputs: [
      {
        internalType: "uint256[][]",
        name: "donationsByTraitId",
        type: "uint256[][]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "donees",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
        ],
        internalType: "struct NounSeek.Donee[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "doneesCount",
    outputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
    ],
    name: "effectiveBPSAndReimbursementForDonationTotal",
    outputs: [
      {
        internalType: "uint256",
        name: "effectiveBPS",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reimbursement",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "glassesCount",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "headCount",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
    ],
    name: "matchAndDonate",
    outputs: [
      {
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reimbursement",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxReimbursementBPS",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "traitId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
    ],
    name: "nonceForTraits",
    outputs: [
      {
        internalType: "uint16",
        name: "nonce",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum NounSeek.Traits[]",
        name: "traits",
        type: "uint8[]",
      },
      {
        internalType: "uint16[]",
        name: "traitIds",
        type: "uint16[]",
      },
      {
        internalType: "uint16[]",
        name: "nounIds",
        type: "uint16[]",
      },
    ],
    name: "noncesForTraits",
    outputs: [
      {
        internalType: "uint16[]",
        name: "noncesList",
        type: "uint16[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nouns",
    outputs: [
      {
        internalType: "contract INounsTokenLike",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "remove",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "requestById",
    outputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "nonce",
            type: "uint16",
          },
          {
            internalType: "enum NounSeek.Traits",
            name: "trait",
            type: "uint8",
          },
          {
            internalType: "uint16",
            name: "traitId",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "doneeId",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "nounId",
            type: "uint16",
          },
          {
            internalType: "uint128",
            name: "amount",
            type: "uint128",
          },
        ],
        internalType: "struct NounSeek.Request",
        name: "request",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "nonce",
            type: "uint16",
          },
          {
            internalType: "enum NounSeek.Traits",
            name: "trait",
            type: "uint8",
          },
          {
            internalType: "uint16",
            name: "traitId",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "doneeId",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "nounId",
            type: "uint16",
          },
          {
            internalType: "uint128",
            name: "amount",
            type: "uint128",
          },
        ],
        internalType: "struct NounSeek.Request",
        name: "request",
        type: "tuple",
      },
      {
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
    ],
    name: "requestMatchesNoun",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum NounSeek.Traits",
        name: "requestTrait",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "requestTraitId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "requestNounId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
    ],
    name: "requestParamsMatchNounParams",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "requester",
        type: "address",
      },
    ],
    name: "requestsActiveByAddress",
    outputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "nonce",
            type: "uint16",
          },
          {
            internalType: "enum NounSeek.Traits",
            name: "trait",
            type: "uint8",
          },
          {
            internalType: "uint16",
            name: "traitId",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "doneeId",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "nounId",
            type: "uint16",
          },
          {
            internalType: "uint128",
            name: "amount",
            type: "uint128",
          },
        ],
        internalType: "struct NounSeek.Request[]",
        name: "requests",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "requester",
        type: "address",
      },
    ],
    name: "requestsByAddress",
    outputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "nonce",
            type: "uint16",
          },
          {
            internalType: "enum NounSeek.Traits",
            name: "trait",
            type: "uint8",
          },
          {
            internalType: "uint16",
            name: "traitId",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "doneeId",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "nounId",
            type: "uint16",
          },
          {
            internalType: "uint128",
            name: "amount",
            type: "uint128",
          },
        ],
        internalType: "struct NounSeek.Request[]",
        name: "requests",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newMinValue",
        type: "uint256",
      },
    ],
    name: "setMinValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "newReimbursementBPS",
        type: "uint16",
      },
    ],
    name: "setReimbursementBPS",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "doneeId",
        type: "uint256",
      },
    ],
    name: "toggleDoneeActive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "traitId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
    ],
    name: "traitHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateTraitCounts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "weth",
    outputs: [
      {
        internalType: "contract IWETH",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
export default abi;

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
    name: "AlreadyRemoved",
    type: "error",
  },
  {
    inputs: [],
    name: "AuctionEndingSoon",
    type: "error",
  },
  {
    inputs: [],
    name: "DonationAlreadySent",
    type: "error",
  },
  {
    inputs: [],
    name: "InactiveDonee",
    type: "error",
  },
  {
    inputs: [],
    name: "IneligibleNounId",
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
        indexed: true,
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "traitsHash",
        type: "bytes32",
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
        name: "newMaxReimbursement",
        type: "uint256",
      },
    ],
    name: "MaxReimbursementChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newMessageValue",
        type: "uint256",
      },
    ],
    name: "MessageValueChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newMinReimbursement",
        type: "uint256",
      },
    ],
    name: "MinReimbursementChanged",
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
        indexed: true,
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
        name: "doneeId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "traitsHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
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
        indexed: true,
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "doneeId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "traitsHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
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
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "addWithMessage",
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
    name: "baseReimbursementBPS",
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
    name: "donationsForMatchableNoun",
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
    name: "donationsForNounIdByTraitId",
    outputs: [
      {
        internalType: "uint256[]",
        name: "donations",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "donationsForNounOnAuction",
    outputs: [
      {
        internalType: "uint16",
        name: "currentAuctionId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "prevNonAuctionId",
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
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
    ],
    name: "donationsForOnChainNoun",
    outputs: [
      {
        internalType: "uint256[][5]",
        name: "donations",
        type: "uint256[][5]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "donationsForUpcomingNoun",
    outputs: [
      {
        internalType: "uint16",
        name: "nextAuctionId",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "nextNonAuctionId",
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
    inputs: [],
    name: "maxReimbursement",
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
    name: "messageValue",
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
    name: "minReimbursement",
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
    name: "rawRequestById",
    outputs: [
      {
        components: [
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
        internalType: "address",
        name: "requester",
        type: "address",
      },
    ],
    name: "rawRequestsByAddress",
    outputs: [
      {
        components: [
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
        components: [
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
            internalType: "uint256",
            name: "id",
            type: "uint256",
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
          {
            internalType: "enum NounSeek.RequestStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct NounSeek.RequestWithStatus[]",
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
        name: "doneeId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    name: "setDoneeActive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newMaxReimbursement",
        type: "uint256",
      },
    ],
    name: "setMaxReimbursement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newMessageValue",
        type: "uint256",
      },
    ],
    name: "setMessageValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newMinReimbursement",
        type: "uint256",
      },
    ],
    name: "setMinReimbursement",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "enum NounSeek.Traits",
        name: "trait",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "nounId",
        type: "uint16",
      },
      {
        internalType: "uint16[]",
        name: "doneeIds",
        type: "uint16[]",
      },
    ],
    name: "settle",
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
